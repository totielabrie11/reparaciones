import React, { useState } from 'react';
import PasarARevision from './PasarARevision';
import PasarPresupuesto from './PasarPresupuesto';
import PresupuestosAceptados from './PresupuestosAceptados';
import PresupuestosDeclinados from './PresupuestosDeclinados';

function ModificarEstado({ volver }) {
  const [vistaActual, setVistaActual] = useState('');

  return (
    <div>
      {vistaActual === '' && (
        <>
          <button onClick={() => setVistaActual('revision')}>Pasar a Revisión</button>
          <button onClick={() => setVistaActual('presupuesto')}>Pasar Presupuesto</button>
          <button onClick={() => setVistaActual('aceptados')}>Presupuestos Aceptados</button>
          <button onClick={() => setVistaActual('declinados')}>Presupuestos Declinados</button>
        </>
      )}

      {vistaActual === 'revision' && <PasarARevision volver={() => setVistaActual('')} />}
      {vistaActual === 'presupuesto' && <PasarPresupuesto volver={() => setVistaActual('')} />}
      {vistaActual === 'aceptados' && <PresupuestosAceptados volver={() => setVistaActual('')} />}
      {vistaActual === 'declinados' && <PresupuestosDeclinados volver={() => setVistaActual('')} />}
      <br />
      <button onClick={volver}>Volver a la vista principal</button>
    </div>
  );
}

export default ModificarEstado;

