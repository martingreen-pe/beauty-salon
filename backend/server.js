const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Ruta básica
app.get('/', (req, res) => {
  res.send('Bienvenido al backend de Beauty Salon');
});

// Middleware para leer JSON
app.use(express.json());

// Habilitar CORS
const allowedOrigins = [
  'http://localhost:3000', 
  'http://192.168.0.104:3000',  // Tu IP local para acceso desde dispositivos móviles
  'https://beauty-salon-citas.netlify.app'  // El frontend en producción
];

// Configuración CORS
app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como archivos locales o ciertas apps móviles)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
  credentials: true,  // Si utilizas cookies o autenticación basada en sesión
}));

// Conectar a MongoDB
mongoose.connect('mongodb+srv://martinenriquepe:bwbEoDbX7KW5WzW5@beauty-salon.mswkl.mongodb.net/?retryWrites=true&w=majority&appName=beauty-salon')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.log(err));

// Usar rutas
app.use('/api/clientes', require('./routes/cliente'));

// **Servir el frontend desde la carpeta raíz**
app.use(express.static(path.join(__dirname, '../build')));

// Servir index.html para rutas no manejadas por las APIs
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Puerto y servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
