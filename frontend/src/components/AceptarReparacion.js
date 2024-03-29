import React, { useState, useEffect } from 'react';
import '../styles/VistaLista.css';

function AceptarReparacion({ volver }) {
  const [reparacionesSinIngresar, setReparacionesSinIngresar] = useState([]);
  const [filtro, setFiltro] = useState(''); // Estado para la cadena de búsqueda
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReparacionesSinIngresar = async () => {
      try {
        const url = 'http://localhost:3000/api/reparaciones/sinIngresar';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('No se pudieron obtener las reparaciones.');
        }
        const data = await response.json();
        setReparacionesSinIngresar(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchReparacionesSinIngresar();
  }, []);

  // Función que maneja el cambio en el input de búsqueda
  const handleSearchChange = (e) => {
    setFiltro(e.target.value.toLowerCase());
  };

   // Lista filtrada de reparaciones, que incluye solo las que coincidan con el filtro de búsqueda
  
  const reparacionesFiltradas = filtro
  ? reparacionesSinIngresar.filter((reparacion) =>
      reparacion.nombre.toLowerCase().includes(filtro)
    )
  : reparacionesSinIngresar;

  const validarIDTiketEIngresarReparacion = async (reparacion) => {
    const idTiketIngresado = prompt("Ingrese el IDTiket para poder ingresar la reparación:");
    if (idTiketIngresado === reparacion.IDTicket) {
      ingresarReparacion(reparacion.id);
    } else {
      alert("IDTiket inválido. No coincide con el IDTiket de la reparación seleccionada.");
    }
  };

  // Función para formatear la fecha ISO a un formato más legible
  function formatearFechaISO(fechaIso) {
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const ano = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    console.log(`${dia}-${mes}-${ano} ${hora}:${minutos}`)
    return `${dia}-${mes}-${ano} ${hora}:${minutos}`;
  }

  const ingresarReparacion = async (id) => {
    // Muestra un prompt para que el administrador ingrese el número de palometa
    const numeroPalometa = prompt("Ingrese número de palometa (6 dígitos):");
  
    // Verifica que el número ingresado sea válido (numérico y de 6 caracteres)
    if (numeroPalometa && numeroPalometa.length === 6 && !isNaN(numeroPalometa)) {
      // Si el número es válido, muestra un alert para confirmación
      const urlVerificar = `http://localhost:3000/api/reparaciones/verificarPalometa/${numeroPalometa}`;
      try {
        const respuestaVerificar = await fetch(urlVerificar);
        const existePalometa = await respuestaVerificar.json();
  
        if (existePalometa.existe) {
          alert("El número de palometa ingresado ya está en uso. Por favor, ingrese otro número.");
          return; // Detiene la ejecución si el número de palometa ya existe
        }
      } catch (error) {
        alert("Error al verificar el número de palometa. Intente nuevamente.");
        return; // Detiene la ejecución si hay un error en la verificación
      }
  
      
      const confirmar = window.confirm(`Número ingresado: ${numeroPalometa}. ¿Es correcto?`);
  
      if (confirmar) {
        try {
          // Obtiene la fecha actual en formato ISO y la formatea
          const fechaIngresoISO = new Date().toISOString();
          const fechaIngresoFormateada = formatearFechaISO(fechaIngresoISO);
          console.log("Enviando fecha formateada:", { fechaIngreso: fechaIngresoFormateada });
          
          const nuevoMovimiento = `Reparación fue ingresada en fecha ${fechaIngresoFormateada}`;
          const accionesPendientes = "En espera a ser atendida por un técnico";


          const url = `http://localhost:3000/api/reparaciones/ingresar/${id}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Asegúrate de enviar la fecha formateada y el IDpalometa
            body: JSON.stringify({ fechaIngreso: fechaIngresoFormateada,
              IDpalometa: numeroPalometa,
              nuevoMovimiento: nuevoMovimiento, // Enviar movimiento
              accionesPendientes: accionesPendientes, 
            })
          });
  
          if (!response.ok) {
            throw new Error('Error al actualizar el estado de la reparación.');
          }
  
          // Actualiza la lista de reparaciones sin ingresar con la respuesta del servidor
          const actualizadas = await response.json();
          setReparacionesSinIngresar(actualizadas);
  
          alert('Reparación ingresada con éxito.');
        } catch (error) {
          setError('Error al ingresar la reparación: ' + error.message);
        }
      } else {
        // Si el administrador declina la confirmación, puedes manejarlo aquí (opcional)
        alert("Ingreso cancelado por el administrador.");
      }
    } else {
      // Si el número ingresado no es válido, muestra un mensaje de error
      alert("Número de palometa inválido. Asegúrate de ingresar 6 dígitos numéricos.");
    }
  };
  

  return (
    <div className="aceptar-reparacion">
      <h2>Reparaciones Sin Ingresar</h2>
      {error && <p className="error">Error: {error}</p>}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        onChange={handleSearchChange}
        className="search-input"
      />
      {reparacionesFiltradas.length > 0 ? (
        <ul className="lista-reparaciones">
          {reparacionesFiltradas.map((reparacion) => (
            <li key={reparacion.id} className="reparacion-item">
              <p><strong>Nombre:</strong> {reparacion.nombre}</p>
              <p><strong>Modelo de Bomba:</strong> {reparacion.modeloBomba}</p>
              <p><strong>Número de serie:</strong> {reparacion.numeroSerie}</p>
              <p><strong>Estado:</strong> {reparacion.estado}</p>
              <button className="btn-ingresar" onClick={() => validarIDTiketEIngresarReparacion(reparacion)}>
                Validar e Ingresar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay reparaciones que coincidan con la búsqueda.</p>
      )}
      <button className="btn-volver" onClick={volver}>Volver a la vista principal</button>
    </div>
  );
  
}

export default AceptarReparacion;
