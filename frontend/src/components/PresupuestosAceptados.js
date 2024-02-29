import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PresupuestosAceptados({ volver }) {
  const [reparacionesAprobadas, setReparacionesAprobadas] = useState([]);
  const [cargando, setCargando] = useState(false); // Estado para controlar la carga

  // Mover la definición de fetchReparacionesAprobadas fuera del useEffect para que sea accesible globalmente en el componente
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

  useEffect(() => {
    fetchReparacionesAprobadas(); // Llama a la función dentro de useEffect
  }, []);

  const handleFinalizar = async (id) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/reparaciones/actualizarEstado/${id}`, {
        nuevoEstado: 'finalizada',
        nuevoMovimiento: 'Reparación finalizada',
      });

      if (response.status === 200) {
        alert('La reparación ha sido marcada como finalizada con éxito.');
        fetchReparacionesAprobadas(); // Ahora esta llamada es válida porque la función está definida en el ámbito correcto
      } else {
        alert('Hubo un problema al intentar finalizar la reparación.');
      }
    } catch (error) {
      console.error('Error al finalizar la reparación:', error);
      alert('Hubo un problema al intentar finalizar la reparación.');
    }
  };

  return (
    <div>
      <h2>Lista de Presupuestos Aceptados</h2>
      {cargando ? (
        <p>Cargando reparaciones...</p>
      ) : reparacionesAprobadas.length > 0 ? (
        <ul>
          {reparacionesAprobadas.map((reparacion) => (
            <li key={reparacion.id}>
              <p>ID: {reparacion.id}</p>
              <p>Nombre: {reparacion.nombre}</p>
              <p>Modelo: {reparacion.modeloBomba}</p>
              <p>Estado: {reparacion.estado}</p>
              <button onClick={() => handleFinalizar(reparacion.id)}>Finalizada</button>
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



