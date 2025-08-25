// src/components/Header.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import SearchBar from './SearchBar'; 
import '../pages/MainPage.css';

const Header = ({ username, handleLogout }) => {
    // La lógica del estado del sidebar se mueve aquí
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="navbar">
            <div className="brand-name">
                <Link to="/main">
                    THE READING NOOK
                </Link>
                </div>
            <div className="nav-right">
                <SearchBar />
                <div className="profile-menu">
                    <FaUserCircle className="user-icon" onClick={toggleMenu} />
                    {isMenuOpen && (
                        <>
                            <div className="sidebar-curtain" onClick={toggleMenu}></div>
                            <div className="user-sidebar">
                                <div className="sidebar-header">
                                    <FaUserCircle className="sidebar-user-icon" />
                                    <p>¡Hola, {username}!</p>
                                </div>
                                <div className="sidebar-buttons">
                                    <Link to="/my-reviews">
                                        <button>VER MIS RESEÑAS</button>
                                    </Link>
                                    <button onClick={handleLogout} className="logout-button">CERRAR SESIÓN</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;