import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Typography, Button, IconButton } from "@mui/material";
import DirectionsIcon from '@mui/icons-material/Directions';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const createQuestionIcon = () => new L.DivIcon({
    html: '<div style="font-size: 24px; color: #1976d2;">❓</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
});

const createRouteIcon = () => new L.DivIcon({
    html: '<div style="font-size: 24px; color: #4CAF50;">📍</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
});

const exampleLocations = [
    { id: 1, name: "Budynek A", latitude: 50.0645, longitude: 19.9234, description: "A-0" },
    { id: 2, name: "Budynek B", latitude: 50.066, longitude: 19.922, description: "B-2" },
    { id: 3, name: "Budynek C", latitude: 50.0632, longitude: 19.927, description: "C-3" },
];

const ChangeMapCenter = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 16);
        }
    }, [center, map]);
    return null;
};

const LocationMarker = ({ location, isRouteEndpoint, onClick }) => {
    return (
        <Marker
            position={[location.latitude, location.longitude]}
            icon={isRouteEndpoint ? createRouteIcon() : createQuestionIcon()}
            eventHandlers={{ click: () => onClick(location) }}
        >
            <Popup>
                <Typography variant="subtitle1">{location.name}</Typography>
                <Typography variant="body2">{location.description}</Typography>
                {isRouteEndpoint && <Typography variant="caption">Route endpoint</Typography>}
            </Popup>
        </Marker>
    );
};

export default function MapWithRouting() {
    const [locations] = useState(exampleLocations);
    const [mapCenter, setMapCenter] = useState(null);
    const [route, setRoute] = useState(null);
    const [routeEndpoints, setRouteEndpoints] = useState([]);
    const mapRef = useRef(null);

    const fetchRoute = async (start, end) => {
        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                setRoute(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
                setRouteEndpoints([start, end]);
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    const handleLocationClick = (location) => {
        if (routeEndpoints.length === 0) {
            setRouteEndpoints([location]);
        } else if (routeEndpoints.length === 1) {
            fetchRoute(routeEndpoints[0], location);
        } else {
            setRouteEndpoints([location]);
            setRoute(null);
        }
    };

    const clearRoute = () => {
        setRoute(null);
        setRouteEndpoints([]);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <Typography variant="h6">Click two locations to find the shortest path</Typography>
                {route && (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={clearRoute}
                    >
                        Clear Route
                    </Button>
                )}
            </Box>

            <MapContainer
                center={[50.0645, 19.9234]}
                zoom={13}
                scrollWheelZoom={true}
                style={{
                    height: '80vh',
                    width: '100%',
                    borderRadius: '10px',
                }}
                whenCreated={(map) => {
                    mapRef.current = map;
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {locations.map((loc) => (
                    <LocationMarker
                        key={loc.id}
                        location={loc}
                        isRouteEndpoint={routeEndpoints.some(ep => ep.id === loc.id)}
                        onClick={handleLocationClick}
                    />
                ))}

                {route && (
                    <Polyline
                        positions={route}
                        color="#1976d2"
                        weight={5}
                        opacity={0.7}
                    />
                )}

                {mapCenter && <ChangeMapCenter center={mapCenter} />}
            </MapContainer>
        </Box>
    );
}