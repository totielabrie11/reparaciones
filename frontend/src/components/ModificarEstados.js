import React, {  useState, useEffect  } from 'react';
import PasarARevision from './PasarARevision';
import PasarPresupuesto from './PasarPresupuesto';
import PresupuestosAceptados from './PresupuestosAceptados';
import PresupuestosDeclinados from './PresupuestosDeclinados';
import '../styles/vistaAdministrador.css'; // Importar el archivo de estilos


function ModificarEstado({ volver }) {
  const [vistaActual, setVistaActual] = useState('');
  const [reparaciones, setReparaciones] = useState({
    ingresadas: [],
    enRevision: [],
    aceptadas: [],
    declinadas: []
  });

  const [contadores, setContadores] = useState({
    revision: 0,
    presupuesto: 0,
    aceptados: 0,
    declinados: 0
  });


  const fetchReparaciones = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/reparaciones/todas');
      if (!response.ok) {
        console.error('Respuesta no exitosa del servidor:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const datosDeReparaciones = await response.json();

      setReparaciones({
        ingresadas: datosDeReparaciones.filter(rep => rep.estado === 'ingresada'),
        enRevision: datosDeReparaciones.filter(rep => rep.estado === 'en revisión'),
        aceptadas: datosDeReparaciones.filter(rep => rep.estado === 'aceptada'),
        declinadas: datosDeReparaciones.filter(rep => rep.estado === 'declinada')
      });

      setContadores({
        revision: datosDeReparaciones.filter(rep => rep.estado === 'ingresada').length,
        presupuesto: datosDeReparaciones.filter(rep => rep.estado === 'en revisión').length,
        aceptados: datosDeReparaciones.filter(rep => rep.estado === 'aceptada').length,
        declinados: datosDeReparaciones.filter(rep => rep.estado === 'declinada').length
      });
    } catch (error) {
      console.error('Error al obtener las reparaciones:', error);
    }
  };

  useEffect(() => {
    fetchReparaciones();
  }, []);

  
    const volverDeHijo = () => {
      setVistaActual('');
      fetchReparaciones(); // Recarga las reparaciones para actualizar los contadores
    };
    

    return (
      <div className="vista-administrador">
        {vistaActual === '' && (
          <div className="menu-botones">
            {/* Botones para cambiar la vista actual */}
            <button onClick={() => setVistaActual('revision')} className="boton-azul">
              Pasar a Revisión <span className="contador">{contadores.revision}</span>
            </button>
            <button onClick={() => setVistaActual('presupuesto')} className="boton-azul">
              Pasar Presupuesto <span className="contador">{contadores.presupuesto}</span>
            </button>
            <button onClick={() => setVistaActual('aceptados')} className="boton-azul">
              Presupuestos Aceptados <span className="contador">{contadores.aceptados}</span>
            </button>
            <button onClick={() => setVistaActual('declinados')} className="boton-azul">
              Presupuestos Declinados <span className="contador">{contadores.declinados}</span>
            </button>
          </div>
        )}
  
        {/* Renderizado condicional de componentes hijos basado en `vistaActual` */}
        {vistaActual === 'revision' && <PasarARevision volver={volverDeHijo} reparaciones={reparaciones.enRevision} />}
        {vistaActual === 'presupuesto' && <PasarPresupuesto volver={volverDeHijo} reparaciones={reparaciones.ingresadas} />}
        {vistaActual === 'aceptados' && <PresupuestosAceptados volver={volverDeHijo} reparaciones={reparaciones.aceptadas} />}
        {vistaActual === 'declinados' && <PresupuestosDeclinados volver={volverDeHijo} reparaciones={reparaciones.declinadas} />}
  
        {/* Botón para volver a la vista principal (VistaDistinta.js) */}
        <button onClick={volver} className="btn-volver">Volver a la vista principal</button>
      </div>
    );
  }
  
  export default ModificarEstado;