import React from 'react';
import './Paginacion.css'; // Importar el archivo CSS

function Paginacion({ citasPorPagina, totalCitas, paginar }) {
  const numeroPaginas = [];

  for (let i = 1; i <= Math.ceil(totalCitas / citasPorPagina); i++) {
    numeroPaginas.push(i);
  }

  return (
    <nav className="pagination-container">
      <ul className="pagination-list">
        {numeroPaginas.map((numero) => (
          <li key={numero} className="pagination-item">
            <button
              onClick={() => paginar(numero)}
              className="pagination-link"
            >
              {numero}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Paginacion;
