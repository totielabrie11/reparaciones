import React from 'react';

function VerDetalle({ reparacion, volver }) {
  return (
    <div>
      <h3>Viendo detalles de la reparación</h3>
      {/* Aquí mostrarás todos los detalles de la reparación */}
      <p>Nombre: {reparacion.nombre}</p>
      <p>Modelo de Bomba: {reparacion.modeloBomba}</p>
      <p>Estado: {reparacion.estado}</p>
      <p>Fecha Ingreso: {reparacion.fechaIngreso}</p>
      <p>Detalle del problema: {reparacion.causa}</p>
      <p>Mail: {reparacion.email}</p>
      <button onClick={volver}>Cerrar detalle</button>
    </div>
  );
}

export default VerDetalle;
