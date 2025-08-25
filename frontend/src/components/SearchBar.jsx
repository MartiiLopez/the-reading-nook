// src/components/SearchBar.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import '../pages/MainPage.css';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

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

    return (
        <div className="search-bar-container">
            <input
                type="text"
                placeholder="Buscar libro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
            {searchResults && searchResults.length > 0 && (
                <ul className="search-results-dropdown">
                    {searchResults.map((book) => (
                        <li key={book.id}>
                            <Link to={`/book/${book.id}`}>
                                <p>{book.volumeInfo.title}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;