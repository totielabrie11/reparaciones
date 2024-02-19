import React, { useState } from 'react';
// Importa tus usuarios desde el archivo JSON (ajusta la ruta según sea necesario)
import usuarios from '../data/contraseñaDb.json';

function Login({ onLoginSuccess }) {
  const [nombreUs, setNombreUs] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(true); // Estado para controlar la visibilidad del formulario

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuario = usuarios.find((us) => us.nombreUs === nombreUs && us.contraseña === contraseña);

    if (usuario) {
      onLoginSuccess(usuario);
    } else {
      setError('Usuario o contraseña incorrectos');
      setMostrarForm(false); // Oculta el formulario
      // Configura un temporizador para mostrar nuevamente el formulario después de 3 segundos
      setTimeout(() => {
        setError('');
        setMostrarForm(true);
        // Opcionalmente, limpiar los campos
        setNombreUs('');
        setContraseña('');
      }, 3000); // 3000 milisegundos = 3 segundos
    }
  };

  return (
    <div className="form-login-derecha">
      {mostrarForm ? (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre de usuario" value={nombreUs} onChange={(e) => setNombreUs(e.target.value)} />
          <input type="password" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      ) : (
        <p>{error}</p> // Muestra el mensaje de error cuando el formulario está oculto
      )}
    </div>
  );
}

export default Login;
