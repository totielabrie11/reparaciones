import React, { useState } from 'react';
import '../styles/consultaReparacion.css';

function ConsultaEstado({ setReparacionSeleccionada, volverAPrincipal }) {
  const [codigo, setCodigo] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Asegúrate de que el endpoint y el puerto sean correctos
    const url = `http://localhost:3000/api/reparaciones/${codigo}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('La reparación no ha sido encontrada.');
      }
      const reparacionEncontrada = await response.json();
      setReparacionSeleccionada(reparacionEncontrada);
      setMensajeError('');
    } catch (error) {
      setMensajeError(error.message);
    }
  };

  return (
    <div className="consulta-reparacion">
      <h2>Consultar estado de reparación</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ingrese el ID de la reparación"
          maxLength="6"
        />
        <button type="submit">Consultar</button>
        {mensajeError && <p>{mensajeError}</p>}
        <button onClick={volverAPrincipal}>Volver a la vista principal</button>
      </form>
    </div>
  );
}

export default ConsultaEstado;

