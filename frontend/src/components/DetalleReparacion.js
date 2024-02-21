import React from 'react';

function DetalleReparacion({ reparacion, cerrarDetalle }) { // Usando cerrarDetalle
  // Comprueba si 'movimientos' es un arreglo antes de intentar mapearlo.
  const movimientosValidos = Array.isArray(reparacion.movimientos) ? reparacion.movimientos : [];
  
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
              {/* Como 'mov' es una cadena, simplemente la mostramos directamente */}
              <p>{mov}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay movimientos registrados</p>
      )}
      <button onClick={cerrarDetalle}>Volver</button>
    </div>
  );
}

export default DetalleReparacion;

