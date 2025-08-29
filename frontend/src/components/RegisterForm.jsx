import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import '../pages/RegisterPage.css'; 

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false); 
    const [hasError, setHasError] = useState(false); 

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden.');
            setHasError(true);
            setSuccess(false);
            return;
        }

        setIsLoading(true);
        setHasError(false); 
        setSuccess(false); 

        try {
            const response = await axios.post('http://localhost:8000/app/register/', {
                username,
                email, 
                password,
            });
            setMessage('Registro exitoso. Serás redirigido al login.');
            setSuccess(true); 
            setHasError(false); 

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setSuccess(false); 
            setHasError(true); 
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
            {success && <p className="success-message">{message}</p>}
            {hasError && <p className="error-message">{message}</p>}
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="INGRESE UN USUARIO" 
                className={`register-input ${hasError ? 'error-input' : ''}`} 
                required 
            />
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="INGRESE SU CORREO ELECTRÓNICO" 
                className={`register-input ${hasError ? 'error-input' : ''}`} 
                required 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="INGRESE UNA CONTRASEÑA" 
                className={`register-input ${hasError ? 'error-input' : ''}`} 
                required 
            />
            <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="REPITA LA CONTRASEÑA" 
                className={`register-input ${hasError ? 'error-input' : ''}`} 
                required 
            />
            
            <button type="submit" className="register-button primary-button" disabled={isLoading}>
                {isLoading ? 'REGISTRARSE...' : 'REGISTRARSE'}
            </button>
        </form>
    );
}

export default RegisterForm;