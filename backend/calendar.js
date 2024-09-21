const { getGoogleCalendar } = require('./calendarAuth');

async function crearEventoCalendar() {
  try {
    const calendar = await getGoogleCalendar();

    const evento = {
      summary: 'Cita en el salón de belleza',
      description: 'Recordatorio de cita con cliente.',
      start: {
        dateTime: '2024-09-21T09:00:00-05:00',
        timeZone: 'America/Lima',
      },
      end: {
        dateTime: '2024-09-21T09:30:00-05:00',
        timeZone: 'America/Lima',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    calendar.events.insert({
      calendarId: 'primary',
      resource: evento,
    }, (err, event) => {
      if (err) {
        console.error('Error al crear el evento en Google Calendar:', err);
        return;
      }
      console.log('Evento creado:', event.data.htmlLink);
    });
  } catch (error) {
    console.error('Error al crear el evento en Google Calendar:', error);
  }
}

crearEventoCalendar();
