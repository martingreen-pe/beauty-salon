const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const { getGoogleCalendar } = require('./calendarAuth');

// Obtener la zona horaria desde la variable de entorno o establecer un valor predeterminado
const timeZone = process.env.TIMEZONE || 'America/Lima';

// Ruta para obtener todas las citas
router.get('/citas', async (req, res) => {
  try {
    const citas = await Cliente.find();  // Obtener todas las citas de la base de datos
    res.status(200).json(citas);  // Enviar el array de citas como respuesta
  } catch (error) {
    console.error('Error al obtener las citas:', error);
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
});

// Ruta para registrar una nueva cita
router.post('/crear', async (req, res) => {
  const { nombre, fechaCita, horaCita, telefono, servicios, retoque } = req.body;
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
      servicios,
      retoque,
    });
    const citaGuardada = await nuevaCita.save();

    // Obtener el cliente de Google Calendar
    const calendar = await getGoogleCalendar();

    // Crear el evento en Google Calendar con la fecha y hora de la cita
    const eventoPrincipal = {
      summary: `Cita en el salón de belleza con ${nombre}`,
      description: `Cita programada con ${nombre}, Teléfono: ${telefono}, Servicios: ${servicios}`,
      start: {
        dateTime: fechaHoraCita.toISOString(),
        timeZone: timeZone, // Usa la zona horaria configurada
      },
      end: {
        dateTime: new Date(fechaHoraCita.getTime() + 30 * 60000).toISOString(),
        timeZone: timeZone, // Igual que el start
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
    try {
      const event = await calendar.events.insert({
        calendarId: 'primary',
        resource: eventoPrincipal,
      });
      console.log('Evento principal creado en Google Calendar:', event.data.htmlLink);

      // Solo si el servicio es "pestañas: extensiones", programar el retoque automático
      if (servicios === 'pestañas: extensiones') {
        const fechaRetoque = new Date(fechaHoraCita);
        fechaRetoque.setDate(fechaRetoque.getDate() + 12); // Agregar 12 días para el retoque
        console.log("Fecha de retoque calculada:", fechaRetoque);

        const eventoRetoque = {
          summary: `Retoque de Pestañas - ${nombre}`,
          description: `Recordatorio de retoque de pestañas para ${nombre}. Teléfono: ${telefono}`,
          start: {
            dateTime: fechaRetoque.toISOString(),
            timeZone: timeZone,
          },
          end: {
            dateTime: new Date(fechaRetoque.getTime() + 30 * 60000).toISOString(),
            timeZone: timeZone,
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 3 * 24 * 60 }, // Recordatorio 3 días antes
              { method: 'popup', minutes: 10 }, // Notificación emergente 10 minutos antes
            ],
          },
        };

        await calendar.events.insert({
          calendarId: 'primary',
          resource: eventoRetoque,
        });
        console.log('Evento de retoque creado en Google Calendar');
      }

      return res.status(201).json({
        mensaje: 'Cita registrada correctamente y evento(s) añadido(s) a Google Calendar',
        cita: citaGuardada,
      });
    } catch (calendarError) {
      console.error('Error al crear los eventos en Google Calendar:', calendarError.message);
      return res.status(500).json({ error: 'Error al crear los eventos en Google Calendar' });
    }

  } catch (err) {
    console.error('Error al guardar la cita:', err.message);
    return res.status(500).json({ error: 'Error al registrar la cita' });
  }
});

module.exports = router;
