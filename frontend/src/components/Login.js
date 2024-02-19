import React, { useState } from 'react';
// Importa tus usuarios desde el archivo JSON (ajusta la ruta según sea necesario)
import usuarios from '../data/contraseñaDb.json';

function Login({ onLoginSuccess }) {
  const [nombreUs, setNombreUs] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuario = usuarios.find((us) => us.nombreUs === nombreUs && us.contraseña === contraseña);

    if (usuario) {
      onLoginSuccess(usuario);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="form-login-derecha">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre de usuario" value={nombreUs} onChange={(e) => setNombreUs(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
