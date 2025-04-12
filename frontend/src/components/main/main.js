import React, { useState, useEffect } from 'react';
import { isUserAuthenticated } from "../../AuthContext";
import { Navigate, useNavigate } from 'react-router-dom';
import './main.css';
import { FaMedal, FaRoute, FaCalendarAlt, FaArrowRight, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const Main = () => {
    const navigate = useNavigate();
    const [lastTrip, setLastTrip] = useState({
        destination: "Kraków, Poland",
        date: "15-18 June 2023",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1533856493584-0c6ca8ca9ce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    });
    const [upcomingTrip, setUpcomingTrip] = useState({
        destination: "Gdańsk, Poland",
        date: "22-25 July 2023",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    });
    const [loading, setLoading] = useState(false);

    if (!isUserAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading your travel data...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Nagłówek */}
            <header className="dashboard-header">
                <h1>Welcome back, Traveler!</h1>
                <p>Discover your next adventure</p>
            </header>

            {/* Szybkie akcje */}
            <section className="quick-actions">
                <button className="action-card" onClick={() => navigate('/ranking')}>
                    <div className="action-icon">
                        <FaMedal />
                    </div>
                    <h3>Ranking</h3>
                    <p>See your position among friends</p>
                    <span className="action-arrow"><FaArrowRight /></span>
                </button>

                <button className="action-card" onClick={() => navigate('/form')}>
                    <div className="action-icon">
                        <FaRoute />
                    </div>
                    <h3>New Trip</h3>
                    <p>Plan your next journey</p>
                    <span className="action-arrow"><FaArrowRight /></span>
                </button>
            </section>

            {/* Ostatnia podróż */}
            <section className="trip-section">
                <h2 className="section-title">Your Last Adventure</h2>
                {lastTrip ? (
                    <div className="trip-card">
                        <div className="trip-image" style={{ backgroundImage: `url(${lastTrip.image})` }}></div>
                        <div className="trip-info">
                            <div className="trip-header">
                                <h3>{lastTrip.destination}</h3>
                                <div className="trip-rating">
                                    <FaStar className="star-icon" />
                                    <span>{lastTrip.rating}</span>
                                </div>
                            </div>
                            <p className="trip-date"><FaCalendarAlt /> {lastTrip.date}</p>
                            <button className="btn-details" onClick={() => navigate('/trip-details')}>
                                View Details <FaArrowRight />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="no-trips">
                        <p>You haven't taken any trips yet.</p>
                        <button className="btn-primary" onClick={() => navigate('/swiper')}>
                            Plan Your First Trip
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Main;