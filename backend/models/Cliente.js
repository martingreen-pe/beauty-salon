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
    type: Date,  // Asegúrate de que este campo no sea requerido si no siempre lo necesitas
    required: function() {
      return this.servicios === 'pestañas: extensiones';  // Solo es requerido para 'pestañas: extensiones'
    }
  }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
