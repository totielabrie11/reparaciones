// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, onAccept, onDecline }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Tomar Acción</h2>
        <button onClick={onAccept}>Aceptar</button>
        <button onClick={onDecline}>Declinar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default Modal;