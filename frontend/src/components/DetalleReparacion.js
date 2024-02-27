import React from 'react';

function DetalleReparacion({ reparacion, cerrarDetalle }) {
  // Assuming reparacion.movimientos is an array
  const movimientosValidos = reparacion.movimientos || [];

  // URL for downloading the presupuesto
  const downloadUrl = reparacion.archivoPresupuesto ? `http://localhost:3000/descargar/${encodeURIComponent(reparacion.archivoPresupuesto)}` : '#';

  // Función para abrir un reclamo
  const abrirReclamo = async (id) => {
    const reclamo = prompt("Por favor, ingrese el motivo de su reclamo:");
    if (reclamo) {
      try {
        // Asegúrate de que la ruta coincida con la definida en el servidor
        const response = await fetch(`http://localhost:3000/api/reclamos/crear`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reparacionId: id,
            motivo: reclamo,
          }),
        });
        if (response.ok) {
          alert("Reclamo abierto con éxito.");
          // Aquí podrías actualizar el estado de la aplicación para reflejar el nuevo reclamo
        } else {
          alert("Hubo un error al abrir el reclamo.");
        }
      } catch (error) {
        console.error("Error al abrir el reclamo:", error);
      }
    }
  };

  const enviarMensajeAdmin = (id) => {
    alert(`Enviar mensaje al administrador para la reparación ID: ${id}`);
    // Implementación futura: abrir un modal o cambiar estado para mostrar un campo de texto
  };

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
        <>
          <p>{reparacion.accionesPendientes}</p>
          {reparacion.accionesPendientes === "Se debe enviar la reparación a Dosivac junto con el ticket de pre-carga a la siguiente dirección " && (
            <a href="https://maps.app.goo.gl/9JGU3ARiCa76yAwG9" target="_blank" rel="noopener noreferrer">
              Ver en Google Maps
            </a>
          )}
          
          {/* Mostrar el botón "Abrir reclamo" solo si el estado no es "sin ingresar" */}
          {reparacion.estado.toLowerCase().trim() !== "sin ingresar" && reparacion.estado.toLowerCase().trim() !== "declinada" && (
          <button onClick={() => abrirReclamo(reparacion.id)}>Abrir Reclamo</button>
          )}

          <button onClick={() => enviarMensajeAdmin(reparacion.id)}>Enviar Mensaje al Administrador</button>
        </>
      ) : (
        <p>No hay acciones pendientes.</p>
      )}

      <h3>Movimientos:</h3>
      {movimientosValidos.length > 0 ? (
        <ul>
          {movimientosValidos.map((mov, index) => (
            <li key={index}>
              <p>{mov}</p>
              {mov.includes('Presupuesto adjuntado') && <a href={downloadUrl} download>Descargar Presupuesto</a>}
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


