const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const { getGoogleCalendar } = require('./calendarAuth');

// Ruta para registrar una nueva cita
router.post('/crear', async (req, res) => {
  const { nombre, fechaCita, horaCita, telefono, servicios } = req.body;
  console.log('Datos recibidos:', { nombre, fechaCita, horaCita, telefono, servicios });

  if (!nombre || !fechaCita || !horaCita || !telefono || !servicios) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    // Combinar fecha y hora de la cita
    const fechaHoraCita = new Date(`${fechaCita}T${horaCita}`);
    const nuevaCita = new Cliente({
      nombre,
      fechaCita: fechaHoraCita,
      telefono,
      servicios
    });
    const citaGuardada = await nuevaCita.save();

    // Obtener el cliente de Google Calendar
    const calendar = await getGoogleCalendar();

    // Crear el evento en Google Calendar con la fecha y hora de la cita
    const eventoPrincipal = {
      summary: `Cita en el salón de belleza con ${nombre}`,
      description: `Cita programada con ${nombre}, Teléfono: ${telefono}, Servicios: ${servicios}`,
      start: {
        dateTime: fechaHoraCita.toISOString(), // Fecha y hora combinadas
        timeZone: 'America/Lima',
      },
      end: {
        dateTime: new Date(fechaHoraCita.getTime() + 30 * 60000).toISOString(), // Duración 30 minutos
        timeZone: 'America/Lima',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // Recordatorio 24 horas antes
          { method: 'popup', minutes: 10 }, // Notificación emergente 10 minutos antes
        ],
      },
    };

    // Insertar el evento principal en Google Calendar
    calendar.events.insert({
      calendarId: 'primary',
      resource: eventoPrincipal,
    }, (err, event) => {
      if (err) {
        console.error('Error al crear el evento en Google Calendar:', err.message);
        return res.status(500).json({ error: 'Error al crear el evento en Google Calendar' });
      }
      console.log('Evento principal creado en Google Calendar:', event.data.htmlLink);
    });

    // Solo si el servicio es "pestañas: extensiones", programar el retoque automático
    if (servicios === 'pestañas: extensiones') {
      const fechaRetoque = new Date(fechaHoraCita);
      fechaRetoque.setDate(fechaRetoque.getDate() + 12); // Agregar 12 días para el retoque
      console.log("Fecha de retoque calculada:", fechaRetoque); // Comprobar la fecha calculada

      const eventoRetoque = {
        summary: `Retoque de Pestañas - ${nombre}`,
        description: `Recordatorio de retoque de pestañas para ${nombre}. Teléfono: ${telefono}`,
        start: {
          dateTime: fechaRetoque.toISOString(),
          timeZone: 'America/Lima',
        },
        end: {
          dateTime: new Date(fechaRetoque.getTime() + 30 * 60000).toISOString(), // Duración 30 minutos
          timeZone: 'America/Lima',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 3 * 24 * 60 }, // Recordatorio 3 días antes
            { method: 'popup', minutes: 10 }, // Notificación emergente 10 minutos antes
          ],
        },
      };

      // Insertar el evento de retoque en Google Calendar
      calendar.events.insert({
        calendarId: 'primary',
        resource: eventoRetoque,
      }, (err, event) => {
        if (err) {
          console.error('Error al crear el evento de retoque en Google Calendar:', err.message);
          return res.status(500).json({ error: 'Error al crear el evento de retoque en Google Calendar' });
        }
        console.log('Evento de retoque creado en Google Calendar:', event.data.htmlLink);
      });
    }

    res.status(201).json({
      mensaje: 'Cita registrada correctamente y evento(s) añadido(s) a Google Calendar',
      cita: citaGuardada,
    });
  } catch (err) {
    console.error('Error al guardar la cita:', err.message);
    res.status(500).json({ error: 'Error al registrar la cita' });
  }
});

// Rutas para obtener, eliminar y editar citas
router.get('/citas', async (req, res) => {
  try {
    const citas = await Cliente.find();
    res.status(200).json(citas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
});

router.delete('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const citaEliminada = await Cliente.findByIdAndDelete(id);
    if (!citaEliminada) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.status(200).json({ mensaje: 'Cita eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la cita' });
  }
});

router.put('/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, fechaCita, horaCita, telefono, servicios } = req.body;

  try {
    const fechaHoraCita = new Date(`${fechaCita}T${horaCita}`);
    const citaActualizada = await Cliente.findByIdAndUpdate(
      id,
      { nombre, fechaCita: fechaHoraCita, telefono, servicios },
      { new: true }
    );

    if (!citaActualizada) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    res.status(200).json({ mensaje: 'Cita actualizada correctamente', cita: citaActualizada });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la cita' });
  }
});

module.exports = router;
