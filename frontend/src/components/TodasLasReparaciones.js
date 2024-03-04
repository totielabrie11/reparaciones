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
        <>
          {reparaciones.length > 0 ? (
<div className="lista-reparaciones">
{reparaciones.map((reparacion) => (
<div key={reparacion.id} className="card">
<p>Rep Nº: {reparacion.IDpalometa}</p>
<p>Nombre: {reparacion.nombre}</p>
<p>Estado: {reparacion.estado}</p>
<button onClick={() => verDetalle(reparacion)}>Ver detalle</button>
</div>
))}
</div>
) : (
<p>No hay reparaciones registradas.</p>
)}
<button onClick={volver} className="btn-volver">Volver a la vista principal</button>
</>
)}
</div>
);
}

export default TodasLasReparaciones;

