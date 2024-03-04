import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VistaLista.css';

function PresupuestosAceptados({ volver }) {
  const [reparacionesAprobadas, setReparacionesAprobadas] = useState([]);
  const [cargando, setCargando] = useState(false); // Estado para controlar la carga

  // Mover la definición de fetchReparacionesAprobadas fuera del useEffect para que sea accesible globalmente en el componente
  const fetchReparacionesAprobadas = async () => {
    setCargando(true); // Inicia la carga
    try {
      const response = await axios.get('http://localhost:3000/api/reparaciones/aprobadas');
      setReparacionesAprobadas(response.data);
    } catch (error) {
      console.error('Error al obtener las reparaciones aprobadas:', error);
      // Manejar el error adecuadamente
    } finally {
      setCargando(false); // Finaliza la carga
    }
  };

  useEffect(() => {
    fetchReparacionesAprobadas(); // Llama a la función dentro de useEffect
  }, []);

  const handleFinalizar = async (id) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/reparaciones/actualizarEstado/${id}`, {
        nuevoEstado: 'finalizada',
        nuevoMovimiento: 'Reparación finalizada',
        nuevaAccion: 'Debe pasar a retirar la reparación que se encuentra terminada',
      });

      if (response.status === 200) {
        alert('La reparación ha sido marcada como finalizada con éxito.');
        fetchReparacionesAprobadas(); // Ahora esta llamada es válida porque la función está definida en el ámbito correcto
      } else {
        alert('Hubo un problema al intentar finalizar la reparación.');
      }
    } catch (error) {
      console.error('Error al finalizar la reparación:', error);
      alert('Hubo un problema al intentar finalizar la reparación.');
    }
  };

  return (
    <div>
      <h2>Lista de Presupuestos Aceptados</h2>
      {cargando ? (
        <p>Cargando reparaciones...</p>
      ) : reparacionesAprobadas.length > 0 ? (
        <div className="lista-reparaciones"> {/* Utiliza div en lugar de ul para flex container */}
          {reparacionesAprobadas.map((reparacion) => (
            <div key={reparacion.id} className="reparacion-item"> {/* Utiliza div en lugar de li y agrega la clase para los estilos */}
              <span>Rep Nº: {reparacion.IDpalometa}</span>
              <span>Nombre: {reparacion.nombre}</span>
              <span>Modelo: {reparacion.modeloBomba}</span>
              <span>Estado: {reparacion.estado}</span>
              <button className="btn-ingresar" onClick={() => handleFinalizar(reparacion.id)}>Finalizada</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay reparaciones aprobadas.</p>
      )}
      <button onClick={volver} className="btn-volver">Volver a la vista principal</button>
    </div>
  );
}


export default PresupuestosAceptados;



