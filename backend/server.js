const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware para leer JSON
app.use(express.json());

// Habilitar CORS
const allowedOrigins = [
  'http://localhost:3000', 
  'http://192.168.0.104:3000',  // IP local para acceso desde dispositivos móviles
  'https://beauty-salon-77.onrender.com'  // El frontend en producción
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
  credentials: true,
}));

// Conectar a MongoDB
mongoose.connect('mongodb+srv://martinenriquepe:bwbEoDbX7KW5WzW5@beauty-salon.mswkl.mongodb.net/?retryWrites=true&w=majority&appName=beauty-salon')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.log(err));

// Rutas de API
app.use('/api/clientes', require('./routes/cliente'));

// **Servir archivos estáticos del frontend desde la raíz del proyecto**
app.use(express.static(path.join(__dirname, '../build')));

// **Cualquier ruta no manejada por las APIs la redirigimos al frontend (index.html)**
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
