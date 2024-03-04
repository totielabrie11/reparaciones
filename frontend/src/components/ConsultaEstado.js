import React, { useState } from 'react';
import '../styles/consultaReparacion.css';

function ConsultaEstado({ setReparacionSeleccionada, volverAPrincipal }) {
  const [codigo, setCodigo] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError(''); // Limpia mensajes de error previos

    // Usar un patrón regex para verificar si el código comienza con los prefijos de IDpalometa
    const regexIdPalometa = /^(023|024|025|026)/;
    const esIdPalometa = regexIdPalometa.test(codigo);
    let param;

    if (esIdPalometa) {
      param = `idPalometa=${codigo}`;
    } else {
      param = `id=${codigo}`;
    }

    const url = `http://localhost:3000/api/reparaciones/consultarBuscar?${param}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('La reparación no ha sido encontrada.'); // Esto se mostrará si el código no existe
      }
      const reparacionEncontrada = await response.json();
      setReparacionSeleccionada(reparacionEncontrada);
    } catch (error) {
      setMensajeError(error.message); // Establece el mensaje de error para mostrarlo en la UI
      setReparacionSeleccionada(null); // Esto asegura que no se muestre información de una reparación si el fetch falla
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
          placeholder="Ingrese el ID o número de IDpalometa"
          maxLength="6"
        />
        <button type="submit">Consultar</button>
      </form>
      {mensajeError && <p className="mensaje-error">{mensajeError}</p>}
      <button onClick={volverAPrincipal}>Volver a la vista principal</button>
    </div>
  );
}

export default ConsultaEstado;
