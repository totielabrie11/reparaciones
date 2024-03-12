import React from 'react';
import '../styles/modalMensaje.css'; // Asegúrate de que este archivo exista y esté bien referenciado

const ModalMensajeCliente = ({ mensajes, isOpen, onClose }) => {
  if (!isOpen || !mensajes) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2 className='colorNombre'>Conversación de la Reparación</h2>
        <div className="modal-body">
          {mensajes.map((msg, index) => (
            <div key={index} className={msg.respondido ? "mensaje mensaje-respuesta" : "mensaje"}>
              <p><strong>Fecha:</strong> {new Date(msg.fecha).toLocaleString()}</p>
              <p><strong>Contenido:</strong> {msg.contenido}</p>
              {msg.respondido && (
                <div className="mensaje-respuesta">
                  <p><strong>Respuesta:</strong> {msg.respuesta}</p>
                  <p><strong>Fecha Respuesta:</strong> {new Date(msg.fechaRespuesta).toLocaleString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalMensajeCliente;
