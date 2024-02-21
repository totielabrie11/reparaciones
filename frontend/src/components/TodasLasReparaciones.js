import React, { useState, useEffect } from 'react';

function TodasLasReparaciones({volver}) {
  const [reparaciones, setReparaciones] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReparaciones = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reparaciones/todas');
        if (!response.ok) {
          throw new Error('No se pudieron obtener las reparaciones');
        }
        const data = await response.json();
        setReparaciones(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchReparaciones();
  }, []);

  return (
    <div>
      <h2>Todas las Reparaciones</h2>
      {error && <p>Error: {error}</p>}
      {reparaciones.length > 0 ? (
        <ul>
          {reparaciones.map((reparacion) => (
              <li key={reparacion.id}>
              <p>Tipo de entidad: {reparacion.tipoEntidad}</p>
              <p>Nombre: {reparacion.nombre}</p>
              <p>DNI/CUIT: {reparacion.dniCuit}</p>
              <p>Domicilio: {reparacion.domicilio}</p>
              <p>Email: {reparacion.email}</p>
              <p>Teléfono: {reparacion.telefono}</p>
              <p>Nombre de contacto: {reparacion.nombreContacto}</p>
              <p>Modelo de bomba: {reparacion.modeloBomba}</p>
              <p>Número de serie: {reparacion.numeroSerie || 'No especificado'}</p>
              <p>Tipo de servicio: {reparacion.tipoServicio}</p>
              <p>Causa: {reparacion.causa}</p>
              <p>Observaciones: {reparacion.observaciones}</p>
              <p>Estado: {reparacion.estado}</p>
              <p>Movimientos: {Array.isArray(reparacion.movimientos) ? reparacion.movimientos.join(", ") : 'Ninguno'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reparaciones registradas.</p>
      )}
      <button onClick={volver}>Volver</button> {/* Botón para volver */}
    </div>
  );
}

export default TodasLasReparaciones;
