import React, { useState, useEffect } from 'react';

function ListarReparacionesSinIngresar() {
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
              {/* Aquí puedes agregar más detalles de cada reparación según necesites */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reparaciones sin ingresar.</p>
      )}
    </div>
  );
}

export default ListarReparacionesSinIngresar;