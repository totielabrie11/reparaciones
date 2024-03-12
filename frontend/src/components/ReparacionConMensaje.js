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

  const responderMensaje = async (idMensaje, respuesta) => {
    try {
      // Aquí realizarías la llamada a la API para enviar la respuesta
      const response = await fetch(`http://localhost:3000/api/mensajes/${idMensaje}/responder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ respuesta }),
      });
      if (!response.ok) {
        throw new Error('La respuesta no pudo ser enviada');
      }

      // Actualizar el estado local si es necesario, por ejemplo, para quitar el mensaje de la lista o actualizar el contador
      // Puedes optar por recargar la lista de reparaciones con mensajes para reflejar los cambios
      const data = await response.json();
      console.log('Respuesta enviada:', data);

      // Opcional: Cerrar el modal de mensaje activo
      setMensajeActivo(null);
    } catch (error) {
      console.error('Error al responder mensaje:', error);
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
  };


  const verMensaje = (reparacion) => {
    const mensajes = reparacion.mensajes || []; // Asegurarse de que siempre haya un array
    const mensajeConDetalle = {
      ...reparacion, // Usar la reparación completa podría ser más útil
      mensajes, // Ahora garantizas que mensajes es un array, incluso si está vacío
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
        onResponder={responderMensaje}
      />
    )}
      <button onClick={volver} className="btn-volver">Volver a la vista principal</button>
    </div>
  );
  
}

export default ListaReparacionesConMensajes;


