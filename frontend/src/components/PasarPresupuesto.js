import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PasarPresupuesto = ({ volver }) => {
    const [reparaciones, setReparaciones] = useState([]);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');

    const handleFileChange = (event) => {
        setArchivoSeleccionado(event.target.files[0]);
    };

    const adjuntarPresupuesto = async (id) => {
        if (!archivoSeleccionado) {
            alert("Por favor, selecciona un archivo para adjuntar.");
            return;
        }

        const formData = new FormData();
        formData.append('presupuesto', archivoSeleccionado);
        formData.append('reparacionId', id); // Asegúrate de enviar el ID de la reparación

        try {
            const response = await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // Añadir comentario de presupuesto adjunto
                const comentarioPresupuesto = "Presupuesto adjuntado y pendiente de aprobación";
                let updatedReparaciones = reparaciones.map(rep => {
                    if (rep.id === id) {
                        return {
                            ...rep,
                            presupuestoAdjunto: true,
                            movimientos: [...rep.movimientos, comentarioPresupuesto],
                            accionesPendientes: comentarioPresupuesto
                        };
                    }
                    return rep;
                });
                setReparaciones(updatedReparaciones);

                setMensajeExito(`Presupuesto adjuntado con éxito para la reparación "${response.data.nombre}"`);
                setTimeout(() => setMensajeExito(''), 3000);
            }
        } catch (error) {
            console.error('Error al adjuntar el presupuesto:', error);
            alert('Error al adjuntar el presupuesto, inténtalo de nuevo.');
        }
    };

    const enviarPresupuesto = async (id, email) => {
        // La lógica para enviar presupuesto permanece igual.
    };

    useEffect(() => {
        const fetchReparaciones = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/reparaciones/en_revision');
                setReparaciones(data.map(rep => ({
                    ...rep,
                    presupuestoAdjunto: false,
                    movimientos: rep.movimientos || [],
                    accionesPendientes: rep.accionesPendientes || ""
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
            {mensajeExito && <p>{mensajeExito}</p>}
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
                            <>
                                <button onClick={() => enviarPresupuesto(rep.id, rep.email)}>Enviar Presupuesto</button>
                                {rep.archivoPresupuesto && (
                                    <a href={`http://localhost:3000/descargar/${rep.archivoPresupuesto}`} download>Descargar Presupuesto</a>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={volver}>Volver a la vista principal</button>
        </div>
    );
};

export default PasarPresupuesto;

