import React, { useState } from 'react';
import datosReparaciones from '../data/reparacionesdb.json';

function ConsultaEstado({ setReparacionSeleccionada, volverAPrincipal }) {
  const [codigo, setCodigo] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const reparacionEncontrada = datosReparaciones.find(reparacion => reparacion.id === codigo);
    if (reparacionEncontrada) {
      setReparacionSeleccionada(reparacionEncontrada);
      // Aquí se asume que quieres cambiar la vista a DetalleReparacion
    } else {
      setMensajeError("La reparación no ha sido encontrada.");
    }
  };

  return (
    <div>
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
