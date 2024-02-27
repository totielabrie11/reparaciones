import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PresupuestosDeclinados({ volver }) {
  const [reparacionesDeclinadas, setReparacionesDeclinadas] = useState([]);
  const [cargando, setCargando] = useState(false); // Estado para controlar la carga

  useEffect(() => {
    const fetchReparacionesDeclinadas = async () => {
      setCargando(true); // Inicia la carga
      try {
        const response = await axios.get('http://localhost:3000/api/reparaciones/declinadas');
        setReparacionesDeclinadas(response.data);
      } catch (error) {
        console.error('Error al obtener las reparaciones declinadas:', error);
        // Manejar el error adecuadamente
      } finally {
        setCargando(false); // Finaliza la carga
      }
    };

    fetchReparacionesDeclinadas();
  }, []);

  return (
    <div>
      <h2>Lista de Presupuestos Declinados</h2>
      {cargando ? (
        <p>Cargando reparaciones...</p> // Mostrar mensaje de carga o spinner
      ) : reparacionesDeclinadas.length > 0 ? (
        <ul>
          {reparacionesDeclinadas.map((reparacion, index) => (
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
        <p>No hay reparaciones declinadas.</p>
      )}
      <button onClick={volver}>Volver a la vista principal</button>
    </div>
  );
}

export default PresupuestosDeclinados;

