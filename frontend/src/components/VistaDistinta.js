import React from 'react';

function VistaDistinta({ usuario, cerrarSesion }) {
  // Asumiendo que el objeto usuario tiene una propiedad 'tipo' que indica si es administrador o operador
  return (
    <div>
      {usuario.tipo === 'administrador' && (
        <span>Bienvenido a la vista de administrador</span>
      )}
      {usuario.tipo === 'operador' && (
        <span>Bienvenido a la vista de operador</span>
      )}
      <br />
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}

export default VistaDistinta;
