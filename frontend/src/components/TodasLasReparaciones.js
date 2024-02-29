import React, { useState, useEffect } from 'react';
import VerDetalle from './VerDetalle';
import '../styles/card.css';

// Suponiendo que tienes un componente VerDetalle para mostrar los detalles
// import VerDetalle from './VerDetalle';

function TodasLasReparaciones({ volver }) {
  const [reparaciones, setReparaciones] = useState([]);
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

  return (
    <div>
      <h2>Todas las Reparaciones</h2>
      {error && <p>Error: {error}</p>}
      {reparacionSeleccionada ? (
        <VerDetalle reparacion={reparacionSeleccionada} volver={() => setReparacionSeleccionada(null)} />
      ) : (
        <React.Fragment>
          {reparaciones.length > 0 ? (
            <ul style={{ padding: 0 }}> {/* Elimina el padding por defecto de la lista */}
              {reparaciones.map((reparacion) => (
                <li key={reparacion.id} className="card"> {/* Aplica la clase card */}
                  <p>Nombre: {reparacion.nombre}</p>
                  <p>Estado: {reparacion.estado}</p>
                  <button onClick={() => verDetalle(reparacion)}>Ver detalle</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay reparaciones registradas.</p>
          )}
          <button onClick={volver}>Volver a la vista principal</button>
        </React.Fragment>
      )}
    </div>
  );
}

export default TodasLasReparaciones;

