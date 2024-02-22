import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PasarPresupuesto = ({ volver }) => {
    const [reparaciones, setReparaciones] = useState([]);

    useEffect(() => {
        const fetchReparaciones = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/reparaciones/en_revision');
                // Asumiendo que tu API devuelve un array de reparaciones
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

    // Simula la carga de un archivo PDF y la actualización del estado `presupuestoAdjunto`
    const adjuntarPresupuesto = async (id) => {
        console.log(`Adjuntando presupuesto para la reparación con ID ${id}`);
        // Simula la carga de un archivo PDF. Aquí deberías integrar la lógica real para adjuntar el archivo.
        // Por simplicidad, marcamos el presupuesto como adjunto en el estado local.
        setReparaciones(reparaciones.map(rep => rep.id === id ? { ...rep, presupuestoAdjunto: true } : rep));
    };

    // Función para simular el envío del presupuesto por email
    const enviarPresupuesto = async (id, email) => {
        console.log(`Enviando presupuesto a ${email}`);
        // Aquí deberías integrar la lógica real para enviar el presupuesto por email.
        // Esta es una simulación.
    };

    return (
        <div>
            <h2>Lista de reparaciones en revisión para presupuesto</h2>
            <ul>
                {reparaciones.map((rep, index) => (
                    <li key={index}>
                        <span>{rep.nombre}</span> - <span>{rep.modeloBomba}</span> - <span>{rep.estado}</span>
                        {!rep.presupuestoAdjunto && (
                            <button onClick={() => adjuntarPresupuesto(rep.id)}>Adjuntar Presupuesto</button>
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


