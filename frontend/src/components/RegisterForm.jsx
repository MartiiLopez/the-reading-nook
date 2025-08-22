// src/components/RegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages/RegisterPage.css'; // Asegúrate de que este archivo exista para los estilos

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Añade el estado para el email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/app/register/', {
        username,
        email, // Asegúrate de incluir el email en la petición
        password,
      });
      setMessage('Registro exitoso. Serás redirigido al login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessages = Object.values(error.response.data).flat();
        setMessage(`Error: ${errorMessages[0]}`);
      } else {
        setMessage('Error en el registro. Inténtalo de nuevo.');
      }
      console.error('Error de registro:', error.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="INGRESE UN USUARIO" 
        className="register-input" 
        required 
      />
      <input 
        type="email" // Agrega este input para el email
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="INGRESE SU CORREO ELECTRÓNICO" 
        className="register-input" 
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="INGRESE UNA CONTRASEÑA" 
        className="register-input" 
        required 
      />
      <input 
        type="password" 
        value={confirmPassword} 
        onChange={(e) => setConfirmPassword(e.target.value)} 
        placeholder="REPITA LA CONTRASEÑA" 
        className="register-input" 
        required 
      />
      
      <button type="submit" className="register-button primary-button" disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'REGISTRARSE'}
      </button>
      
      {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
    </form>
  );
}

export default RegisterForm;