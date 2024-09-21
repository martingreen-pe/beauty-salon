const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('@google-cloud/local-auth');

let authClient = null;
const TOKEN_PATH = path.join(__dirname, 'token.json');

// Autenticar una sola vez y guardar el token
async function authenticateGoogle() {
  if (authClient) return authClient;

  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    authClient = new google.auth.OAuth2();
    authClient.setCredentials(JSON.parse(token));

    // Verificar si el token ha expirado y refrescarlo
    if (Date.now() >= authClient.credentials.expiry_date) {
      try {
        const { credentials } = await authClient.refreshAccessToken();
        authClient.setCredentials(credentials);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
        console.log('Token renovado y guardado');
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        throw new Error('Error al refrescar el token');
      }
    } else {
      console.log('Usando token existente');
    }
  } else {
    authClient = await authenticate({
      keyfilePath: path.join(__dirname, '../credenciales.json'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    const token = authClient.credentials;
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log('Autenticado con Google y token guardado');
  }

  return authClient;
}

async function getGoogleCalendar() {
  const auth = await authenticateGoogle();
  return google.calendar({ version: 'v3', auth });
}

// Ruta para manejar la redirección OAuth
router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Código de autorización no encontrado');
  }

  try {
    const { tokens } = await authClient.getToken(code);
    authClient.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token actualizado y guardado');
    res.redirect('/');
  } catch (error) {
    console.error('Error al obtener el token de Google:', error);
    res.status(500).send('Error al obtener el token');
  }
});

module.exports = { getGoogleCalendar, router };
