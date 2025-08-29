import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import './ReviewDetailPage.css';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

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

const ReviewDetailPage = () => {
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        
        const fetchReviewDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/app/the-review/${reviewId}/`);
                setReview(response.data);
            } catch (err) {
                setError("No se pudo cargar la reseña.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
        fetchReviewDetails();
    }, [reviewId]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    if (loading) return <div>Cargando reseña...</div>;
    if (error) return <div>{error}</div>;
    if (!review || !review.book) return <div>Reseña no encontrada.</div>;

    const book = review.book;

    return (
        <div>
            <Header username={username} handleLogout={handleLogout} />
            <BackButton to= { '/my-reviews' } />
            <div className="review-page-container">
                <main className="review-detail-content">
                    <div className="review-details-card">
                        <div className="card-header">
                            <h2 className="review-details-title">{book.title}</h2>
                            <div className="review-details-rating">{renderStars(review.rating)}</div>
                        </div>
                        <div className="card-body">
                            <p className="review-details-comment">{review.comment}</p>
                        </div>
                        <div className="card-footer">
                            <div className="user-info">
                                <p className="review-details-user">{review.user.username}</p>
                            </div>
                            <p className="review-details-date">
                                Publicada el: {new Date(review.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ReviewDetailPage;