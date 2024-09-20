import React, { useState, useEffect } from 'react';
import FormularioCliente from './components/FormularioCliente';
import ListaCitas from './components/ListaCitas';
import Paginacion from './components/Paginacion';
import axios from 'axios';
import './App.css';  // Importar el archivo CSS

function App() {
  const [citas, setCitas] = useState([]);
  const [citaEditada, setCitaEditada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [citasPorPagina] = useState(5);
  const [mostrarBuscador, setMostrarBuscador] = useState(false); // Controlar la visibilidad

  const obtenerCitas = async () => {
    try {
      const response = await axios.get('http://192.168.0.104:5000/api/clientes/citas');
      setCitas(response.data);
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    }
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  const agregarCita = (nuevaCita) => {
    setCitas((prevCitas) => [...prevCitas, nuevaCita]);
  };

  const eliminarCita = (id) => {
    setCitas((prevCitas) => prevCitas.filter((cita) => cita._id !== id));
  };

  const actualizarCita = (citaEditada) => {
    setCitas((prevCitas) =>
      prevCitas.map((cita) => (cita._id === citaEditada._id ? citaEditada : cita))
    );
  };

  const citasFiltradas = citas.filter((cita) => {
    const citaFecha = new Date(cita.fechaCita);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    return (
      cita.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (!inicio || citaFecha >= inicio) &&
      (!fin || citaFecha <= fin)
    );
  });

  const indexUltimaCita = paginaActual * citasPorPagina;
  const indexPrimeraCita = indexUltimaCita - citasPorPagina;
  const citasActuales = citasFiltradas.slice(indexPrimeraCita, indexUltimaCita);

  const paginar = (numeroPagina) => setPaginaActual(numeroPagina);

  return (
    <div className="app-container">
      <h1 className="app-title">Gestión de Citas - Salón de Belleza</h1>

      {/* Botón para mostrar u ocultar el buscador */}
      <button 
        onClick={() => setMostrarBuscador(!mostrarBuscador)} 
        className="toggle-search-btn"
      >
        {mostrarBuscador ? 'Ocultar Buscador' : 'Mostrar Buscador'}
      </button>

      {/* Buscador desplegable */}
      {mostrarBuscador && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />

          <div className="date-filters">
            <input
              type="date"
              className="date-input"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <input
              type="date"
              className="date-input"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
        </div>
      )}

      <FormularioCliente
        agregarCita={agregarCita}
        actualizarCita={actualizarCita}
        citaEditada={citaEditada}
        setCitaEditada={setCitaEditada}
      />

      <ListaCitas citas={citasActuales} eliminarCita={eliminarCita} editarCita={setCitaEditada} />

      <Paginacion
        citasPorPagina={citasPorPagina}
        totalCitas={citasFiltradas.length}
        paginar={paginar}
      />
    </div>
  );
}

export default App;
