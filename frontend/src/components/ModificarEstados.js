// ModificarEstados.js
import React, { useState, useEffect } from 'react';
import VerDetalle from './VerDetalle';

function ModificarEstados({ volver }) {
  const [reparaciones, setReparaciones] = useState([]);
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/reparaciones/ingresadas')
      .then(response => response.json())
      .then(data => {
        const reparacionesIngresadas = data.filter(rep => rep.estado === 'ingresada');
        setReparaciones(reparacionesIngresadas);
      });
  }, []);

  const pasarARevision = async (rep) => {
    // Realizar la solicitud al servidor para actualizar el estado de la reparación
    try {
      const response = await fetch(`http://localhost:3000/api/reparaciones/actualizarEstado/${rep.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevoEstado: 'en revisión' }),
      });
      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado de la reparación.');
      }
      // Actualizar el estado local de las reparaciones
      setReparaciones(reparaciones.map(r => r.id === rep.id ? { ...r, estado: 'en revisión' } : r));
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  if (reparacionSeleccionada) {
    return <VerDetalle reparacion={reparacionSeleccionada} volver={() => setReparacionSeleccionada(null)} />;
  }

  return (
    <div>
      <h2>Modificar Estados de Reparaciones</h2>
      <ul>
        {reparaciones.map((rep, index) => (
          <li key={index}>
            <span>{rep.nombre}</span> - <span>{rep.modeloBomba}</span> - <span>{rep.estado}</span>
            <button onClick={() => setReparacionSeleccionada(rep)}>Ver detalle</button>
            <button onClick={() => pasarARevision(rep)}>Pasar a revisión</button>
          </li>
        ))}
      </ul>
      <button onClick={volver}>Volver a la vista principal</button>
    </div>
  );
}

export default ModificarEstados;
