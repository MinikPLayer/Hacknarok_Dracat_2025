import React, { useState, useEffect, useRef, useCallback, FC } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression, Map as LeafletMap, Icon } from 'leaflet';
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import { FaPlus, FaMinus, FaTimes, FaShareAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './mapWithPins.css';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationData extends Coordinates {
  id: number;
  name: string;
  description: string;
}

interface RouteSegment {
  coordinates: LatLngExpression[];
  distance: number;
  duration: number;
}

interface OSRMTripResponse {
  code: string;
  trips: Array<{
    geometry: { coordinates: number[][] };
    distance: number;
    duration: number;
  }>;
  waypoints: any[];
}

const createRouteIcon = (): Icon =>
  new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const ChangeMapCenter: FC<{ center: LatLngExpression }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const LocationMarker: FC<{
  location: LocationData | Coordinates & { name?: string };
  type: 'user' | 'route';
  onClick?: (location: Coordinates) => void;
}> = ({ location, type, onClick }) => {
  const position: LatLngExpression = [location.latitude, location.longitude];

  return (
    <Marker
      position={position}
      icon={createRouteIcon()}
      eventHandlers={{ click: () => onClick?.(location) }}
      keyboard={true}
      aria-label={type === 'user' ? 'Twoja lokalizacja' : location.name || 'Punkt na mapie'}
    >
      <Popup>
        <Typography variant="subtitle1">{location.name || (type === 'user' ? 'Twoja lokalizacja' : 'Punkt')}</Typography>
        {'description' in location && location.description && (
          <Typography variant="body2">{location.description}</Typography>
        )}
        {type === 'route' && (
          <Button
            size="small"
            variant="contained"
            onClick={() => onClick?.(location)}
            sx={{ mt: 1 }}
            aria-label={`Nawiguj do ${location.name || 'punktu'}`}
          >
            Nawiguj
          </Button>
        )}
      </Popup>
    </Marker>
  );
};

const MapWithRouting: FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<LeafletMap | null>(null);
  const [locations] = useState<LocationData[]>([
    { id: 1, name: 'Budynek A', latitude: 50.0645, longitude: 19.9234, description: 'A-0' },
    { id: 2, name: 'Budynek B', latitude: 50.066, longitude: 19.922, description: 'B-2' },
    { id: 3, name: 'Budynek C', latitude: 50.0632, longitude: 19.927, description: 'C-3' },
  ]);
  const [userLocation, setUserLocation] = useState<Coordinates>({ latitude: 50.0745, longitude: 19.9234 });
  const [routes, setRoutes] = useState<RouteSegment[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          console.warn('Geolocation unavailable, using default location');
        }
      );
    }
  }, []);

  // Debounced route fetch
  const fetchRoute = useCallback(
    async (points: Coordinates[]): Promise<RouteSegment | null> => {
      if (points.length < 2) {
        setError('Wybierz co najmniej dwa punkty.');
        return null;
      }

      // Avoid duplicate coordinates
      const uniquePoints = points.filter(
        (p, i, arr) =>
          i === 0 ||
          arr.findIndex((q) => q.latitude === p.latitude && q.longitude === p.longitude) === i
      );
      if (uniquePoints.length < 2) {
        setError('Punkty są zbyt blisko siebie.');
        return null;
      }

      setIsLoading(true);
      setError('');
      try {
        const coordinatesString = uniquePoints.map((p) => `${p.longitude},${p.latitude}`).join(';');
        const url = `https://router.project-osrm.org/trip/v1/driving/${coordinatesString}?overview=full&geometries=geojson&source=first&destination=last`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Błąd HTTP ${res.status}`);
        const data: OSRMTripResponse = await res.json();

        if (data.trips?.length) {
          const coords = data.trips[0].geometry.coordinates.map(([lng, lat]): LatLngExpression => [lat, lng]);
          return {
            coordinates: coords,
            distance: data.trips[0].distance / 1000, // Convert to km
            duration: data.trips[0].duration / 60, // Convert to minutes
          };
        }
        throw new Error('Brak trasy');
      } catch (err) {
        setError('Nie udało się wyznaczyć trasy. Spróbuj ponownie.');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleLocationClick = useCallback(
    async (location: Coordinates) => {
      const route = await fetchRoute([userLocation, location]);
      if (route) setRoutes([route]);
    },
    [fetchRoute, userLocation]
  );

  const handleRouteAll = useCallback(async () => {
    const route = await fetchRoute([userLocation, ...locations]);
    if (route) setRoutes([route]);
  }, [fetchRoute, userLocation, locations]);

  const clearRoutes = () => {
    setRoutes(null);
    setError('');
  };

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();

  const shareRoute = () => {
    setShareDialogOpen(true);
  };

  const shareToSocial = (platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Sprawdź moją trasę na kampusie!');
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(window.location.href).then(() => alert('Link skopiowany! Wklej go w Instagramie.'));
        return;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    window.open(shareUrl, '_blank');
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, bgcolor: 'var(--background-color)' }} role="region" aria-label="Mapa kampusu">
      <motion.div
        className="map-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="map-header">
          <div>
            <Typography className="map-title">Mapa Kampusu</Typography>
            <Typography className="map-subtitle">Znajdź budynki i wyznacz trasę</Typography>
          </div>
          <div className="map-controls">
            <Button
              className="map-button"
              variant="contained"
              onClick={handleRouteAll}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
              aria-label="Wyznacz trasę do wszystkich budynków"
            >
              {isLoading ? 'Obliczanie...' : 'Trasa do wszystkich'}
            </Button>
            {routes && (
              <Button
                className="map-button"
                variant="outlined"
                onClick={clearRoutes}
                aria-label="Wyczyść trasę"
              >
                Wyczyść trasę
              </Button>
            )}
            <Button
              className="map-button"
              variant="contained"
              onClick={shareRoute}
              startIcon={<FaShareAlt />}
              aria-label="Udostępnij trasę"
            >
              Udostępnij
            </Button>
            <Button
              className="map-button"
              variant="contained"
              onClick={() => navigate('/worlds')}
              aria-label="Zakończ trasę i wróć"
            >
              Zakończ
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <FaTimes /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <LocationMarker location={{ ...userLocation, name: 'Twoja lokalizacja' }} type="user" />
          {locations.map((loc) => (
            <LocationMarker key={loc.id} location={loc} type="route" onClick={handleLocationClick} />
          ))}
          {routes?.map((route, i) => (
            <Polyline
              key={`route-${i}`}
              positions={route.coordinates}
              pathOptions={{ color: i === 0 ? '#1e90ff' : '#60a5fa', weight: 5 }}
            />
          ))}
          {routes?.[0] && (
            <ChangeMapCenter
              center={routes[0].coordinates[Math.floor(routes[0].coordinates.length / 2)]}
            />
          )}
        </MapContainer>

        <div className="zoom-controls">
          <IconButton className="zoom-button" onClick={zoomIn} aria-label="Powiększ mapę">
            <FaPlus />
          </IconButton>
          <IconButton className="zoom-button" onClick={zoomOut} aria-label="Pomniejsz mapę">
            <FaMinus />
          </IconButton>
        </div>

        {routes?.[0] && (
          <motion.div
            className="route-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="subtitle1">Szczegóły trasy</Typography>
            <Typography variant="body2">
              Dystans: {routes[0].distance.toFixed(2)} km
            </Typography>
            <Typography variant="body2">
              Czas: {Math.round(routes[0].duration)} minut
            </Typography>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {shareDialogOpen && (
          <motion.div
            className="share-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="share-dialog-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Udostępnij trasę
              </Typography>
              <div className="share-buttons">
                <IconButton onClick={() => shareToSocial('facebook')} aria-label="Udostępnij na Facebooku">
                  <FaFacebook color="#1877f2" size={24} />
                </IconButton>
                <IconButton onClick={() => shareToSocial('twitter')} aria-label="Udostępnij na Twitterze">
                  <FaTwitter color="#1da1f2" size={24} />
                </IconButton>
                <IconButton onClick={() => shareToSocial('instagram')} aria-label="Udostępnij na Instagramie">
                  <FaInstagram color="#e1306c" size={24} />
                </IconButton>
                <IconButton onClick={() => shareToSocial('linkedin')} aria-label="Udostępnij na LinkedIn">
                  <FaLinkedin color="#0a66c2" size={24} />
                </IconButton>
              </div>
              <Button
                className="map-button"
                variant="contained"
                onClick={() => setShareDialogOpen(false)}
                fullWidth
                aria-label="Zamknij okno udostępniania"
              >
                Zamknij
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default MapWithRouting;