import React, { useState } from 'react';
import '../styles/vistaAdministrador.css'; // Importar el archivo de estilos
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
                <div className="menu-botones">
                    <button onClick={() => setVistaActual('aceptar')} className="boton-vista">Aceptar Reparaciones</button>
                    <button onClick={() => setVistaActual('modificar')} className="boton-vista">Modificar Estados</button>
                    <button onClick={() => setVistaActual('todas')} className="boton-vista">Ver Todas las Reparaciones</button>
                </div>
            );
        }
    };

    return (
        <div className="vista-administrador">
            <h2>{usuario.tipo === 'administrador' ? 'Vista de Administrador' : 'Vista de Operador'}</h2>
            {renderizarBotones()}

            <div className="vista-actual">
                {vistaActual === 'aceptar' && <AceptarReparacion volver={volverAInicio} />}
                {vistaActual === 'modificar' && <ModificarEstados volver={volverAInicio} />}
                {vistaActual === 'todas' && <TodasLasReparaciones volver={volverAInicio} />}
            </div>

            <button onClick={cerrarSesion} className="btn-cerrar-sesion">Cerrar sesión</button>
        </div>
    );
}

export default VistaDistinta;

