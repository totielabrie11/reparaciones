// Ejemplo para PasarARevision.js
import React from 'react';

function PresupuestosDeclinados({ volver }) {
  return (
    <div>
      <h2>Lista de presupuestos que se encuentran declinados</h2>
      {/* Lógica y UI específica para pasar reparaciones a revisión */}
      <button onClick={volver}>Volver</button>
    </div>
  );
}

export default PresupuestosDeclinados;
