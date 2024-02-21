import React, { useState, useEffect } from 'react';

function AceptarReparacion({ volver }) {
  const [reparacionesSinIngresar, setReparacionesSinIngresar] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReparacionesSinIngresar = async () => {
      try {
        const url = 'http://localhost:3000/api/reparaciones/sinIngresar';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('No se pudieron obtener las reparaciones.');
        }
        const data = await response.json();
        setReparacionesSinIngresar(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchReparacionesSinIngresar();
  }, []);

  // Función para formatear la fecha ISO a un formato más legible
  function formatearFechaISO(fechaIso) {
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const ano = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    console.log(`${dia}-${mes}-${ano} ${hora}:${minutos}`)
    return `${dia}-${mes}-${ano} ${hora}:${minutos}`;
  }

  const ingresarReparacion = async (id) => {
    try {
      // Obtiene la fecha actual en formato ISO y la formatea
      const fechaIngresoISO = new Date().toISOString();
      const fechaIngresoFormateada = formatearFechaISO(fechaIngresoISO);
      console.log("Enviando fecha formateada:", { fechaIngreso: fechaIngresoFormateada });


      const url = `http://localhost:3000/api/reparaciones/ingresar/${id}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Asegúrate de enviar la fecha formateada
        body: JSON.stringify({ fechaIngreso: fechaIngresoFormateada })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la reparación.');
      }

      // Actualiza la lista de reparaciones sin ingresar con la respuesta del servidor
      const actualizadas = await response.json();
      setReparacionesSinIngresar(actualizadas);
    } catch (error) {
      setError('Error al ingresar la reparación: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Reparaciones Sin Ingresar</h2>
      {error && <p>Error: {error}</p>}
      {reparacionesSinIngresar.length > 0 ? (
        <ul>
          {reparacionesSinIngresar.map((reparacion) => (
            <li key={reparacion.id}>
              <p>Nombre: {reparacion.nombre}</p>
              <p>Modelo de Bomba: {reparacion.modeloBomba}</p>
              <p>Estado: {reparacion.estado}</p>
              <button onClick={() => ingresarReparacion(reparacion.id)}>Ingresar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reparaciones sin ingresar.</p>
      )}
      <button onClick={volver}>Volver a la vista principal</button>
    </div>
  );
}

export default AceptarReparacion;
