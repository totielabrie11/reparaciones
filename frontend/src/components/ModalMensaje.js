import React, { useState } from 'react';
import '../styles/modalMensaje.css'; // Asegúrate de que este archivo exista y esté bien referenciado

const ModalMensaje = ({ mensaje, isOpen, onClose, onResponder }) => {
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [respuesta, setRespuesta] = useState('');
  const [idMensajeAResponder, setIdMensajeAResponder] = useState(null);

  if (!isOpen || !mensaje) return null;

  const responderMensaje = () => {
    if (respuesta.trim() && idMensajeAResponder) {
      onResponder(idMensajeAResponder, respuesta);
      setMostrarRespuesta(false); // Ocultar el campo de respuesta después de enviar.
      setRespuesta(''); // Limpiar el campo de texto.
      setIdMensajeAResponder(null); // Limpiar el id del mensaje a responder
    }
  };

  // Asegúrate de que mensaje.mensajes está definido antes de intentar renderizarlo.
  const mensajes = mensaje.mensajes || [];

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2 className='colorNombre'>Conversación: {mensaje.nombreReparacion}</h2>
        <div className="modal-body">
          {mensajes.map((msg, index) => (
            <div key={index} className={msg.respondido ? "mensaje mensaje-respuesta" : "mensaje"}>
              <p><strong>Fecha:</strong> {new Date(msg.fecha).toLocaleString()}</p>
              <p><strong>Contenido:</strong> {msg.contenido}</p>
              {msg.respondido && (
                <>
                  <p><strong>Respuesta:</strong> {msg.respuesta}</p>
                  <p><strong>Fecha Respuesta:</strong> {new Date(msg.fechaRespuesta).toLocaleString()}</p>
                </>
              )}
              {!msg.respondido && (
                <button onClick={() => { setMostrarRespuesta(true); setIdMensajeAResponder(msg.id); }} className="btn-responder">Responder</button>
              )}
            </div>
          ))}
          {mostrarRespuesta && (
            <div className="respuesta">
              <textarea
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                className="textarea-respuesta"
              />
              <button onClick={responderMensaje} className="btn-enviar-respuesta">Enviar Respuesta</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default ModalMensaje;


