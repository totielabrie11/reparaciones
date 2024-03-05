import React, { useState, useEffect } from 'react';
import '../styles/VistaLista.css';

function PendienteRetiro({ volver, actualizarContadorRetirar }) {
  const [reparaciones, setReparaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Función para cargar las reparaciones
  const fetchReparaciones = () => {
    setCargando(true);
    fetch('http://localhost:3000/api/reparaciones/estado/finalizada-declinada')
      .then(response => response.json())
      .then(data => {
        setReparaciones(data);
        actualizarContadorRetirar(data.length); // Aquí se llama tras obtener los datos
        setCargando(false);
      })
      .catch(error => {
        console.error('Error al obtener las reparaciones:', error);
        setCargando(false);
      });
  };

  // useEffect para cargar las reparaciones al montar el componente
  useEffect(() => {
    fetchReparaciones();
  }, []);

  // Función para marcar una reparación como entregada
  const marcarComoEntregada = async (id) => {
    const nuevoMovimiento = `Reparación fue retirada`;

    const url = `http://localhost:3000/api/reparaciones/actualizarEstado/${id}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevoEstado: 'retirada',
          nuevoMovimiento: nuevoMovimiento,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado de la reparación.');
      }

      // Llamar a fetchReparaciones para actualizar la lista de reparaciones
      fetchReparaciones();
    } catch (error) {
      console.error('Error al marcar como entregada:', error);
    }
  };

  return (
    <div className="aceptar-reparacion">
      <h3>Reparaciones a retirar</h3>
      {cargando ? (
        <p>Cargando...</p>
      ) : reparaciones.length ? (
        <ul className="lista-reparaciones">
          {reparaciones.map((rep) => (
            <li key={rep.id} className="reparacion-item">
              <div>
                <span>Nº Rep: {rep.IDpalometa}</span>
                <span>Nombre: {rep.nombre}</span>
                <span>Estado: {rep.estado}</span>
              </div>
              {/* Botón para marcar la reparación como entregada */}
              <button onClick={() => marcarComoEntregada(rep.id)} className="btn-ingresar">Entregar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reparaciones pendientes a retirar.</p>
      )}
      {/* Botón para volver a la vista principal */}
      <button onClick={volver} className="btn-volver">Volver a la vista principal</button>
    </div>
  );
  
}

export default PendienteRetiro;

