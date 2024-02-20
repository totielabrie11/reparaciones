import React, { useState, useEffect } from 'react';

function ModificarEstados({ volver }) {
  const [reparaciones, setReparaciones] = useState([]);

  useEffect(() => {
    // Similar a AceptarReparacion, pero filtrando por 'ingresada'
    fetch('/api/reparaciones/ingresadas') // Reemplazar con la ruta real a tu API
      .then(response => response.json())
      .then(data => {
        const reparacionesIngresadas = data.filter(rep => rep.estado === 'ingresada');
        setReparaciones(reparacionesIngresadas);
      });
  }, []);

  return (
    <div>
      <h2>Modificar Estados de Reparaciones</h2>
      <ul>
        {reparaciones.map((rep, index) => (
          <li key={index}>
            <span>{rep.nombre}</span> - <span>{rep.modeloBomba}</span> - <span>{rep.estado}</span>
            {/* Aquí agregarías la lógica para modificar el estado */}
          </li>
        ))}
      </ul>
      <button onClick={volver}>Volver a la vista principal</button>
    </div>
  );
}

export default ModificarEstados;
