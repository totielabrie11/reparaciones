import React, { useState } from 'react';
import AceptarReparacion from './AceptarReparacion';
import ModificarEstados from './ModificarEstados';

function VistaDistinta({ usuario, cerrarSesion }) {
  const [vistaActual, setVistaActual] = useState('inicio'); // Controla qué componente se muestra

  // Renderiza los botones basado en el tipo de usuario y la vista actual
  const renderizarBotones = () => {
    if (vistaActual === 'inicio') {
      return (
        <>
          <button onClick={() => setVistaActual('aceptar')}>Aceptar Reparaciones</button>
          <button onClick={() => setVistaActual('modificar')}>Modificar Estados</button>
        </>
      );
    }
  };

  return (
    <div>
      <h2>{usuario.tipo === 'administrador' ? 'Vista de Administrador' : 'Vista de Operador'}</h2>
      {usuario.tipo === 'administrador' && renderizarBotones()}
      {usuario.tipo === 'operador' && renderizarBotones()}

      {vistaActual === 'aceptar' && <AceptarReparacion volver={() => setVistaActual('inicio')} />}
      {vistaActual === 'modificar' && <ModificarEstados volver={() => setVistaActual('inicio')} />}

      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}

export default VistaDistinta;

