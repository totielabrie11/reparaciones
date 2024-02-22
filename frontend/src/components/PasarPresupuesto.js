import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PasarPresupuesto = ({ volver }) => {
    const [reparaciones, setReparaciones] = useState([]);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

    const handleFileChange = (event) => {
        setArchivoSeleccionado(event.target.files[0]);
    };

    // Función para adjuntar el presupuesto
    const adjuntarPresupuesto = async (id) => {
        if (!archivoSeleccionado) {
            alert("Por favor, selecciona un archivo para adjuntar.");
            return;
        }

        const formData = new FormData();
        formData.append('presupuesto', archivoSeleccionado);

        try {
            await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Presupuesto adjuntado con éxito');
            // Aquí podrías actualizar el estado para reflejar que el presupuesto ha sido adjuntado
        } catch (error) {
            console.error('Error al adjuntar el presupuesto:', error);
        }
    };
    const enviarPresupuesto = async (id, email) => {
      try {
          // Asumiendo que tienes un endpoint '/api/enviar-presupuesto' que acepta POST requests
          const response = await axios.post('http://localhost:3000/api/enviar-presupuesto', {
              id: id,
              email: email,
              // Puedes incluir más datos si es necesario
          });
  
          if (response.status === 200) {
              console.log('Presupuesto enviado con éxito a ' + email);
              // Aquí puedes manejar la lógica post-envío, como actualizar el estado de la reparación
          } else {
              console.error('No se pudo enviar el presupuesto');
              // Manejar errores, por ejemplo, mostrando un mensaje al usuario
          }
      } catch (error) {
          console.error('Error al enviar el presupuesto:', error);
          // Manejar errores de red, por ejemplo, mostrando un mensaje al usuario
      }
  };
  

    useEffect(() => {
        const fetchReparaciones = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/reparaciones/en_revision');
                setReparaciones(response.data.map(rep => ({
                    ...rep,
                    presupuestoAdjunto: false // Inicialmente, ningún presupuesto está adjunto
                })));
            } catch (error) {
                console.error('Error al obtener las reparaciones:', error);
            }
        };

        fetchReparaciones();
    }, []);

    return (
        <div>
            <h2>Lista de reparaciones en revisión para presupuesto</h2>
            <ul>
                {reparaciones.map((rep, index) => (
                    <li key={index}>
                        <span>{rep.nombre}</span> - <span>{rep.modeloBomba}</span> - <span>{rep.estado}</span>
                        {!rep.presupuestoAdjunto && (
                            <>
                                <input type="file" onChange={handleFileChange} />
                                <button onClick={() => adjuntarPresupuesto(rep.id)}>Adjuntar Presupuesto</button>
                            </>
                        )}
                        {rep.presupuestoAdjunto && (
                            <button onClick={() => enviarPresupuesto(rep.id, rep.email)}>Enviar Presupuesto</button>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={volver}>Volver a la vista principal</button>
        </div>
    );
};

export default PasarPresupuesto;
