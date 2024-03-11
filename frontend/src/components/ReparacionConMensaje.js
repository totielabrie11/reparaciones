import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Asegúrate de que tienes un componente Modal

function ListaReparacionesConMensajes() {
  const [reparaciones, setReparaciones] = useState([]);
  const [mensajeActivo, setMensajeActivo] = useState(null);

  useEffect(() => {
    const fetchReparacionesConMensajes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reparaciones/mensajes');
        if (!response.ok) {
          throw new Error('Error al obtener las reparaciones con mensajes');
        }
        const data = await response.json();
        setReparaciones(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchReparacionesConMensajes();
  }, []);

  const verMensaje = (mensajes) => {
    // Asumiendo que quieres ver el último mensaje de la lista
    setMensajeActivo(mensajes[mensajes.length - 1]);
  };

  return (
    <div>
      <h2>Reparaciones con Mensajes</h2>
      {reparaciones.length > 0 ? (
        <ul>
          {reparaciones.map((reparacion) => (
            <li key={reparacion.id}>
              <p><strong>ID Reparación:</strong> {reparacion.id}</p>
              <button onClick={() => verMensaje(reparacion.mensajes)}>Ver Mensaje</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reparaciones con mensajes.</p>
      )}

      {mensajeActivo && (
        <Modal isOpen={Boolean(mensajeActivo)} onClose={() => setMensajeActivo(null)}>
          <p><strong>Mensaje:</strong> {mensajeActivo.contenido}</p>
          <p><strong>Fecha:</strong> {new Date(mensajeActivo.fecha).toLocaleString()}</p>
        </Modal>
      )}
    </div>
  );
}

export default ListaReparacionesConMensajes;

