import React, { useState } from 'react';
import AceptarReparacion from './AceptarReparacion';
import ModificarEstados from './ModificarEstados';
import TodasLasReparaciones from './TodasLasReparaciones'; // Asegúrate de que el nombre del archivo y la ruta sean correctos

function VistaDistinta({ usuario, cerrarSesion }) {
    const [vistaActual, setVistaActual] = useState('inicio');

    // Función para manejar el regreso a la vista de inicio
    const volverAInicio = () => setVistaActual('inicio');

    // Renderiza los botones basados en el tipo de usuario y la vista actual
    const renderizarBotones = () => {
        if (vistaActual === 'inicio') {
            return (
                <>
                    <button onClick={() => setVistaActual('aceptar')}>Aceptar Reparaciones</button>
                    <button onClick={() => setVistaActual('modificar')}>Modificar Estados</button>
                    <button onClick={() => setVistaActual('todas')}>Ver Todas las Reparaciones</button>
                </>
            );
        }
    };

    return (
        <div>
            <h2>{usuario.tipo === 'administrador' ? 'Vista de Administrador' : 'Vista de Operador'}</h2>
            {renderizarBotones()}

            {vistaActual === 'aceptar' && <AceptarReparacion volver={volverAInicio} />}
            {vistaActual === 'modificar' && <ModificarEstados volver={volverAInicio} />}
            {vistaActual === 'todas' && <TodasLasReparaciones volver={volverAInicio} />}

            <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
    );
}

export default VistaDistinta;
