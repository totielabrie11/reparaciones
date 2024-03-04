import React, { useState, useEffect } from 'react';
import '../styles/VistaLista.css';

function ModificarEstados({ volver }) {
  const [reparaciones, setReparaciones] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/reparaciones/ingresadas')
      .then(response => response.json())
      .then(data => {
        const reparacionesIngresadas = data.filter(rep => rep.estado === 'ingresada');
        setReparaciones(reparacionesIngresadas);
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
      setReparaciones(reparaciones.map(r => r.id === rep.id ? { ...r, estado: nuevoEstado, opcionNumeroSerie: opcionNumeroSerie, numeroSerie: numeroSerie } : r));
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  return (
    <div className="aceptar-reparacion">
      <h2>Reparaciones que ingresarán al circuito de reparaciones</h2>
      <ul className="lista-reparaciones">
        {reparaciones.map((rep, index) => (
          <li key={index} className="reparacion-item">
            <p>Nº Rep: {rep.IDpalometa}</p>
            <p>Nombre: {rep.nombre}</p>
            <p>Modelo de Bomba: {rep.modeloBomba}</p>
            <p>Número de serie: {rep.numeroSerie}</p>
            <p>Estado: {rep.estado}</p>
            <button className="btn-ingresar" onClick={() => pasarARevision(rep)}>Pasar a revisión</button>
          </li>
        ))}
      </ul>
      <button className="btn-volver" onClick={volver}>Volver a la vista principal</button>
    </div>
  );
}
export default ModificarEstados;
