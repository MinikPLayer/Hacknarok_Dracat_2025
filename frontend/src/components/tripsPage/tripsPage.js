import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSearch, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaStar,
  FaPlus
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './tripsPage.css';

const TripsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Przykładowe dane podróży
  const [trips, setTrips] = useState([
    {
      id: 1,
      destination: "Kraków, Polska",
      date: "15-18 czerwca 2023",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1533856493584-0c6ca8ca9ce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      highlights: ["Zamek Królewski na Wawelu", "Rynek Główny", "Kazimierz"],
      completed: true
    },
    {
      id: 2,
      destination: "Gdańsk, Polska",
      date: "22-25 lipca 2023",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      highlights: ["Długi Targ", "Westerplatte", "Muzeum Bursztynu"],
      completed: true
    },
    {
      id: 3,
      destination: "Warszawa, Polska",
      date: "5-8 sierpnia 2023",
      rating: 4.0,
      image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      highlights: ["Stare Miasto", "Łazienki Królewskie", "Muzeum Powstania Warszawskiego"],
      completed: true
    },
    {
      id: 4,
      destination: "Zakopane, Polska",
      date: "12-15 września 2023",
      rating: null,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      highlights: ["Krupówki", "Gubałówka", "Morskie Oko"],
      completed: false
    }
  ]);

  const filteredTrips = trips.filter(trip => 
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.highlights.some(highlight => 
      highlight.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const completedTrips = filteredTrips.filter(trip => trip.completed);
  const plannedTrips = filteredTrips.filter(trip => !trip.completed);

  return (
    <div className="trips-container">
      {/* Nagłówek */}
      <header className="trips-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Wróć
        </button>
        <h1>Moje podróże</h1>
        <button 
          className="new-trip-button"
          onClick={() => navigate('/form')}
        >
          <FaPlus /> Nowa podróż
        </button>
      </header>

      {/* Wyszukiwarka */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Wyszukaj podróże..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Nadchodzące podróże */}
      {plannedTrips.length > 0 && (
        <section className="trips-section">
          <h2 className="section-title">Nadchodzące podróże</h2>
          <div className="trips-grid">
            {plannedTrips.map(trip => (
              <motion.div 
                key={trip.id}
                className="trip-card upcoming"
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/trip/${trip.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="trip-image"
                  style={{ backgroundImage: `url(${trip.image})` }}
                >
                  <div className="trip-badge">Planowana</div>
                </div>
                <div className="trip-info">
                  <h3>{trip.destination}</h3>
                  <p className="trip-date">
                    <FaCalendarAlt /> {trip.date}
                  </p>
                  <div className="trip-highlights">
                    {trip.highlights.slice(0, 2).map((highlight, index) => (
                      <span key={index} className="highlight">
                        <FaMapMarkerAlt /> {highlight}
                      </span>
                    ))}
                    {trip.highlights.length > 2 && (
                      <span className="more-highlights">
                        +{trip.highlights.length - 2} więcej
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Zakończone podróże */}
      <section className="trips-section">
        <h2 className="section-title">Zakończone podróże ({completedTrips.length})</h2>
        {completedTrips.length > 0 ? (
          <div className="trips-grid">
            {completedTrips.map(trip => (
              <motion.div 
                key={trip.id}
                className="trip-card"
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/trip/${trip.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="trip-image"
                  style={{ backgroundImage: `url(${trip.image})` }}
                >
                  <div className="trip-badge">Zakończona</div>
                  {trip.rating && (
                    <div className="trip-rating">
                      <FaStar /> {trip.rating}
                    </div>
                  )}
                </div>
                <div className="trip-info">
                  <h3>{trip.destination}</h3>
                  <p className="trip-date">
                    <FaCalendarAlt /> {trip.date}
                  </p>
                  <div className="trip-highlights">
                    {trip.highlights.slice(0, 2).map((highlight, index) => (
                      <span key={index} className="highlight">
                        <FaMapMarkerAlt /> {highlight}
                      </span>
                    ))}
                    {trip.highlights.length > 2 && (
                      <span className="more-highlights">
                        +{trip.highlights.length - 2} więcej
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="no-trips">
            <p>Brak zakończonych podróży</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default TripsPage;