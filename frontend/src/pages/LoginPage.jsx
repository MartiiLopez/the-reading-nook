import React from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm'; 

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">INICIAR SESIÓN</h2>

        <LoginForm />
    
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