import React from 'react';

function DetalleReparacion({ reparacion, cerrarDetalle }) {
  const movimientosValidos = Array.isArray(reparacion.movimientos) ? reparacion.movimientos : [];
  
  // URL for downloading the presupuesto
  const downloadUrl = reparacion.archivoPresupuesto ? `http://localhost:3000/descargar/${encodeURIComponent(reparacion.archivoPresupuesto)}` : '#';

  return (
    <div>
      <h2>Detalle de la Reparación</h2>
      <p>ID: {reparacion.id}</p>
      <p>Nombre: {reparacion.nombre}</p>
      <p>Modelo: {reparacion.modeloBomba}</p>
      <p>Estado: {reparacion.estado}</p>
      <p>Fecha Estimada de Finalización: {reparacion.fechaEstimadaFin}</p>
     
      <h3>Movimientos:</h3>
      <p>Fecha de Ingreso: {reparacion.fechaIngreso}</p>
      {movimientosValidos.length > 0 ? (
        <ul>
          {movimientosValidos.map((mov, index) => (
            <li key={index}>
              <p>{mov}</p>
              {/* If the movement includes the presupuesto, provide a download link */}
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


