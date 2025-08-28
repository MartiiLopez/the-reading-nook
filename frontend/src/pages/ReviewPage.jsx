// src/components/ReviewPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReviewPage.css';
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

// Función para renderizar estrellas (la misma que en otros componentes)
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

const ReviewPage = () => {
    const { isbn } = useParams(); // Ahora usamos 'isbn'
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                // Buscamos el libro por su ISBN
                const bookResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
                if (bookResponse.data.items && bookResponse.data.items.length > 0) {
                    setBook(bookResponse.data.items[0]);
                } else {
                    // Manejar el caso si el libro no se encuentra
                    setSubmitError("Libro no encontrado con este ISBN.");
                }
            } catch (err) {
                console.error("Error fetching book details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isbn) {
            fetchBookDetails();
        }
    }, [isbn]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token) {
            setSubmitError("Debes iniciar sesión para dejar una reseña.");
            return;
        }
        if (!newComment || newRating === 0) {
            setSubmitError("Debes escribir un comentario y calificar el libro.");
            return;
        }

        let publishedDate = book.volumeInfo.publishedDate || '2000-01-01';
            if (publishedDate.length === 4) { // If it's only the year
                publishedDate = `${publishedDate}-01-01`;
        }
                
        try {
            await axios.post(
                `http://localhost:8000/app/reviews/`, 
                {
                    isbn: isbn,
                    rating: newRating,
                    comment: newComment,
                    title: book.volumeInfo.title,
                    author: book.volumeInfo.authors?.join(', ') || 'N/A',
                    published_date: publishedDate,
                    summary: book.volumeInfo.description || '',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            navigate(`/book/${book.id}`); // Redirige de vuelta a la página del libro
        } catch (error) {
            setSubmitError("Error al enviar la reseña. Inténtalo de nuevo.");
            console.error("Error submitting review:", error);
        }
    };
    
    const handleCancel = () => {
        navigate(`/book/${book.id}`);
    };

    if (loading) return <div>Cargando...</div>;
    if (!book) return <div>Libro no encontrado.</div>;

    return (
        <div>
            <Header />
            <div className="review-page-container">
                <BackButton to= { `/book/${book.id}` } />
                    <h2>DEJA TU RESEÑA</h2>
                <form onSubmit={handleReviewSubmit} className="review-form">
                    <div className="form-info">
                        <div className="form-details">
                            <h3>{book.volumeInfo.title}</h3>
                            <div className="rating-section">
                        <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
                                <p>CALIFICACIÓN </p>
                                {renderStars(newRating, (rate) => setNewRating(rate))}
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <p>COMENTARIO</p>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="¿QUÉ TE PARECIÓ EL LIBRO?"
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="save-button">GUARDAR</button>
                        <button type="button" onClick={handleCancel} className="cancel-button">CANCELAR</button>
                    </div>
                    {submitError && <p className="submit-error">{submitError}</p>}
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default ReviewPage;