import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages/LoginPage.css'; 
import { Link } from 'react-router-dom';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const [hasError, setHasError] = useState(false); 
    const [success, setSuccess] = useState(false); 

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setHasError(false);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:8000/app/token/', {
                username,
                password,
            });
            
            localStorage.setItem('authToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);

            setMessage('Inicio de sesión exitoso.');
            setSuccess(true);
            
            setTimeout(() => {
                navigate('/main');
            }, 2000);

        } catch (error) {
            setMessage('Usuario o contraseña no encontrados.');
            setHasError(true);
            setSuccess(false); 
            console.error('Error de login:', error.response.data);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {success && <p className="success-message visible">{message}</p>}
            {hasError && <p className={`error-message visible`}>{message}</p>}
            
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="INGRESE SU USUARIO" 
                className={`login-input ${hasError ? 'error-input' : ''}`} 
                required 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="INGRESE SU CONTRASEÑA" 
                className={`login-input ${hasError ? 'error-input' : ''}`} 
                required 
            />
            <button type="submit" className="login-button primary-button" disabled={isLoading}>
                {isLoading ? 'INICIAR SESIÓN' : 'INICIAR SESIÓN'}
            </button>
        </form>
    );
}

export default LoginForm;