// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { FaUserCircle, FaSearch, FaStar, FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Función para renderizar las estrellas de forma dinámica
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} className="star filled" />);
    }

    // Media estrella (si aplica)
    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key="half" className="star half-filled" />);
    }

    // Estrellas vacías
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
    }

    return <div className="rating-container">{stars}</div>;
};

const HomePage = () => {
    const [popularBooks, setPopularBooks] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]); // Nuevo estado para los resultados del buscador
    const navigate = useNavigate();

    // Lógica de "debouncing" para el buscador
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await axios.get(
                    `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=5`
                );
                setSearchResults(response.data.items);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
            }
        }, 500); // 500 ms de retraso

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Función para obtener los libros populares (sin cambios)
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
                    'http://localhost:8000/api/my-reviews/', 
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <div className="home-page-container">
            <header className="navbar">
                <div className="brand-name">THE READING NOOK</div>
                <div className="nav-right">
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Buscar libro..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="search-icon" />
                        {searchResults.length > 0 && (
                            <ul className="search-results-dropdown">
                                {searchResults.map((book) => (
                                    <li key={book.id}>
                                        <p>{book.volumeInfo.title}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
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
                                        <button className="change-session">CAMBIAR SESIÓN</button>
                                        <button onClick={handleLogout} className="logout-button">CERRAR SESIÓN</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="content">
                <section className="books-section">
                    <h2 className="section-title">NOVEDADES</h2>
                    <div className="book-cards-container">
                        {popularBooks.length > 0 ? (
                            popularBooks.map((book) => (
                                <div key={book.id} className="book-card">
                                    <div className="book-image-container">
                                        <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
                                    </div>
                                    <h3 className="book-title">{book.volumeInfo.title}</h3>
                                    {renderStars(book.volumeInfo.averageRating || 0)}
                                </div>
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

            <footer className="footer">
                <div className="social-icons">
                    <FaInstagram />
                    <FaFacebookF />
                    <FaTwitter />
                </div>
                <div className="copyright">
                    <p>&copy; 2024 The Reading Nook. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;