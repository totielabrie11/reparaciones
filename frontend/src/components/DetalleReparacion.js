import React from 'react';

function DetalleReparacion({ reparacion, cerrarDetalle }) { // Usando cerrarDetalle
  // Comprueba si 'movimientos' es un arreglo antes de intentar mapearlo.
  const esMovimientosArray = Array.isArray(reparacion.movimientos);
  return (
    <div>
      <h2>Detalle de la Reparación</h2>
      <p>ID: {reparacion.id}</p>
      <p>Estado: {reparacion.estado}</p>
      <p>Fecha de Ingreso: {reparacion.fechaIngreso}</p>
      <p>Fecha Estimada de Finalización: {reparacion.fechaEstimadaFin}</p>
      <h3>Movimientos:</h3>
      {esMovimientosArray ? (
        <ul>
          {reparacion.movimientos.map((mov, index) => (
            <li key={index}>
              <p>Fecha: {mov.fecha}</p>
              <p>Descripción: {mov.descripcion}</p>
              <p>Tipo: {mov.tipo}</p>
            </li>
          ))}
      </ul>
      ) : ( 
      <p>No hay movimientos registrados</p>
      )}
      <button onClick={cerrarDetalle}>Volver</button> {/* Usando cerrarDetalle aquí */}
    </div>
  );
}

export default DetalleReparacion;

