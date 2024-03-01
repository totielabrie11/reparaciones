import React, { useState, useEffect } from 'react';

function ModificarEstados({ volver }) {
  const [reparaciones, setReparaciones] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/reparaciones/ingresadas')
      .then(response => response.json())
      .then(data => {
        const reparacionesIngresadas = data.filter(rep => rep.estado === 'ingresada');
        setReparaciones(reparacionesIngresadas);
      });
  }, []);

  const pasarARevision = async (rep) => {
    if (rep.opcionNumeroSerie === "noTiene") {
      ingresarNumeroSerieManualmente(rep.id);
    } else {
      // Realizar la solicitud al servidor para actualizar el estado de la reparación
      const nuevoMovimiento = `La reparación ${rep.nombre} ha pasado a revisión.`;
      try {
        const response = await fetch(`http://localhost:3000/api/reparaciones/actualizarEstado/${rep.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nuevoEstado: 'en revisión', nuevoMovimiento }),
        });
        if (!response.ok) {
          throw new Error('No se pudo actualizar el estado de la reparación.');
        }
        // Actualizar el estado local de las reparaciones
        setReparaciones(reparaciones.map(r => r.id === rep.id ? { ...r, estado: 'en revisión' } : r));
      } catch (error) {
        console.error('Error al actualizar el estado:', error);
      }
    }
  };

  const ingresarNumeroSerieManualmente = async (id) => {
    const numeroSerie = prompt("Por favor, ingrese el número de serie:");
    if (numeroSerie) {
      try {
        // Aquí agregas la lógica para enviar el número de serie al servidor
        console.log(`Número de serie ${numeroSerie} ingresado para la reparación con ID: ${id}`);
      } catch (error) {
        console.error('Error al ingresar el número de serie:', error);
      }
    }
  };

  return (
    <div>
      <h2>Modificar Estados de Reparaciones</h2>
      <ul>
        {reparaciones.map((rep, index) => (
          <li key={index}>
            <span>{rep.nombre}</span> - <span>{rep.modeloBomba}</span> - <span>{rep.estado}</span>
            {/* Render "Pasar a revisión" button */}
            <button onClick={() => pasarARevision(rep)}>Pasar a revisión</button>
            {/* Conditionally render "Ingresar número de serie manualmente" button */}
            {rep.opcionNumeroSerie === "noTiene" && (
              <button onClick={() => ingresarNumeroSerieManualmente(rep.id)}>Ingresar número de serie manualmente</button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={volver}>Volver a la vista principal</button>
    </div>
  );
}

export default ModificarEstados;