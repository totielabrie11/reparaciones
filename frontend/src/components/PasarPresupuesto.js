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

        const reparacion = reparaciones.find(rep => rep.id === id);
        if (!reparacion) {
            console.error('Reparación no encontrada');
            return;
        }

        const formData = new FormData();
        formData.append('presupuesto', archivoSeleccionado);
        formData.append('reparacionId', id); // Asegúrate de enviar el ID de la reparación

        try {
            await axios.post('http://localhost:3000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Añadir comentario de presupuesto adjunto
            const comentarioPresupuesto = `Presupuesto adjuntado y pendiente de aprobación, el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`;
            reparacion.movimientos.push(comentarioPresupuesto);

            setMensajeExito(`Presupuesto adjuntado con éxito para la reparación "${reparacion.nombre}"`);
            setTimeout(() => setMensajeExito(''), 3000);

            setReparaciones(reparaciones.map(rep => rep.id === id ? { ...rep, presupuestoAdjunto: true, movimientos: [...rep.movimientos, comentarioPresupuesto] } : rep));
        } catch (error) {
            console.error('Error al adjuntar el presupuesto:', error);
            alert('Error al adjuntar el presupuesto, inténtalo de nuevo.');
        }
    };

    const enviarPresupuesto = async (id, email) => {
        try {
            const response = await axios.post('http://localhost:3000/api/enviar-presupuesto', {
                id,
                email,
            });

            if (response.status === 200) {
                // Añadir comentario de presupuesto enviado
                const comentarioEnviado = `Presupuesto enviado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`;
                const reparacion = reparaciones.find(rep => rep.id === id);
                reparacion.movimientos.push(comentarioEnviado);

                alert(`Presupuesto enviado con éxito a ${email}`);
                setReparaciones(reparaciones.map(rep => rep.id === id ? { ...rep, movimientos: [...rep.movimientos, comentarioEnviado] } : rep));
            } else {
                alert('No se pudo enviar el presupuesto');
            }
        } catch (error) {
            console.error('Error al enviar el presupuesto:', error);
            alert('Error al enviar el presupuesto, inténtalo de nuevo.');
        }
    };

    useEffect(() => {
        const fetchReparaciones = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/reparaciones/en_revision');
                setReparaciones(data.map(rep => ({
                    ...rep,
                    presupuestoAdjunto: false,
                    movimientos: rep.movimientos || [] // Asegura que todos tengan el array movimientos
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
