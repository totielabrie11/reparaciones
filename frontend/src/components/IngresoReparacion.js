import React, { useState } from 'react';

function IngresoReparacion() {
  const [formData, setFormData] = useState({
    tipoEntidad: '',
    identificacion: '',
    dniCuit: '', // Campo para DNI o CUIT
    domicilio: '',
    email: '',
    telefono: '',
    nombreContacto: '',
    modeloBomba: '',
    numeroSerie: '',
    tipoServicio: '',
    causa: '',
    observaciones: '',
  });

  // Nuevo estado para controlar la visibilidad del formulario
   const [mostrarFormulario, setMostrarFormulario] = useState(false);

   const handleMostrarFormulario = () => {
    setMostrarFormulario(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Aquí implementar la lógica de envío
  };

// Función para determinar el placeholder del textarea basado en el tipo de servicio
const getCausaPlaceholder = () => {
  switch (formData.tipoServicio) {
    case 'garantia':
      return "Indique qué problema está presentando el equipo que invoca garantía";
    case 'revision':
      return "Indique qué problemas está presentando el equipo que requiere una revisión";
    default:
      return "";
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
        <select name="tipoEntidad" value={formData.tipoEntidad} onChange={handleChange} required>
          <option value="">Seleccionar tipo de entidad</option>
          <option value="persona">Persona</option>
          <option value="razonSocial">Razón Social</option>
        </select>
        
        {formData.tipoEntidad && (
          <input
            type="number"
            name="dniCuit"
            value={formData.dniCuit}
            onChange={handleChange}
            placeholder={formData.tipoEntidad === 'persona' ? 'DNI' : 'CUIT'}
            required
          />
        )}

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

        <button type="submit">Enviar</button>
      </form>
       )}
    </div>
  );
}

export default IngresoReparacion;
