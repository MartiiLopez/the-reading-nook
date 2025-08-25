// src/components/BookDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookDetailPage.css';
import { FaStar, FaRegStar, FaStarHalfAlt, FaUserCircle } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

const BookDetailPage = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const bookResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
                const bookData = bookResponse.data;
                setBook(bookData);

                const isbn = bookData.volumeInfo.industryIdentifiers?.find(
                    (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
                )?.identifier;

                if (isbn) {
                    const reviewsResponse = await axios.get(`http://localhost:8000/app/reviews/${isbn}`);
                    setReviews(reviewsResponse.data);
                }

            } catch (err) {
                setError("No se pudo cargar la información del libro.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (bookId) {
            fetchBookDetails();
        }
    }, [bookId]);

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!book) return <div className="not-found">Libro no encontrado.</div>;

    const synopsis = book.volumeInfo.description;
    const rating = book.volumeInfo.averageRating || 0;

    return (
        <div>
            <Header />
            <div className="book-detail-page">
                <header className="book-detail-header">
                    <div className="book-info">
                        <div className="left-column">
                            <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
                            {renderStars(rating)}
                            <button className="review-button">DEJA TU RESEÑA</button>
                        </div>
                        <div className="right-column">
                            <h2>{book.volumeInfo.title}</h2>
                            {synopsis ? (
                                <p className="synopsis">{synopsis}</p>
                            ) : (
                                <p className="synopsis">Sinopsis no disponible.</p>
                            )}
                        </div>
                    </div>
                </header>

                <main className="book-detail-content">
                    <section className="reviews-section">
                        <h3>RESEÑAS</h3>
                        <div className="reviews-list">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="review-card">
                                        <p className="review-user">{review.user.username}</p>
                                        <div className="rating">{renderStars(review.rating)}</div>
                                        <p className="review-comment">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">No hay reseñas para este libro. ¡Sé el primero!</p>
                            )}
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default BookDetailPage;