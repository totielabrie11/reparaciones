import React, { useState } from 'react';

function IngresoReparacion({ volverAPrincipal }) {
  const [formData, setFormData] = useState({
    tipoEntidad: '',
    nombre: '',
    dniCuit: '',
    domicilio: '',
    email: '',
    telefono: '',
    nombreContacto: '',
    modeloBomba: '',
    numeroSerie: '',
    tipoServicio: '',
    causa: '',
    observaciones: '',
    estado: 'sin ingresar',
    movimientos: '',
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleMostrarFormulario = () => setMostrarFormulario(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:3000/api/reparaciones'; // Asegúrate de que esta es la URL correcta de tu API

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.message); // Mensaje de éxito del servidor
        volverAPrincipal(); // Manejar la navegación o limpiar el formulario como se desee
      } else {
        console.error(result.message); // Mensaje de error del servidor
        // Manejar el error mostrando un mensaje al usuario en la UI
      }
    } catch (error) {
      console.error('Error al realizar la petición:', error);
      // Manejar el error mostrando un mensaje al usuario en la UI
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
    <div>
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
            placeholder="Nombre"
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

          <input
            type="text"
            name="numeroSerie"
            value={formData.numeroSerie}
            onChange={handleChange}
            placeholder="Número de serie (opcional)"
          />

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
