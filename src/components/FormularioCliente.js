import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormularioCliente.css';  // Enlace al archivo CSS

function FormularioCliente() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaCita, setFechaCita] = useState('');
  const [horaCita, setHoraCita] = useState('');
  const [retoque, setRetoque] = useState('');
  const [servicios, setServicios] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (servicios === 'pestañas: extensiones' && fechaCita) {
      const fechaRetoque = new Date(`${fechaCita}T${horaCita}`);
      fechaRetoque.setDate(fechaRetoque.getDate() + 15); // Agregar 15 días
      setRetoque(fechaRetoque.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    }
  }, [fechaCita, horaCita, servicios]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !telefono || !fechaCita || !horaCita || !servicios) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/clientes/crear', {
        nombre,
        telefono,
        fechaCita,
        horaCita,
        retoque,
        servicios
      });
      console.log(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al registrar la cita');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Registrar Cita</h2>

      <label htmlFor="nombre" className="form-label">Nombre</label>
      <input
        type="text"
        id="nombre"
        className="form-input"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <label htmlFor="telefono" className="form-label">Teléfono</label>
      <input
        type="text"
        id="telefono"
        className="form-input"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <label htmlFor="fechaCita" className="form-label">Fecha de la Cita</label>
      <input
        type="date"
        id="fechaCita"
        className="form-input"
        value={fechaCita}
        onChange={(e) => setFechaCita(e.target.value)}
      />

      <label htmlFor="horaCita" className="form-label">Hora de la Cita</label>
      <input
        type="time"
        id="horaCita"
        className="form-input"
        value={horaCita}
        onChange={(e) => setHoraCita(e.target.value)}
      />

      <label htmlFor="servicios" className="form-label">Servicios</label>
      <select
        id="servicios"
        className="form-select"
        value={servicios}
        onChange={(e) => setServicios(e.target.value)}
      >
        <option value="">Seleccione un servicio</option>
        <option value="cejas: pigmetacion">Cejas: Pigmentación</option>
        <option value="cejas: depilacion">Cejas: Depilación</option>
        <option value="cejas: planchado">Cejas: Planchado</option>
        <option value="cejas: laminado">Cejas: Laminado</option>
        <option value="pedicura">Pedicura</option>
        <option value="manos: acrilicas">Manos: Acrílicas</option>
        <option value="manos: rubber">Manos: Rubber</option>
        <option value="manos: polygel">Manos: Polygel</option>
        <option value="manos: manicura rusa">Manos: Manicura Rusa</option>
        <option value="manos: softgel">Manos: Softgel</option>
        <option value="manos: manicura">Manos: Manicura</option>
        <option value="pestañas: extensiones">Pestañas: Extensiones</option>
        <option value="pestañas: lifting">Pestañas: Lifting</option>
      </select>

      {servicios === 'pestañas: extensiones' && (
        <div>
          <label htmlFor="retoque" className="form-label">Fecha de Retoque (automática)</label>
          <input
            type="date"
            id="retoque"
            className="form-input"
            value={retoque}
            readOnly
          />
        </div>
      )}

      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="form-button">Registrar Cita</button>
    </form>
  );
}

export default FormularioCliente;

