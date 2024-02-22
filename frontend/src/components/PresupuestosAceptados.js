// Ejemplo para PasarARevision.js
import React from 'react';

function PresupuestosAceptados({ volver }) {
  return (
    <div>
      <h2>Lista de presupuestos que se encuentran aceptados</h2>
      {/* Lógica y UI específica para pasar reparaciones a revisión */}
      <button onClick={volver}>Volver</button>
    </div>
  );
}

export default PresupuestosAceptados;
