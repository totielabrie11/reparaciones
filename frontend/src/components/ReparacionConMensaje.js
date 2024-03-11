import React, { useState, useEffect } from 'react';
import ModalMensaje from './ModalMensaje.js'; 
import '../styles/card.css';

function ListaReparacionesConMensajes( {volver} ) {
  const [reparaciones, setReparaciones] = useState([]);
  const [mensajeActivo, setMensajeActivo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReparacionesConMensajes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reparaciones/mensajes');
        if (!response.ok) {
          throw new Error('No se pudieron cargar las reparaciones con mensajes');
        }
        const data = await response.json();
        setReparaciones(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.toString());
      }
    };

    fetchReparacionesConMensajes();
  }, []);

  const verMensaje = (reparacion) => {
    // Suponiendo que 'reparacion.mensajes' es un array de mensajes
    const mensajeConDetalle = {
      ...reparacion.mensajes[reparacion.mensajes.length - 1], // Obtener el último mensaje
      nombreReparacion: reparacion.nombre // Incluir el nombre de la reparación
    };
    setMensajeActivo(mensajeConDetalle);
  };

  return (
    <div className="lista-reparaciones">
      <h2>Reparaciones con Mensajes</h2>
      {error && <p className="error-message">Error: {error}</p>}
      {reparaciones.length > 0 ? (
        <ul>
          {reparaciones.map((reparacion) => (
            <li key={reparacion.id}>
              <p><strong>ID Reparación:</strong> {reparacion.id}</p>
              <p>Nombre: {reparacion.nombre}</p>
              <p>Rep Nº: {reparacion.IDpalometa}</p>
              <p>Estado: {reparacion.estado}</p>
              {reparacion.mensajes && reparacion.mensajes.length > 0 && (
                <button onClick={() => verMensaje(reparacion)}>Ver Mensaje</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No hay reparaciones con mensajes.</p>
      )}
  
      {mensajeActivo && (
        <ModalMensaje
          mensaje={mensajeActivo}
          isOpen={Boolean(mensajeActivo)}
          onClose={() => setMensajeActivo(null)}
        />
      )}
      <button onClick={volver} className="btn-volver">Volver a la vista principal</button>
    </div>
  );
  
}

export default ListaReparacionesConMensajes;


