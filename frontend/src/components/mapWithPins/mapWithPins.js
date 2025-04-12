import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Typography, Button, IconButton } from "@mui/material";
import DirectionsIcon from '@mui/icons-material/Directions';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// let DefaultIcon = L.DivIcon({
//     html: '<div style="font-size: 24px; color: #1976d2;">❓</div>',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41]
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const createQuestionIcon = () => new L.DivIcon({
    html: '<div style="font-size: 24px; color: #1976d2;">❓</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
});

// const createRouteIcon = () => new L.DivIcon({
//     html: '<div style="font-size: 24px; color: #4CAF50;">📍</div>',
//     className: '',
//     iconSize: [24, 24],
//     iconAnchor: [12, 24],
//     popupAnchor: [0, -24],
// });

const createRouteIcon = () => new L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const createUserIcon = () => new L.DivIcon({
    html: '<div style="font-size: 24px; color: #FF5722;">👤</div>',
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

const getLocationMarkerIcon = (type) => {
    switch (type) {
        case 'route':
            return createRouteIcon();
        case 'user':
            return createUserIcon();
        default:
            return createQuestionIcon();
    }
}

const LocationMarker = ({ location, type, onClick }) => {
    return (
        <Marker
            position={[location.latitude, location.longitude]}
            icon={getLocationMarkerIcon(type)}
            eventHandlers={{ click: () => onClick(location) }}
        >
            <Popup>
                <Typography variant="subtitle1">{location.name}</Typography>
                <Typography variant="body2">{location.description}</Typography>
                {type === "route" && <Typography variant="caption">Route endpoint</Typography>}
            </Popup>
        </Marker>
    );
};

const userLocation = { latitude: 50.0745, longitude: 19.9234 };

export default function MapWithRouting() {
    const [addRouteAllBlocked, setAddRouteAllBlocked] = useState(false);

    const [locations] = useState(exampleLocations);

    const [mapCenter, setMapCenter] = useState(null);
    const [route, setRoute] = useState(null);
    const [routeEndpoints, setRouteEndpoints] = useState([]);
    const [fullRoutes, setFullRoutes] = useState(null);
    const mapRef = useRef(null);

    const fetchRouteBetweenTwoPoints = async (start, end) => {
        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            console.log(data);

            if (data.routes && data.routes.length > 0) {
                setRoute(data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]));
                setRouteEndpoints([start, end]);
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    const handleLocationClick = (location) => {
        console.log("Disabled!");
    };

    const clearRoute = () => {
        setRoute(null);
        setRouteEndpoints([]);
    };

    const fetchTripData = async (points) => {
        console.log("Fetching trip data for points:", points);

        const allPoints = [userLocation, ...points];
        const requestStr = allPoints.map(point => `${point.longitude},${point.latitude}`).join(';');
        const tripResponse = await fetch(
            `https://router.project-osrm.org/trip/v1/driving/${requestStr.slice(0, -1)}?overview=full&geometries=geojson&steps=true&annotations=true`
        );
        const tripData = await tripResponse.json();

        console.log(tripData);

        if (tripData.trips && tripData.trips.length > 0) {
            var routes = [];
            tripData.trips.forEach(trip => {
                trip.legs.forEach(leg => {
                    const geometryFlat = leg.steps.map(step => step.geometry.coordinates.map(coord => [coord[1], coord[0]])).flat();
                    const geometryPairs = [];
                    for (let i = 0; i < geometryFlat.length - 1; i++) {
                        geometryPairs.push([geometryFlat[i], geometryFlat[i + 1]]);
                    }

                    routes = [...routes, geometryPairs];
                });
            });

            // Skip last one, as it is the user location (back to start)
            setFullRoutes(routes.slice(0, -1));
            console.log("Fetched routes:", routes);
        }
    }

    const addRouteAllHanlder = () => {
        setAddRouteAllBlocked(true);
        fetchTripData(exampleLocations);
        setTimeout(() => {
            setAddRouteAllBlocked(false);
        }, 3000); // Reset after 3 seconds
    }

    const indexToColor = (index) => {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
        var alpha = 1.0;
        switch (index) {
            case 0:
                alpha = 1.0;
                break;
            case 1:
                alpha = 0.7;
                break;
            default:
                alpha = 0.5;
                break;
        }
        var retColor = colors[index % colors.length] + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        console.log(retColor);
        return retColor;
    }

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
                <Button
                    disabled={addRouteAllBlocked}
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={addRouteAllHanlder}
                >
                    Add route to all
                </Button>
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

                <LocationMarker
                    isRouteEndpoint={false}
                    location = {userLocation}
                    type = "user"
                />

                {locations.map((loc) => (
                    <LocationMarker
                        key={loc.id}
                        location={loc}
                        type="route"
                        onClick={handleLocationClick}
                    />
                ))}

                {
                    fullRoutes && fullRoutes.map((route, index) =>
                        <Polyline
                            key = {index}
                            positions={route}
                            color={indexToColor(index)}
                            weight={5}
                            opacity={0.7}
                        />
                    )
                }

                {mapCenter && <ChangeMapCenter center={mapCenter} />}
            </MapContainer>
        </Box>
    );
}