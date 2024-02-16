import React, { useState } from 'react';
import ConsultaEstado from './components/ConsultaEstado';
import IngresoReparacion from './components/IngresoReparacion';
import DetalleReparacion from './components/DetalleReparacion'; // Si estás usando este componente

function App() {
  const [vistaActual, setVistaActual] = useState('principal');
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState(null);

  const mostrarPrincipal = () => {
    setVistaActual('principal');
    setReparacionSeleccionada(null); // Asegúrate de resetear esto también
  };

  return (
    <div>
      {vistaActual === 'principal' && (
        <>
          <button onClick={() => setVistaActual('ingresarReparacion')}>
            Ingresar una nueva reparación
          </button>
          <button onClick={() => setVistaActual('consultarEstado')}>
            Consultar estado de una reparación
          </button>
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
    </div>
  );
}

export default App;

