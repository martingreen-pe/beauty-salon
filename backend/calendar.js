const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');

async function crearEventoCalendar() {
  // Autenticación
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, 'credenciales.json'), // Credenciales de OAuth
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  const evento = {
    summary: 'Cita en el salón de belleza',
    description: 'Recordatorio de cita con cliente.',
    start: {
      dateTime: '2024-09-21T09:00:00-05:00', // Fecha y hora de inicio
      timeZone: 'America/Lima',
    },
    end: {
      dateTime: '2024-09-21T09:30:00-05:00', // Fecha y hora de fin
      timeZone: 'America/Lima',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // Recordatorio por email
        { method: 'popup', minutes: 10 }, // Notificación emergente
      ],
    },
  };

  calendar.events.insert(
    {
      calendarId: 'primary', // Tu calendario principal
      resource: evento,
    },
    (err, event) => {
      if (err) {
        console.error('Error al crear el evento en Google Calendar:', err);
        return;
      }
      console.log('Evento creado:', event.data.htmlLink);
    }
  );
}

crearEventoCalendar();
