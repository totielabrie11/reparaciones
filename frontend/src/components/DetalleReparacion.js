import React from 'react';

function DetalleReparacion({ reparacion, cerrarDetalle }) {
  // Assuming reparacion.movimientos is an array
  const movimientosValidos = reparacion.movimientos || [];

  // URL for downloading the presupuesto
  const downloadUrl = reparacion.archivoPresupuesto ? `http://localhost:3000/descargar/${encodeURIComponent(reparacion.archivoPresupuesto)}` : '#';

  return (
    <div>
      <h2>Detalle de la Reparación</h2>
      <p>ID: {reparacion.id}</p>
      <p>Nombre: {reparacion.nombre}</p>
      <p>Modelo: {reparacion.modeloBomba}</p>
      <p>Estado: {reparacion.estado}</p>
      {reparacion.fechaEstimadaFin && <p>Fecha Estimada de Finalización: {reparacion.fechaEstimadaFin}</p>}
      {reparacion.fechaIngreso && <p>Fecha de Ingreso: {reparacion.fechaIngreso}</p>}

      <h3>Acciones Pendientes:</h3>
      {reparacion.accionesPendientes ? (
        <p>
          {reparacion.accionesPendientes}
          {reparacion.accionesPendientes === "Se debe enviar la reparación a Dosivac junto con el ticket de pre-carga a la siguiente dirección " && (
            <>
              {' '}
              <a 
                href="https://maps.app.goo.gl/9JGU3ARiCa76yAwG9" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Ver en Google Maps
              </a>
            </>
          )}
        </p>
      ) : (
        <p>No hay acciones pendientes.</p>
      )}

      <h3>Movimientos:</h3>
      {movimientosValidos.length > 0 ? (
        <ul>
          {movimientosValidos.map((mov, index) => (
            <li key={index}>
              <p>{mov}</p>
              {mov.includes('Presupuesto adjuntado') && (
                <a href={downloadUrl} download>Descargar Presupuesto</a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay movimientos registrados.</p>
      )}
      <button onClick={cerrarDetalle}>Volver</button>
    </div>
  );
}

export default DetalleReparacion;


