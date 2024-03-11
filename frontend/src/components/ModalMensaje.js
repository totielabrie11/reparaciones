import React from 'react';
import '../styles/modalMensaje.css'; // Asegúrate de haber creado y ubicado correctamente este archivo CSS

const ModalMensaje = ({ mensaje, isOpen, onClose }) => {
  if (!isOpen || !mensaje) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2 className='colorNombre'>Mensaje: {mensaje.nombreReparacion}</h2>
        <div className="modal-body">
          <p><strong>Fecha:</strong> {new Date(mensaje.fecha).toLocaleString()}</p>
          <p><strong>Contenido:</strong> {mensaje.contenido}</p>
        </div>
      </div>
    </div>
  );
};

export default ModalMensaje;

