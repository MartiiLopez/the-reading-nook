import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './EditReviewPage.css'; // Nuevo archivo CSS
import { FaStar } from 'react-icons/fa';
import BackButton from '../components/BackButton';

const renderStars = (rating, onClick) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <FaStar
                key={i}
                className={`star clickable-star ${i <= rating ? 'filled' : 'empty'}`}
                onClick={() => onClick(i)}
            />
        );
    }
    return <div className="rating-container">{stars}</div>;
};

const EditReviewPage = () => {
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [submitError, setSubmitError] = useState('');
    
    useEffect(() => {
        const fetchReview = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8000/app/the-review/${reviewId}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReview(response.data);
                setNewComment(response.data.comment);
                setNewRating(response.data.rating);
            } catch (error) {
                setSubmitError("Error al cargar la reseña para editar.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (reviewId) {
            fetchReview();
        }
    }, [reviewId, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token) {
            setSubmitError("Debes iniciar sesión para editar una reseña.");
            return;
        }

        try {
            await axios.put(`http://localhost:8000/app/the-review/${reviewId}/`, {
                rating: newRating,
                comment: newComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/my-reviews`);
        } catch (error) {
            setSubmitError("Error al actualizar la reseña.");
            console.error(error);
        }
    };
    
    const handleCancel = () => {
        if (review) {
            navigate('/my-reviews');
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (!review) return <div>Reseña no encontrada.</div>;

    return (
        <div>
            <Header />
            <div className="edit-review-page-container">
                <BackButton to= { '/my-reviews' } />
                        <h2>EDITAR RESEÑA</h2>
                <main className="edit-review-content">
                    <form onSubmit={handleUpdate} className="edit-review-form">
                        <div className="form-info">
                            <h3>{review.book.title}</h3>
                            <div className="rating-section">
                                <p>CALIFICACIÓN </p>
                                {renderStars(newRating, (rate) => setNewRating(rate))}
                            </div>
                        </div>
                        <div className="form-group">
                            <p>COMENTARIO</p>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Edita tu reseña aquí..."
                            />
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="save-button">GUARDAR CAMBIOS</button>
                            <button type="button" onClick={handleCancel} className="cancel-button">CANCELAR</button>
                        </div>
                        {submitError && <p className="submit-error">{submitError}</p>}
                    </form>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default EditReviewPage;