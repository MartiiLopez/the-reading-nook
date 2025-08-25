// src/components/MyReviewsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MyReviewsPage.css';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

// Función para renderizar las estrellas
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} className="star filled" />);
    }
    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key="half" className="star half-filled" />);
    }
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
    }
    return <div className="rating-container">{stars}</div>;
};

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Lógica para obtener el nombre de usuario
    const [username, setUsername] = useState('');
    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            try {
                const response = await axios.get(
                    'http://localhost:8000/app/user/', 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setUsername(response.data.username);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    useEffect(() => {
        const fetchMyReviews = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(
                    'http://localhost:8000/app/my-reviews/', 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setReviews(response.data);
            } catch (err) {
                setError("No se pudieron cargar tus reseñas.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyReviews();
    }, [navigate]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="reviews-page-container">
            <Header username={username} handleLogout={handleLogout} />
            <main className="reviews-content">
                <section className="reviews-section">
                    <h2 className="reviews-title">MIS RESEÑAS</h2>
                    <div className="reviews-list-container">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="review-card">
                                    <h3 className="review-book-title">{review.book.title}</h3>
                                    <p className="review-comment">{review.comment}</p>
                                    <div className="review-rating">{renderStars(review.rating)}</div>
                                </div>
                            ))
                        ) : (
                            <p className="no-reviews-message">No has hecho ninguna reseña aún.</p>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default MyReviewsPage;