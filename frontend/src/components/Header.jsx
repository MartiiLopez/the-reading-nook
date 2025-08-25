// src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import SearchBar from './SearchBar'; // Importa el nuevo componente
import '../pages/MainPage.css';

const Header = ({ username, isMenuOpen, toggleMenu, handleLogout }) => {
    return (
        <header className="navbar">
            <div className="brand-name">THE READING NOOK</div>
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