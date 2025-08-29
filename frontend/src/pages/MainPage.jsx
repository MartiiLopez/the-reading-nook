import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { FaRegStar, FaStarHalfAlt, FaStar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

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

const HomePage = () => {
    const [popularBooks, setPopularBooks] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [username, setUsername] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=4`
                );
                setSearchResults(response.data.items);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        const fetchPopularBooks = async () => {
            const genres = ['fantasy', 'science fiction', 'biography', 'history', 'thriller', 'mystery'];
            const randomGenre = genres[Math.floor(Math.random() * genres.length)];
            
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/books/v1/volumes?q=subject:${randomGenre}&orderBy=relevance&maxResults=4`
                );
                setPopularBooks(response.data.items);
            } catch (error) {
                console.error("Error fetching popular books:", error);
            }
        };

        const fetchUserReviews = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            try {
                const response = await axios.get(
                    'http://localhost:8000/app/my-reviews/', 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setUserReviews(response.data);
            } catch (error) {
                console.error("Error fetching user reviews:", error);
            }
        };

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

        fetchPopularBooks();
        fetchUserReviews();
        fetchUserDetails();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    return (
        <div className="home-page-container">
            <Header
                username={username}
                handleLogout={handleLogout}
            />

            <main className="content">
                <section className="books-section">
                    <h2 className="section-title">NOVEDADES</h2>
                    <div className="book-cards-container">
                        {popularBooks.length > 0 ? (
                            popularBooks.map((book) => (
                                <Link to={`/book/${book.id}`} key={book.id}>
                                    <div className="book-card">
                                        <div className="book-image-container">
                                            <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
                                        </div>
                                        <h3 className="book-title">{book.volumeInfo.title}</h3>
                                        {renderStars(book.volumeInfo.averageRating || 0)}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>Cargando libros...</p>
                        )}
                    </div>
                </section>

                <hr />

                <section className="user-reviews-section">
                    <h2 className="section-title">TUS ÚLTIMAS RESEÑAS</h2>
                    <div className="review-cards-container">
                        {userReviews.length > 0 ? (
                            userReviews.map((review) => (
                                <div key={review.id} className="review-card">
                                    <h3 className="book-title">{review.book.title}</h3>
                                    <p>{review.comment}</p>
                                    {renderStars(review.rating)}
                                </div>
                            ))
                        ) : (
                            <p className="no-reviews-message">¡Deja tu primera reseña!</p>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;