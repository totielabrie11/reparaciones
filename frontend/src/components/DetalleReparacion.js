import React, { useState } from 'react';
import Modal from './Modal'; // Asegura que este componente está implementado correctamente

function DetalleReparacion({ reparacion, cerrarDetalle }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const movimientosValidos = reparacion.movimientos || [];
  const downloadUrl = reparacion.archivoPresupuesto ? `http://localhost:3000/descargar/${encodeURIComponent(reparacion.archivoPresupuesto)}` : '#';

  const accionesATomar = reparacion.accionesPendientes || [];


  const mostrarBotonAcciones = accionesATomar.includes("Presupuesto adjuntado y pendiente de aprobación");

  

  const abrirReclamo = async (id) => {
    const reclamo = prompt("Por favor, ingrese el motivo de su reclamo:");
    if (reclamo) {
      try {
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
  };

  // Funciones para manejar las acciones del modal
  const handleAceptar = async () => {
    console.log('Aceptar');
    try {
      const response = await fetch(`http://localhost:3000/api/reparaciones/actualizarEstado/${reparacion.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevoEstado: 'aceptada',
          nuevoMovimiento: 'Presupuesto aceptado',
          nuevaAccion: 'Deberá aguardar a que finalice el proceso de reparación',
        }),
      });
  
      if (response.ok) {
        //const data = await response.json();
        alert('La reparación ha sido aceptada con éxito.');
        // Aquí puedes añadir lógica adicional si necesitas actualizar el UI o realizar otras acciones
      } else {
        const errorData = await response.text();
        alert(`Error al aceptar la reparación: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al aceptar la reparación:', error);
      alert('Hubo un problema al intentar aceptar la reparación.');
    }
    setMostrarModal(false);
  };
  
  const handleDeclinar = async () => {
    // Solicitar confirmación antes de proceder con la declinación
    const confirmarDeclinacion = window.confirm("Esta Usted seguro de finalizar el proceso de reparación/revisión al declinar el presupuesto?. Aclaro que cancelar podría volver al menú anterior.");
    
    if (confirmarDeclinacion) {
      // Mostrar un segundo mensaje informativo
      window.alert("Si pasados los 60 días, la misma no es retirada, se interpretará que el titular renuncia a la propiedad de la cosa, quedando Dosivac S.A. en condiciones de disponer de la misma según considere.");
      
      console.log('Declinar');
      try {
        const response = await fetch(`http://localhost:3000/api/reparaciones/actualizarEstado/${reparacion.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nuevoEstado: 'declinada',
            nuevoMovimiento: 'Presupuesto declinado',
            nuevaAccion: 'Debe pasar a retirar la reparación que se encuentra declinada',
            
          }),
        });
  
        if (response.ok) {
          alert('La reparación ha sido declinada con éxito.');
          // Opcional: aquí puedes añadir lógica adicional si necesitas actualizar el UI o realizar otras acciones
        } else {
          const errorData = await response.json();
          alert(`Error al declinar la reparación: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error al declinar la reparación:', error);
        alert('Hubo un problema al intentar declinar la reparación.');
      }
      setMostrarModal(false);
    } else {
      // Si el usuario cancela la acción, opcionalmente puedes mantener el modal abierto o realizar otra acción
      console.log('Acción de declinación cancelada por el usuario');
      // No cerrar el modal si deseas que el usuario tenga la opción de reconsiderar o leer el mensaje nuevamente
      // setMostrarModal(false);
    }
  };
  

  const handleCancelar = () => {
    setMostrarModal(false);
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
            <a href="https://maps.app.goo.gl/9JGU3ARiCa76yAwG9" target="_blank" rel="noopener noreferrer">Ver en Google Maps</a>
          )}
          {reparacion.estado.toLowerCase().trim() !== "sin ingresar" && reparacion.estado.toLowerCase().trim() !== "declinada" && (
            <button onClick={() => abrirReclamo(reparacion.id)}>Abrir Reclamo</button>
          )}
          <button onClick={() => enviarMensajeAdmin(reparacion.id)}>Enviar Mensaje al Administrador</button>
          {mostrarBotonAcciones && (
            <button onClick={() => setMostrarModal(true)} style={{marginLeft: '10px'}}>Tomar acciones</button>
          )}
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

      <Modal
        isOpen={mostrarModal}
        onClose={handleCancelar}
        onAccept={handleAceptar}
        onDecline={handleDeclinar}
      />
    </div>
  );
}

export default DetalleReparacion;




