// src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages/LoginPage.css'; // Asegúrate de importar los estilos

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado de carga

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/app/token/', {
        username,
        password,
      });

      localStorage.setItem('authToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      setMessage('Inicio de sesión exitoso. Serás redirigido.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setMessage('Credenciales incorrectas. Inténtalo de nuevo.');
      console.error('Error de login:', error.response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="INGRESE SU USUARIO"
        className="login-input"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="INGRESE SU CONTRASEÑA"
        className="login-input"
        required
      />
      <button type="submit" className="login-button primary-button" disabled={isLoading}>
        {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
      </button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}

export default LoginForm;