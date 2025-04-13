import React, { useState, useEffect } from 'react';
import { isUserAuthenticated } from "../../AuthContext";
import { Navigate, useNavigate } from 'react-router-dom';
import './formModule.css';
import { FaMoneyBillWave, FaMapMarkerAlt, FaSearch, FaLocationArrow } from 'react-icons/fa';
import {ToggleButton, ToggleButtonGroup, Typography, CircularProgress, Box, Button, Slider} from '@mui/material';

type TripMode = 'plan' | 'adventure';
type BudgetRange = '0-500' | '500-1000' | '1000-2000' | '2000-5000' | '5000+';

interface FormData {
  destination: string;
  budgetRange: BudgetRange;
  cityName?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const TripForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    budgetRange: '500-1000'
  });


  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [tripMode, setTripMode] = useState<TripMode>('plan');
  const [isLoadingCities, setIsLoadingCities] = useState(false);

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

    const km_ranges = [
    { value: '0', label: '+0km' },
    { value: '0-5', label: '+5km' },
    { value: '5-15', label: '+10km' },
    { value: '15-25', label: '+15km' },
    { value: '25-30', label: '+25km' },
    { value: '30-45', label: '+30km' }
  ];

  const filteredCities = popularCities.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFormData(prev => ({
      ...prev,
      destination: '',
      cityName: undefined
    }));
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({
      ...prev,
      destination: city,
      cityName: city,
      coordinates: undefined
    }));
    setSearchQuery(city);
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.address?.city || data.address?.town || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };


  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const cityName = await reverseGeocode(latitude, longitude);

      setFormData(prev => ({
        ...prev,
        destination: cityName,
        cityName: cityName,
        coordinates: {
          lat: latitude,
          lng: longitude
        }
      }));
      setSearchQuery(cityName);
    } catch (error) {
      alert("Unable to retrieve your location. Please try again or enter manually.");
      console.error("Geolocation error:", error);
    } finally {
      setIsLocating(false);
    }
  };

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: TripMode
  ) => {
    if (newMode !== null) {
      setTripMode(newMode);
      console.log(`${newMode === 'plan' ? 'Plan' : 'Adventure'} mode selected`);
    }
  };

  // @ts-ignore
  const handleBudgetChange = (event, newValue) => {
    setFormData({
      ...formData,
      budgetRange: newValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.destination) {
      alert("Please select a destination or use your current location");
      return;
    }

    const tripData = {
      ...formData,
      mode: tripMode
    };

    console.log('Trip data submitted:', tripData);
    navigate('/swiper', { state: { tripData } });
  };

  if (!isUserAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <Box className="trip-form-container" sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>

      <img height={300} src={"media/cat_seeker.png"}/>
      <header className="form-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nowa przygoda? Już za zakrętem!
        </Typography>
        <Typography variant="subtitle1">
          Wybierz wstępną lokalizację, zakres cenowy i typ swojej wędrówki, a my wyznaczymy Ci trasę!
        </Typography>
      </header>

      <form onSubmit={handleSubmit} className="trip-form">
        {/* Mode Selection */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            color="primary"
            value={tripMode}
            exclusive
            onChange={handleModeChange}
            aria-label="Trip mode"
          >
            <ToggleButton value="plan" sx={{ px: 4 }}>
              Zaplanowane
            </ToggleButton>
            <ToggleButton value="adventure" sx={{ px: 4 }}>
              Przygoda
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Destination Section */}
        <Box className="form-section" sx={{ mb: 3 }}>
          <Box className="form-group">
            <Typography variant="subtitle1" component="label" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <FaMapMarkerAlt style={{ marginRight: 8 }} /> Obszar początkowy
            </Typography>
            <Box className="city-search-container" sx={{ position: 'relative' }}>
              <Box className="search-input-wrapper" sx={{ display: 'flex', alignItems: 'center' }}>
                <FaSearch className="search-icon" style={{ position: 'absolute', left: 12 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleCityInputChange}
                  placeholder="Wyszukaj miasto..."
                  className="city-search-input"
                  style={{
                    padding: '12px 16px 12px 40px',
                    width: '100%',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '1rem'
                  }}
                />
                <select
                  id="budgetRange"
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={()=> {
                    // @ts-ignore
                    handleBudgetChange()
                  }}
                  required
                  style={{
                    width: '40%',
                    padding: '12px 16px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  {km_ranges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-location"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  style={{
                    marginLeft: '8px',
                    padding: '12px 16px',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isLocating ? (
                    <CircularProgress size={16} style={{ marginRight: 8 }} />
                  ) : (
                    <FaLocationArrow style={{ marginRight: 8 }} />
                  )}
                  {isLocating ? "Szukam..." : "Obecna lokacja"}
                </button>
              </Box>
              {searchQuery && searchQuery !== formData.destination && filteredCities.length > 0 && (
                <ul className="city-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  margin: 0,
                  padding: 0,
                  listStyle: 'none'
                }}>
                  {filteredCities.map(city => (
                    <li
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={formData.destination === city ? 'selected' : ''}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                        backgroundColor: formData.destination === city ? '#f5f5f5' : 'transparent',

                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </Box>
          </Box>
        </Box>


        {/* Budget Section */}
<Box className="form-section" sx={{ mb: 4 }}>
  <Box className="form-group">
    <Typography variant="subtitle1" component="label" gutterBottom sx={{ mb:4, display: 'flex', alignItems: 'center' }}>
      <FaMoneyBillWave style={{paddingRight: 8}} /> Zakres cenowy
    </Typography>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body1">0 zł</Typography>
      <Slider
        value={formData.budgetRange as unknown as [number, number] || [0, 1000]}
        onChange={handleBudgetChange}
        valueLabelDisplay="on"
        min={0}
        max={1000}
        step={50}
        sx={{
          width: '100%',
          color: 'primary.main',
          '& .MuiSlider-valueLabel': {
            backgroundColor: 'primary.main',
            borderRadius: 1,
            padding: '2px 4px',
            '&:before': {
              display: 'none'
            }
          }
        }}
      />
      <Typography variant="body1">1000 zł</Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Min: {formData.budgetRange?.[0] || 0} zł
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Max: {formData.budgetRange?.[1] || 1000} zł
      </Typography>
    </Box>
  </Box>
</Box>

        {/* Form Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant={"outlined"} onClick={() => navigate(-1)}>
            Wróć
          </Button>
          <Button variant={"contained"} type="submit">
            Planuj
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default TripForm;