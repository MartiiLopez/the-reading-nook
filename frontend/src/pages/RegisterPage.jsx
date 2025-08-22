// src/components/RegisterPage.js
import React from 'react';
import './RegisterPage.css';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm'; // Importa el componente de lógica

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-box">
        <h2 className="register-title">REGISTRARSE</h2>
        
        {/* Renderiza el componente de lógica aquí */}
        <RegisterForm />

        {/* El botón de cancelar está fuera del formulario para que sea un enlace */}
        <Link to="/">
          <button type="button" className="register-button secondary-button">
            CANCELAR
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;