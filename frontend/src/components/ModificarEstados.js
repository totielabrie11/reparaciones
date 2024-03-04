import React, { useState } from 'react';
import PasarARevision from './PasarARevision';
import PasarPresupuesto from './PasarPresupuesto';
import PresupuestosAceptados from './PresupuestosAceptados';
import PresupuestosDeclinados from './PresupuestosDeclinados';
import '../styles/vistaAdministrador.css'; // Importar el archivo de estilos

function ModificarEstado({ volver }) {
  const [vistaActual, setVistaActual] = useState('');

    
    
  return (
    <div className="vista-administrador">
      {/* Manteniendo el h2 siempre visible fuera de cualquier condicional */}
  

      {vistaActual === '' && (
        <div className="menu-botones">
          <button onClick={() => setVistaActual('revision')} className="boton-azul">Pasar a Revisión</button>
          <button onClick={() => setVistaActual('presupuesto')} className="boton-azul">Pasar Presupuesto</button>
          <button onClick={() => setVistaActual('aceptados')} className="boton-azul">Presupuestos Aceptados</button>
          <button onClick={() => setVistaActual('declinados')} className="boton-azul">Presupuestos Declinados</button>
        </div>
      )}

      {/* Renderizando las diferentes vistas según el estado */}
      {vistaActual === 'revision' && <PasarARevision volver={() => setVistaActual('')} />}
      {vistaActual === 'presupuesto' && <PasarPresupuesto volver={() => setVistaActual('')} />}
      {vistaActual === 'aceptados' && <PresupuestosAceptados volver={() => setVistaActual('')} />}
      {vistaActual === 'declinados' && <PresupuestosDeclinados volver={() => setVistaActual('')} />}

      <button onClick={volver} className="btn-volver">Volver a la vista principal</button>
    </div>
  );
}

export default ModificarEstado;


