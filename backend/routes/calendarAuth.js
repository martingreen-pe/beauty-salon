const { google } = require('googleapis');
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');

let authClient = null;

// Autenticar una sola vez y guardar el token
async function authenticateGoogle() {
  if (!authClient) {
    authClient = await authenticate({
      keyfilePath: path.join(__dirname, '../credenciales.json'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    console.log('Autenticado con Google');
  }
  return authClient;
}

// Obtener el cliente de Google Calendar
async function getGoogleCalendar() {
  const auth = await authenticateGoogle();
  return google.calendar({ version: 'v3', auth });
}

module.exports = { getGoogleCalendar };
