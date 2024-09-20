import React from 'react';
import './ListaCitas.css'; // Importar el archivo CSS
import axios from 'axios';

function ListaCitas({ citas, eliminarCita, editarCita }) {

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

  return (
    <div className="lista-citas-container">
      <h2 className="lista-citas-titulo">Lista de Citas</h2>
      {citas.length === 0 ? (
        <p className="lista-citas-vacio">No hay citas registradas.</p>
      ) : (
        <ul className="lista-citas">
          {citas.map((cita) => (
            <li key={cita._id} className="lista-citas-item">
              <div className="cita-info">
                <span className="cita-nombre">{cita.nombre}</span> -{' '}
                {new Date(cita.fechaCita).toLocaleDateString()} -{' '}
                <span className="cita-telefono">Teléfono: {cita.telefono}</span>
              </div>
              <div className="cita-acciones">
                <button
                  onClick={() => editarCita(cita)}
                  className="cita-btn editar-btn"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(cita._id)}
                  className="cita-btn eliminar-btn"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListaCitas;
