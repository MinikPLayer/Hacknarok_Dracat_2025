import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaStar, 
  FaHeart,
  FaFilter,
  FaCompass
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './explore.css';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    rating: 0,
    distance: 50
  });

  // Przykładowe miejsca do odkrycia
  const [places, setPlaces] = useState([
    {
      id: 1,
      name: "Zamek Królewski na Wawelu",
      location: "Kraków, Polska",
      rating: 4.8,
      category: "historyczne",
      distance: 2.5,
      image: "https://images.unsplash.com/photo-1551523711-2f6d4b1a5455?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      liked: false
    },
    {
      id: 2,
      name: "Morskie Oko",
      location: "Tatry, Polska",
      rating: 4.9,
      category: "natura",
      distance: 120,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      liked: false
    },
    {
      id: 3,
      name: "Stare Miasto",
      location: "Gdańsk, Polska",
      rating: 4.7,
      category: "kultura",
      distance: 0.5,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      liked: true
    },
    {
      id: 4,
      name: "Kopalnia Soli w Wieliczce",
      location: "Wieliczka, Polska",
      rating: 4.6,
      category: "historyczne",
      distance: 15,
      image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      liked: false
    },
    {
      id: 5,
      name: "Białowieski Park Narodowy",
      location: "Białowieża, Polska",
      rating: 4.9,
      category: "natura",
      distance: 250,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      liked: false
    },
    {
      id: 6,
      name: "Rynek Główny",
      location: "Wrocław, Polska",
      rating: 4.5,
      category: "kultura",
      distance: 1.2,
      image: "https://images.unsplash.com/photo-1533856493584-0c6ca8ca9ce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      liked: false
    }
  ]);

  const toggleLike = (id) => {
    setPlaces(places.map(place => 
      place.id === id ? {...place, liked: !place.liked} : place
    ));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const filteredPlaces = places.filter(place => {
    // Filtrowanie po wyszukiwaniu
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         place.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrowanie po kategorii
    const matchesCategory = filters.category === 'all' || place.category === filters.category;
    
    // Filtrowanie po ocenie
    const matchesRating = place.rating >= filters.rating;
    
    // Filtrowanie po odległości
    const matchesDistance = place.distance <= filters.distance;
    
    return matchesSearch && matchesCategory && matchesRating && matchesDistance;
  });

  return (
    <div className="explore-container">
      {/* Nagłówek */}
      <header className="explore-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1><FaCompass /> Odkrywaj</h1>
        <div className="header-actions">
          <button 
            className={`filter-button ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
          </button>
        </div>
      </header>

      {/* Wyszukiwarka */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Szukaj miejsc..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filtry */}
      {showFilters && (
        <motion.div 
          className="filters-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="filter-group">
            <label>Kategoria</label>
            <select 
              name="category" 
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="all">Wszystkie</option>
              <option value="historyczne">Historyczne</option>
              <option value="natura">Natura</option>
              <option value="kultura">Kultura</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Minimalna ocena: {filters.rating}</label>
            <input
              type="range"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={filters.rating}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>Maksymalna odległość: {filters.distance} km</label>
            <input
              type="range"
              name="distance"
              min="1"
              max="300"
              value={filters.distance}
              onChange={handleFilterChange}
            />
          </div>
        </motion.div>
      )}

      {/* Lista miejsc */}
      <div className="places-grid">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map(place => (
            <motion.div 
              key={place.id}
              className="place-card"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/place/${place.id}`)}
            >
              <div 
                className="place-image"
                style={{ backgroundImage: `url(${place.image})` }}
              >
                <button 
                  className={`like-button ${place.liked ? 'liked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(place.id);
                  }}
                >
                  <FaHeart />
                </button>
                <div className="place-rating">
                  <FaStar /> {place.rating}
                </div>
              </div>
              <div className="place-info">
                <h3>{place.name}</h3>
                <p className="place-location">
                  <FaMapMarkerAlt /> {place.location}
                </p>
                <p className="place-distance">{place.distance} km od Ciebie</p>
                <span className={`place-category ${place.category}`}>
                  {place.category}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-results">
            <p>Nie znaleziono miejsc spełniających kryteria</p>
            <button 
              className="reset-filters"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  category: 'all',
                  rating: 0,
                  distance: 50
                });
              }}
            >
              Wyczyść filtry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;