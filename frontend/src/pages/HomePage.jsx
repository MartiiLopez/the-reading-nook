import React from 'react';
import './HomePage.css'; 
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <h1 className="main-title">THE READING NOOK</h1>
        <p className="subtitle">TU PRÓXIMA HISTORIA TE ESTÁ ESPERANDO</p>
      </header>

      <main className="welcome-container">
        <div className="welcome-box">
          <h2 className="welcome-title">¡BIENVENIDO!</h2>
           <Link to="/login">
            <button className="button">INICIAR SESIÓN</button>
          </Link>
          <Link to="/register">
            <button className="button">REGISTRARSE</button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;