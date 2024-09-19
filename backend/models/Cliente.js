const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  fechaCita: {
    type: Date,
    required: true
  },
  retoque: {
    type: Date,
    required: true
  },
  telefono: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
