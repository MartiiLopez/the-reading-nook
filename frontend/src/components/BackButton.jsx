// src/components/BackButton.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './BackButton.css';

const BackButton = ({ to = "/" }) => {
    return (
        <div className="back-button-container">
            <Link to={to}>
                <FaArrowLeft className="back-arrow-icon" />
            </Link>
        </div>
    );
};

export default BackButton;