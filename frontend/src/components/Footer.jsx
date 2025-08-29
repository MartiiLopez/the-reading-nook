import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import '../pages/MainPage.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="social-icons">
                <FaInstagram />
                <FaFacebookF />
                <FaTwitter />
            </div>
            <div className="copyright">
                <p>&copy; 2025 The Reading Nook. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;