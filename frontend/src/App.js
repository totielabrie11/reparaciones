import React, { useState } from 'react';
import Login from './components/Login';
import ConsultaEstado from './components/ConsultaEstado';
import IngresoReparacion from './components/IngresoReparacion';
import DetalleReparacion from './components/DetalleReparacion';
import VistaDistinta from './components/VistaDistinta'; 
import './styles.css';

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [vistaActual, setVistaActual] = useState('principal');
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState(null);

  const handleLoginSuccess = (usuario) => {
    setUsuarioLogueado(usuario);
    // Aquí puedes definir si quieres cambiar a una vista específica según el tipo de usuario
    // Por ejemplo, si es un administrador, podrías querer llevarlo a una vista administrativa
    if (usuario.tipo === 'administrador') {
      setVistaActual('vistaDistinta');
    } else {
      setVistaActual('principal');
    }
  };

  const handleLogout = () => {
    setUsuarioLogueado(null);
    setVistaActual('principal');
    setReparacionSeleccionada(null);
  };

  const mostrarPrincipal = () => {
    setVistaActual('principal');
    setReparacionSeleccionada(null);
  };

  return (
    <div>
      <div>
        {vistaActual === 'principal' && (
          <>
            <button onClick={() => setVistaActual('ingresarReparacion')}>
              Ingresar una nueva reparación
            </button>
            <button onClick={() => setVistaActual('consultarEstado')}>
              Consultar estado de una reparación
            </button>
            {usuarioLogueado ? (
              <button onClick={handleLogout}>
                Cerrar sesión
              </button>
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )}
          </>
        )}

        {vistaActual === 'ingresarReparacion' && (
          <IngresoReparacion volverAPrincipal={mostrarPrincipal} />
        )}
        {vistaActual === 'consultarEstado' && (
          <ConsultaEstado setReparacionSeleccionada={setReparacionSeleccionada} volverAPrincipal={mostrarPrincipal} />
        )}
        {reparacionSeleccionada && (
          <DetalleReparacion reparacion={reparacionSeleccionada} cerrarDetalle={mostrarPrincipal} />
        )}
        {usuarioLogueado && vistaActual === 'vistaDistinta' && (
          <VistaDistinta usuario={usuarioLogueado} cerrarSesion={handleLogout}/>
        )}
      </div>

      {/* Muestra la información del usuario logueado si está presente */}
      {usuarioLogueado && (
        <div style={{ position: 'absolute', right: 0, top: 0, padding: '10px' }}>
          Us logueado exitosamente: {usuarioLogueado.nombreUs}
        </div>
      )}
    </div>
  );
}

export default App;

