import React, { useState, useEffect } from 'react';
import VerDetalle from './VerDetalle';
import '../styles/card.css';

// Suponiendo que tienes un componente VerDetalle para mostrar los detalles
// import VerDetalle from './VerDetalle';

function TodasLasReparaciones({ volver }) {
  const [reparaciones, setReparaciones] = useState([]);
  const [filtro, setFiltro] = useState(''); // Estado para gestionar la cadena de búsqueda
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReparaciones = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reparaciones/todas');
        if (!response.ok) {
          throw new Error('No se pudieron obtener las reparaciones');
        }
        const data = await response.json();
        setReparaciones(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchReparaciones();
  }, []);

  const verDetalle = (reparacion) => {
    setReparacionSeleccionada(reparacion);
  };

  const handleSearchChange = (event) => {
    setFiltro(event.target.value.toLowerCase());
  };

  // Filtrar las reparaciones basándose en la búsqueda
  const reparacionesFiltradas = reparaciones.filter((reparacion) =>
    reparacion.nombre.toLowerCase().includes(filtro)
  );



  return (
    <div>
      <h2>Todas las Reparaciones</h2>
      {error && <p>Error: {error}</p>}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        onChange={handleSearchChange}
        className="search-input"
      />
      {reparacionSeleccionada ? (
        <VerDetalle reparacion={reparacionSeleccionada} volver={() => setReparacionSeleccionada(null)} />
      ) : (
        <>
          {reparacionesFiltradas.length > 0 ? (
            <div className="lista-reparaciones">
              {reparacionesFiltradas.map((reparacion) => (
                <div key={reparacion.id} className="card">
                  <p>Rep Nº: {reparacion.IDpalometa}</p>
                  <p>Nombre: {reparacion.nombre}</p>
                  <p>Estado: {reparacion.estado}</p>
                  <button onClick={() => verDetalle(reparacion)}>Ver detalle</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay reparaciones que coincidan con la búsqueda.</p>
          )}
          <button onClick={volver} className="btn-volver">Volver a la vista principal</button>
        </>
      )}
    </div>
  );
  
}

export default TodasLasReparaciones;

