import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PresupuestosAceptados({ volver }) {
  const [reparacionesAprobadas, setReparacionesAprobadas] = useState([]);
  const [cargando, setCargando] = useState(false); // Estado para controlar la carga

  useEffect(() => {
    const fetchReparacionesAprobadas = async () => {
      setCargando(true); // Inicia la carga
      try {
        const response = await axios.get('http://localhost:3000/api/reparaciones/aprobadas');
        setReparacionesAprobadas(response.data);
      } catch (error) {
        console.error('Error al obtener las reparaciones aprobadas:', error);
        // Manejar el error adecuadamente
      } finally {
        setCargando(false); // Finaliza la carga
      }
    };

    fetchReparacionesAprobadas();
  }, []);

  return (
    <div>
      <h2>Lista de Presupuestos Aceptados</h2>
      {cargando ? (
        <p>Cargando reparaciones...</p> // Mostrar mensaje de carga o spinner
      ) : reparacionesAprobadas.length > 0 ? (
        <ul>
          {reparacionesAprobadas.map((reparacion, index) => (
            <li key={index}>
              <p>ID: {reparacion.id}</p>
              <p>Nombre: {reparacion.nombre}</p>
              <p>Modelo: {reparacion.modeloBomba}</p>
              <p>Estado: {reparacion.estado}</p>
              {/* Agrega aquí más detalles de la reparación si es necesario */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reparaciones aprobadas.</p>
      )}
      <button onClick={volver}>Volver a la vista principal</button>
    </div>
  );
}

export default PresupuestosAceptados;

