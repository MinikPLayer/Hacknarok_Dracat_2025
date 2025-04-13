import React, { useState, useEffect } from 'react';
import { isUserAuthenticated } from "../../AuthContext";
import { Navigate, useNavigate } from 'react-router-dom';
import './main.css';
import { 
  FaMedal, 
  FaRoute, 
  FaCalendarAlt, 
  FaArrowRight, 
  FaStar, 
  FaMapMarkerAlt,
  FaPlus,
  FaCompass
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Main = () => {
    const navigate = useNavigate();
    const [lastTrip, setLastTrip] = useState({
        destination: "Kraków, Polska",
        date: "15-18 czerwca 2023",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1533856493584-0c6ca8ca9ce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        highlights: ["Zamek Królewski na Wawelu", "Rynek Główny", "Kazimierz"]
    });
    const [upcomingTrip, setUpcomingTrip] = useState({
        destination: "Gdańsk, Polska",
        date: "22-25 lipca 2023",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        countdown: "32 dni do wyjazdu"
    });
    const [loading, setLoading] = useState(false);

    if (!isUserAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Ładowanie danych podróży...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Nagłówek z gradientem i ikoną kota */}
            <motion.header 
                className="dashboard-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="header-content">
                    <h1>Witaj ponownie, <span className="highlight">Podróżniku</span>!</h1>
                    <p className="subtitle">Twoja podróż trwa dalej...</p>
                    <div className="header-decoration"></div>
                </div>
                <motion.img 
                    src="/media/kotsppanko.png" 
                    alt="Uroczy kot maskotka"
                    className="header-cat"
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.3
                    }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                />
            </motion.header>

            {/* Szybkie akcje */}
            <section className="quick-actions">
                <motion.button 
                    className="action-card primary"
                    onClick={() => navigate('/ranking')}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="action-icon">
                        <FaMedal />
                    </div>
                    <div className="action-content">
                        <h3>Ranking</h3>
                        <p>Zobacz swoją pozycję wśród znajomych</p>
                    </div>
                    <span className="action-arrow"><FaArrowRight /></span>
                </motion.button>

                <motion.button 
                    className="action-card secondary"
                    onClick={() => navigate('/form')}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="action-icon">
                        <FaRoute />
                    </div>
                    <div className="action-content">
                        <h3>Nowa podróż</h3>
                        <p>Zaplanuj swoją następną podróż</p>
                    </div>
                    <span className="action-arrow"><FaArrowRight /></span>
                </motion.button>

                <motion.button 
                    className="action-card cat-card"
                    onClick={() => navigate('/newPlace')}
                    whileHover={{ y: -5, rotate: -2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="action-icon">
                        <img 
                            src="/media/kotsppanko.png" 
                            alt="Dodaj nowe miejsce" 
                            className="cat-icon"
                        />
                    </div>
                    <div className="action-content">
                        <h3>Dodaj nowe miejsce</h3>
                        <p>Podziel się swoimi ulubionymi miejscówkami</p>
                    </div>
                    <span className="action-arrow"><FaArrowRight /></span>
                </motion.button>
            </section>

            {/* Sekcja ostatniej podróży */}
            <section className="trip-section">
                <div className="section-header">
                    <h2 className="section-title">Twoja ostatnia przygoda</h2>
                    <button className="view-all" onClick={() => navigate('/trips')}>
                        Zobacz wszystkie <FaArrowRight />
                    </button>
                </div>
                
                {lastTrip ? (
                    <motion.div 
                        className="trip-card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div 
                            className="trip-image"
                            style={{ backgroundImage: `url(${lastTrip.image})` }}
                        >
                            <div className="image-overlay"></div>
                            <div className="trip-badge">Zakończona</div>
                        </div>
                        <div className="trip-info">
                            <div className="trip-header">
                                <div>
                                    <h3>{lastTrip.destination}</h3>
                                    <p className="trip-date"><FaCalendarAlt /> {lastTrip.date}</p>
                                </div>
                                <div className="trip-rating">
                                    <FaStar className="star-icon" />
                                    <span>{lastTrip.rating}</span>
                                </div>
                            </div>
                            
                            <div className="trip-highlights">
                                <h4>Najważniejsze punkty podróży:</h4>
                                <div className="highlight-tags">
                                    {lastTrip.highlights.map((highlight, index) => (
                                        <span key={index} className="highlight-tag">
                                            <FaMapMarkerAlt /> {highlight}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                className="btn-details"
                                onClick={() => navigate('/worlds')}
                            >
                                Zobacz pełne doświadczenie <FaArrowRight />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="no-trips">
                        <div className="no-trips-content">
                            <h3>Brak podróży</h3>
                            <p>Rozpocznij swoją przygodę już dziś!</p>
                            <button 
                                className="btn-primary"
                                onClick={() => navigate('/swiper')}
                            >
                                <FaPlus /> Zaplanuj swoją pierwszą podróż
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Main;