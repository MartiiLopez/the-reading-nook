import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import BookDetailPage from './pages/BookDetailPage';
import ReviewPage from './pages/ReviewPage';
import MyReviewsPage from './pages/MyReviewsPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import EditReviewPage from './pages/EditReviewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/book/:bookId" element={<BookDetailPage />} />
        <Route path="/review/:isbn" element={<ReviewPage />} />
        <Route path="/my-reviews" element={<MyReviewsPage />} />
        <Route path="/reviews/:reviewId" element={<ReviewDetailPage />} />
        <Route path="/edit-review/:reviewId" element={<EditReviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;