import React, { useState, useEffect } from 'react';
import '../styles/VistaLista.css';

function ModificarEstados({ volver }) {
  const [reparaciones, setReparaciones] = useState([]);
  const [cargando, setCargando] = useState(true); // Estado para manejar la carga de datos

  useEffect(() => {
    setCargando(true); // Comenzar mostrando el indicador de carga
    fetch('http://localhost:3000/api/reparaciones/ingresadas')
      .then(response => response.json())
      .then(data => {
        const reparacionesIngresadas = data.filter(rep => rep.estado === 'ingresada');
        setReparaciones(reparacionesIngresadas);
        setCargando(false); // Ocultar el indicador de carga una vez que los datos están listos
      })
      .catch(error => {
        console.error('Error al obtener las reparaciones:', error);
        setCargando(false); // Asegurarse de ocultar el indicador de carga incluso si hay un error
      });
  }, []);

  const pasarARevision = async (rep) => {
    // Verificar si la reparación ya tiene número de serie
    if (rep.opcionNumeroSerie === "noTiene") {
      alert("Debe ingresar el número de serie para pasar la reparación a revisión");
      ingresarNumeroSerieManualmente(rep);
      return; // Salir de la función para no intentar pasar a revisión sin número de serie
    }
    
    // Si ya tiene número de serie, se puede pasar directamente a revisión
    actualizarEstadoReparacion(rep, 'en revisión', `La reparación ${rep.nombre} ha pasado a revisión.`, 'tiene');
  };

  const ingresarNumeroSerieManualmente = async (rep) => {
    const numeroSerie = prompt("Por favor, ingrese el número de serie:");
    if (numeroSerie) {
      // Actualizar el estado a "en revisión" y cambiar opcionNumeroSerie a "tiene"
      actualizarEstadoReparacion(rep, 'en revisión', 'Número de serie ingresado manualmente y reparación pasada a revisión.', 'tiene', numeroSerie);
    } else {
      alert("Debe ingresar el número de serie para pasar la reparación a revisión");
    }
  };

  const actualizarEstadoReparacion = async (rep, nuevoEstado, nuevoMovimiento, opcionNumeroSerie, numeroSerie = rep.numeroSerie) => {
    try {
      const response = await fetch(`http://localhost:3000/api/reparaciones/actualizarEstado/${rep.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevoEstado, nuevoMovimiento, opcionNumeroSerie, numeroSerie }),
      });
      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado de la reparación.');
      }
  
      // Asegurarse de que movimientos siempre sea tratado como un array
      const movimientosActualizados = Array.isArray(rep.movimientos) ? rep.movimientos : [];
      movimientosActualizados.push(nuevoMovimiento); // Ahora podemos estar seguros de que movimientos es un array
  
      // Actualizar la reparación en tu estado con los nuevos movimientos
      setReparaciones(reparaciones.map(r => r.id === rep.id ? {
        ...r,
        estado: nuevoEstado,
        opcionNumeroSerie: opcionNumeroSerie,
        numeroSerie: numeroSerie,
        movimientos: movimientosActualizados // Asignar el array de movimientos actualizado
      } : r));
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };
  

  return (
    <div className="aceptar-reparacion">
      <h2>Reparaciones que ingresarán al circuito de reparaciones</h2>
      {cargando ? (
        <p>Cargando...</p> // Mostrar mensaje de carga mientras se cargan los datos
      ) : reparaciones.length > 0 ? (
        <ul className="lista-reparaciones">
          {reparaciones.map((rep, index) => (
            <li key={index} className="reparacion-item">
              <p>Nº Rep: {rep.IDpalometa}</p>
              <p>Nombre: {rep.nombre}</p>
              <p>Modelo de Bomba: {rep.modeloBomba}</p>
              <p>Número de serie: {rep.numeroSerie || 'No asignado'}</p>
              <p>Estado: {rep.estado}</p>
              <button className="btn-ingresar" onClick={() => pasarARevision(rep)}>Pasar a revisión</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reparaciones pendientes a ingresar al circuito de reparación.</p> // Mostrar si no hay reparaciones
      )}
      <button className="btn-volver" onClick={volver}>Volver a la vista principal</button>
    </div>
  );
  
}
export default ModificarEstados;
