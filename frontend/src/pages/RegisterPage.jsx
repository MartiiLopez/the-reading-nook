import React from 'react';
import './RegisterPage.css';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-box">
        <h2 className="register-title">REGISTRARSE</h2>
        
        <RegisterForm />
        
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