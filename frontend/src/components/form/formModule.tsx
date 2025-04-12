import React, { useState } from 'react';
import { isUserAuthenticated } from "../../AuthContext";
import { Navigate, useNavigate } from 'react-router-dom';
import './formModule.css';
import { FaMoneyBillWave, FaMapMarkerAlt, FaSearch, FaLocationArrow } from 'react-icons/fa';

const TripForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        destination: '',
        budgetRange: '500-1000'
    });

    const [searchQuery, setSearchQuery] = useState(''); // ✅ nowe pole
    const [isLocating, setIsLocating] = useState(false);

    const popularCities = [
        "New York", "London", "Paris", "Tokyo", "Dubai",
        "Barcelona", "Rome", "Sydney", "Berlin", "Amsterdam",
        "Prague", "Vienna", "Lisbon", "Madrid", "Singapore",
        "Bangkok", "Istanbul", "Miami", "Los Angeles", "Chicago",
        "Warsaw", "Kraków", "Gdańsk", "Wrocław", "Poznań"
    ];

    const budgetRanges = [
        { value: '0-500', label: '$0 - $500' },
        { value: '500-1000', label: '$500 - $1000' },
        { value: '1000-2000', label: '$1000 - $2000' },
        { value: '2000-5000', label: '$2000 - $5000' },
        { value: '5000+', label: '$5000+' }
    ];

    const filteredCities = popularCities.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value); // ✅ tylko searchQuery się zmienia
        setFormData(prev => ({
            ...prev,
            destination: ''
        }));
    };

    const handleCitySelect = (city: string) => {
        setFormData(prev => ({
            ...prev,
            destination: city
        }));
        setSearchQuery(city); // ✅ ustawiamy to samo, żeby dropdown się schował
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const currentLocation = `${latitude},${longitude}`;
                setFormData(prev => ({
                    ...prev,
                    destination: currentLocation
                }));
                setSearchQuery(currentLocation); // ✅ też ustawiamy
                setIsLocating(false);
            },
            (error) => {
                alert("Unable to retrieve your location.");
                setIsLocating(false);
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.destination) {
            alert("Please select a destination or use your current location");
            return;
        }

        console.log('Trip data submitted:', formData);
        navigate('/swiper', { state: { tripData: formData } });
    };

    if (!isUserAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="trip-form-container">
            <header className="form-header">
                <h1>Plan Your Next Trip</h1>
                <p>Select destination and budget range</p>
            </header>

            <form onSubmit={handleSubmit} className="trip-form">
                {/* Destination Section */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="destination">
                            <FaMapMarkerAlt className="input-icon" /> Destination
                        </label>
                        <div className="city-search-container">
                            <div className="search-input-wrapper">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    value={searchQuery} // ✅ sterowanie tylko przez searchQuery
                                    onChange={handleCityInputChange}
                                    placeholder="Search for a city..."
                                    className="city-search-input"
                                />
                                <button
                                    type="button"
                                    className="btn btn-location"
                                    onClick={handleUseCurrentLocation}
                                    disabled={isLocating}
                                >
                                    <FaLocationArrow />
                                    {isLocating ? "Locating..." : "Use Current Location"}
                                </button>
                            </div>
                            {/* ✅ Dropdown tylko jeśli coś wpisane i nie wybrano jeszcze */}
                            {searchQuery && searchQuery !== formData.destination && filteredCities.length > 0 && (
                                <ul className="city-dropdown">
                                    {filteredCities.map(city => (
                                        <li 
                                            key={city} 
                                            onClick={() => handleCitySelect(city)}
                                            className={formData.destination === city ? 'selected' : ''}
                                        >
                                            {city}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </section>

                {/* Budget Section */}
                <section className="form-section">
                    <div className="form-group">
                        <label htmlFor="budgetRange">
                            <FaMoneyBillWave className="input-icon" /> Budget Range
                        </label>
                        <select
                            id="budgetRange"
                            name="budgetRange"
                            value={formData.budgetRange}
                            onChange={handleChange}
                            required
                        >
                            {budgetRanges.map((range) => (
                                <option key={range.value} value={range.value}>
                                    {range.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Form Actions */}
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Back
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TripForm;
