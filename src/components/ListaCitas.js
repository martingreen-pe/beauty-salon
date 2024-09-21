import React from 'react';
import './ListaCitas.css'; // Importar el archivo CSS
import axios from 'axios';

function ListaCitas({ citas, eliminarCita, editarCita }) {
  
  // Función para eliminar cita
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      try {
        await axios.delete(`https://beauty-salon-77.onrender.com/api/clientes/eliminar/${id}`);
        eliminarCita(id);
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
      }
    }
  };

  // Agrupar citas por fecha
  const citasAgrupadas = citas.reduce((acc, cita) => {
    const fecha = new Date(cita.fechaCita).toLocaleDateString();
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(cita);
    return acc;
  }, {});

  return (
    <div className="lista-citas-container">
      <h2 className="lista-citas-titulo">Lista de Citas</h2>
      {citas.length === 0 ? (
        <p className="lista-citas-vacio">No hay citas registradas.</p>
      ) : (
        <div>
          {Object.keys(citasAgrupadas).map((fecha) => (
            <div key={fecha} className="fecha-grupo">
              <h3 className="fecha-titulo">{fecha}</h3>
              <ul className="lista-citas">
                {citasAgrupadas[fecha].map((cita) => (
                  <li key={cita._id} className="lista-citas-item">
                    <div className="cita-info">
                      <span className="cita-nombre">{cita.nombre}</span>
                      <div className="cita-fecha-hora">
                        {new Date(cita.fechaCita).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <span className="cita-telefono">Teléfono: {cita.telefono}</span>
                      <div className="cita-servicio">Servicio: {cita.servicios}</div>
                    </div>
                    <div className="cita-acciones">
                      <button onClick={() => editarCita(cita)} className="cita-btn editar-btn">Editar</button>
                      <button onClick={() => handleEliminar(cita._id)} className="cita-btn eliminar-btn">Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaCitas;
