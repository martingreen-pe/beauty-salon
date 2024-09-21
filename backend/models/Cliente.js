const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  fechaCita: {
    type: Date,
    required: true
  },
  servicios: {
    type: String,
    required: true
  },
  retoque: {
    type: Date,
    required: function() {
      return this.servicios === 'pestañas: extensiones';  // Solo requerido para 'pestañas: extensiones'
    }
  }
});

// Validaciones adicionales pueden ser agregadas si es necesario

module.exports = mongoose.model('Cliente', ClienteSchema);
