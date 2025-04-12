import React, { useState, useEffect } from 'react';
import { isUserAuthenticated } from "../../AuthContext";
import { Navigate } from 'react-router-dom';


const Main = () => {
    const [groups, setGroups] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isUserAuthenticated()) {
            // Przykładowe dane
            setGroups([
                { id: 1, name: 'Group 1' },
                { id: 2, name: 'Group 2' },
                { id: 3, name: 'Group 3' }
            ]);
            setCalendarEvents([
                { id: 1, date: '2025-03-25', name: 'Event 1' },
                { id: 2, date: '2025-03-26', name: 'Event 2' }
            ]);
            setRecommendations([
                { id: 1, title: 'Recommendation 1' },
                { id: 2, title: 'Recommendation 2' }
            ]);
            setLoading(false);
        }
    }, []);

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
                <h2>Your Groups</h2>
                {groups.length === 0 ? (
                    <p>You are not part of any groups.</p>
                ) : (
                    <ul className="list-group">
                        {groups.map(group => (
                            <li key={group.id} className="list-group-item">
                                <a href={`/groups/${group.id}`}>{group.name}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="mb-5">
                <h2>Mini Calendar</h2>
                {calendarEvents.length === 0 ? (
                    <p>No upcoming events.</p>
                ) : (
                    <ul className="list-group">
                        {calendarEvents.map(event => (
                            <li key={event.id} className="list-group-item">
                                <strong>{event.date}</strong>: {event.name}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2>Recommendations</h2>
                {recommendations.length === 0 ? (
                    <p>No recommendations at the moment.</p>
                ) : (
                    <ul className="list-group">
                        {recommendations.map(rec => (
                            <li key={rec.id} className="list-group-item">
                                {rec.title}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default Main;
