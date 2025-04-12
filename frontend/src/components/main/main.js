import React, { useState, useEffect } from 'react';
import { isUserAuthenticated } from "../../AuthContext";
import { Navigate } from 'react-router-dom';

const Main = () => {
    const [groups, setGroups] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [lastTrip, setLastTrip] = useState(null); // Informacje o ostatniej podróży
    const [loading, setLoading] = useState(false);


    if (!isUserAuthenticated()) {
        // Redirect to login page if no token exists
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Welcome to Your Dashboard</h1>

            <section className="mb-5">
                <h2>Navigation</h2>
                <div className="d-flex flex-column">
                    <a href="/ranking" className="btn btn-primary mb-2">Go to Ranking</a>
                    <a href="/swiper" className="btn btn-secondary mb-2">Choose Your Next Trip</a>
                </div>
            </section>

            <section className="mb-5">
                <h2>Last Trip</h2>
                {lastTrip ? (
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{lastTrip.destination}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">{lastTrip.date}</h6>
                            <p className="card-text">{lastTrip.description}</p>
                        </div>
                    </div>
                ) : (
                    <p>No information about the last trip.</p>
                )}
            </section>
        </div>
    );
};

export default Main;