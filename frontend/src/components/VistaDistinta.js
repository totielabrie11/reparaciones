import React, { useState, useEffect } from 'react';
import '../styles/vistaAdministrador.css'; // Importar el archivo de estilos
import AceptarReparacion from './AceptarReparacion';
import ModificarEstados from './ModificarEstados';
import TodasLasReparaciones from './TodasLasReparaciones'; // Asegúrate de que el nombre del archivo y la ruta sean correctos
import PendienteRetiro from './PendienteRetiro';
import ReparacionConMensaje from './ReparacionConMensaje';




function VistaDistinta({ usuario, cerrarSesion }) {
    const [vistaActual, setVistaActual] = useState('inicio');
    const [contadorRetirar, setContadorRetirar] = useState(0); // Nuevo estado para el contador

  // Función para cargar los contadores
  const cargarContadores = async () => {
    // Cargar el contador de reparaciones a retirar
    try {
      const respuesta = await fetch('http://localhost:3000/api/reparaciones/estado/finalizada-declinada');
      const reparaciones = await respuesta.json();
      setContadorRetirar(reparaciones.length);
    } catch (error) {
      console.error('Error al cargar el contador de reparaciones a retirar:', error);
    }

    // Carga otros contadores aquí...
  };
  useEffect(() => {
    // Cargar contadores cuando el componente se monta o la vistaActual cambia
    cargarContadores();
  }, [vistaActual]);
    // Función para actualizar el contador
    const actualizarContadorRetirar = (nuevoContador) => {
        setContadorRetirar(nuevoContador);
    };

    // Función para manejar el regreso a la vista de inicio
    const volverAInicio = () => setVistaActual('inicio');

    // Renderiza los botones basados en el tipo de usuario y la vista actual
    const renderizarBotones = () => {
        if (vistaActual === 'inicio') {
            return (
                <div className="menu-botones">
                    <button onClick={() => setVistaActual('aceptar')} className="boton-vista">Aceptar Reparaciones</button>
                    <button onClick={() => setVistaActual('modificar')} className="boton-vista">Modificar Estados</button>
                    <button onClick={() => setVistaActual('reparacionConMensaje')} className="boton-vista">
                      Ver Reparaciones Con Mensaje
                    </button>
                    <button onClick={() => setVistaActual('pendienteRetiro')} className="boton-vista">
                        Reparaciones a Retirar ({contadorRetirar}) {/* Aquí se muestra el contador */}
                    </button>
                    
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
                
                {vistaActual === 'pendienteRetiro' && (<PendienteRetiro volver={volverAInicio} actualizarContadorRetirar={actualizarContadorRetirar}/>)}
                {vistaActual === 'reparacionConMensaje' && <ReparacionConMensaje volver={volverAInicio} />}
                {vistaActual === 'todas' && <TodasLasReparaciones volver={volverAInicio} />}
            </div>

            <button onClick={cerrarSesion} className="btn-cerrar-sesion">Cerrar sesión</button>
        </div>
    );
}

export default VistaDistinta;

