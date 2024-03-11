import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import '../styles/formularioReparacion.css';

function IngresoReparacion({ volverAPrincipal }) {
  const [formData, setFormData] = useState({
    tipoEntidad: '',
    nombre: '',
    dniCuit: '',
    domicilio: '',
    provincia: '',
    email: '',
    telefono: '',
    nombreContacto: '',
    modeloBomba: '',
    opcionNumeroSerie: '',
    numeroSerie: '',
    tipoServicio: '',
    causa: '',
    observaciones: '',
    estado: 'sin ingresar',
    descargaTicket:'',
    accionesPendientes: "Se debe enviar la reparación a Dosivac junto con el ticket de pre-carga a la siguiente dirección ",
    movimientos: '',
    fechaIngreso: "sin fecha",
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarInputNumeroSerie, setMostrarInputNumeroSerie] = useState(false);

  const handleMostrarFormulario = () => setMostrarFormulario(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const enviarPDFAlBackend = async (id, blob) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('pdf', blob, `ticket-reparacion-${id}.pdf`);
    
    try {
      const response = await fetch('http://localhost:3000/api/generar-pdf', {
          method: 'POST',
          body: formData, // FormData se enviará con el Blob del PDF
      });
    
      if (!response.ok) {
          // Si la respuesta no es OK, lanzamos un error
          throw new Error('La respuesta del servidor no fue OK');
      }
    
      if (!response.headers.get('Content-Type').includes('application/json')) {
          // Si la respuesta no es de tipo JSON, lanzamos un error
          throw new Error('Respuesta no es JSON');
      }
    
      // Solo leemos el cuerpo de la respuesta una vez
      const result = await response.json();
      console.log(`PDF generado y guardado con éxito: ${result.filePath}`);
    } catch (error) {
      console.error('Error al guardar el PDF:', error);
    }
};

  const generarPDF = async (id, dataConIDTicket) => {
    const doc = new jsPDF();
    // Configura y agrega contenido al PDF aquí...

    const anchoMaximo = 180; // Ancho máximo para el texto dentro de la página
    const lineHeight = 7; // Altura de línea para el espaciado entre líneas
  
    let yPosition = 10; // Inicia en la posición Y 10 en la página
  
    // Título
    doc.text("Ticket de Pre-Carga de Reparación", 10, yPosition);
    yPosition += 10;
  
    // ID de seguimiento
    doc.text(`ID identificacion unica para seguimiento: ${id}`, 10, yPosition);
    yPosition += 10;
  
    // IDTiket de ingreso
    doc.text(`IDTiket que permite ingresar la reparación: ${dataConIDTicket.IDTicket}`, 10, yPosition);
    yPosition += 10;
  
    // Resto de la información
    doc.text(`Modelo de bomba: ${dataConIDTicket.modeloBomba}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Nombre: ${dataConIDTicket.nombre}`, 10, yPosition);
    yPosition += 10;
  
    // Causa
    const causa = doc.splitTextToSize(`Causa: ${dataConIDTicket.causa}`, anchoMaximo);
    doc.text(causa, 10, yPosition);
    yPosition += (lineHeight * causa.length) + 5; // Incrementa la posición Y según el número de líneas que ocupa la causa
  
    // Observaciones
    const observaciones = doc.splitTextToSize(`Observaciones: ${dataConIDTicket.observaciones}`, anchoMaximo);
    doc.text(observaciones, 10, yPosition);
    
    // Ahora generamos el blob directamente desde jsPDF
    const blob = doc.output('blob');
    // Envía el Blob al backend una sola vez
  try {
    await enviarPDFAlBackend(id, blob);
  } catch (error) {
    console.error('Error al guardar el PDF:', error);
    alert('Error al guardar el PDF. Por favor, intente nuevamente.');
  }
    // Guardar el PDF
   
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

        // Función para generar un ID de ticket aleatorio
    const generarIDTicket = () => {
      const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const letraAleatoria = letras.charAt(Math.floor(Math.random() * letras.length));
      const numerosAleatorios = Math.floor(1000 + Math.random() * 9000); // Genera un número de 4 dígitos
      return letraAleatoria + numerosAleatorios;
    };

    // Agregar IDTicket al formData antes de enviar
   generarIDTicket();
    const dataConIDTicket = {
      ...formData,
      IDTicket: generarIDTicket(),
    };

    const url = 'http://localhost:3000/api/reparaciones';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataConIDTicket),
      });
  
      const result = await response.json();
      if (response.ok) {
        generarPDF(result.id, dataConIDTicket); // Cambiado formData a dataConIDTicket
        volverAPrincipal();  // O cualquier lógica de post-creación
      } else {
        throw new Error(result.message || 'Error al crear la reparación');
      }
    } catch (error) {
      console.error('Error al realizar la petición:', error.message);
      // Implementar manejo de errores en la UI
    }
  };
  

  const getCausaPlaceholder = () => {
    switch (formData.tipoServicio) {
      case 'garantia':
        return "Indique qué problema está presentando el equipo que invoca garantía";
      case 'revision':
        return "Indique qué problemas está presentando el equipo que requiere una revisión";
      default:
        return "Detalle la causa de la reparación";
    }
  };

  return (
    <div className="formulario-reparacion">
      <h2>Ingresar una nueva reparación</h2>
      {!mostrarFormulario && (
        <button onClick={handleMostrarFormulario}>Aceptar</button>
      )}
      {mostrarFormulario && (
        <form onSubmit={handleSubmit}>
          {/* Aquí van todos tus campos del formulario */}
          <select name="tipoEntidad" value={formData.tipoEntidad} onChange={handleChange} required>
            <option value="">Seleccionar tipo de entidad</option>
            <option value="persona">Persona</option>
            <option value="razonSocial">Razón Social</option>
          </select>
          
          {/* Asumiendo que tipoEntidad controla qué campo mostrar para identificación */}
          {formData.tipoEntidad && (
            <input
              type="text"
              name="dniCuit"
              value={formData.dniCuit}
              onChange={handleChange}
              placeholder={formData.tipoEntidad === 'persona' ? 'DNI' : 'CUIT'}
              required
            />
          )}
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
          />
          <input
            type="text"
            name="domicilio"
            value={formData.domicilio}
            onChange={handleChange}
            placeholder="Domicilio"
            required
          />

          <input
            type="text"
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            placeholder="Provincia"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />

          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
            required
          />

          <input
            type="text"
            name="nombreContacto"
            value={formData.nombreContacto}
            onChange={handleChange}
            placeholder="Nombre de contacto de referencia"
            required
          />

          <input
            type="text"
            name="modeloBomba"
            value={formData.modeloBomba}
            onChange={handleChange}
            placeholder="Modelo de bomba"
            required
          />

          <select
            name="opcionNumeroSerie"
            value={formData.opcionNumeroSerie}
            onChange={(e) => {
              handleChange(e);
              setMostrarInputNumeroSerie(e.target.value === "ingresar");
            }}
            required
          >
            <option value="">Seleccionar opción para número de serie</option>
            <option value="noTiene">No tiene número de serie</option>
            <option value="ingresar">Ingresar número de serie</option>
          </select>

          {mostrarInputNumeroSerie && (
            <input
              type="text"
              name="numeroSerie"
              value={formData.numeroSerie}
              onChange={handleChange}
              placeholder="Número de serie"
            />
          )}


          <select name="tipoServicio" value={formData.tipoServicio} onChange={handleChange} required>
            <option value="">Seleccionar servicio</option>
            <option value="garantia">Garantía</option>
            <option value="revision">Revisión</option>
          </select>

          <textarea
            name="causa"
            value={formData.causa}
            onChange={handleChange}
            placeholder={getCausaPlaceholder()}
            required
          />

          <input
            type="text"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Observaciones adicionales (opcional)"
          />

    <button type="submit">Enviar</button>
  </form>
      )}
      <button onClick={volverAPrincipal}>Volver</button>
    </div>
  );
}

export default IngresoReparacion;