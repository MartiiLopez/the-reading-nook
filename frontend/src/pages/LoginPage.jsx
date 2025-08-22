// src/components/LoginPage.js
import React from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm'; // Importa el componente de lógica

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">INICIAR SESIÓN</h2>
        
        {/* Renderiza el formulario de lógica aquí */}
        <LoginForm />
        
        {/* El enlace para cancelar se mantiene fuera del formulario */}
        <Link to="/">
          <button type="button" className="login-button secondary-button">
            CANCELAR
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;