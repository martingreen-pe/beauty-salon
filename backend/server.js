const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


// Middleware para leer JSON
app.use(express.json());

// Habilitar CORS
const allowedOrigins = ['http://localhost:3000', 'https://beauty-salon-citas.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
}));

// Conectar a MongoDB (reemplaza <TU_URI_DE_MONGODB> con tu URI de MongoDB)
mongoose.connect('mongodb+srv://martinenriquepe:bwbEoDbX7KW5WzW5@beauty-salon.mswkl.mongodb.net/?retryWrites=true&w=majority&appName=beauty-salon')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.log(err));

// Usar rutas
app.use('/api/clientes', require('./routes/cliente'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
