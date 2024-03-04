import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VistaLista.css';

function PresupuestosDeclinados({ volver }) {
  const [reparacionesDeclinadas, setReparacionesDeclinadas] = useState([]);
  const [cargando, setCargando] = useState(false); // Estado para controlar la carga

  useEffect(() => {
    const fetchReparacionesDeclinadas = async () => {
      setCargando(true); // Inicia la carga
      try {
        const response = await axios.get('http://localhost:3000/api/reparaciones/declinadas');
        setReparacionesDeclinadas(response.data);
      } catch (error) {
        console.error('Error al obtener las reparaciones declinadas:', error);
        // Manejar el error adecuadamente
      } finally {
        setCargando(false); // Finaliza la carga
      }
    };

    fetchReparacionesDeclinadas();
  }, []);

  return (
    <div className="aceptar-reparacion">
      <h2>Lista de Presupuestos Declinados</h2>
      {cargando ? (
        <p>Cargando reparaciones...</p>
      ) : reparacionesDeclinadas.length > 0 ? (
        <div className="lista-reparaciones">
          {reparacionesDeclinadas.map((reparacion) => (
            <div key={reparacion.id} className="reparacion-item">
              <span>Rep Nº: {reparacion.IDpalometa}</span>
              <span>Nombre: {reparacion.nombre}</span>
              <span>Modelo: {reparacion.modeloBomba}</span>
              <span>Estado: {reparacion.estado}</span>
              {/* Agrega aquí más detalles de la reparación si es necesario */}
            </div>
          ))}
        </div>
      ) : (
        <p>No hay reparaciones declinadas.</p>
      )}
      <button onClick={volver} className="btn-volver">Volver a la vista principal</button>
    </div>
  );
};
export default PresupuestosDeclinados;

