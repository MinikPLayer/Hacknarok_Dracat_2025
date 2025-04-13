import React, { useState, useEffect, useRef, FC } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression, Map as LeafletMap, DivIcon, Icon } from 'leaflet';
import { Box, Typography, Button } from "@mui/material";
import { Feature, LineString, Point } from 'geojson'; // For OSRM response typing
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { NavigateFunction, useNavigate } from "react-router-dom";

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface LocationData extends Coordinates {
    id: number;
    name: string;
    description: string;
}

type MarkerType = 'route' | 'user' | 'default';

type RouteSegment = LatLngExpression[];

interface OSRMRoute {
    geometry: LineString;
    legs: any[];
    distance: number;
    duration: number;
}

interface OSRMRouteResponse {
    code: string;
    routes: OSRMRoute[];
    waypoints: any[];
}

interface OSMGeometry {
    coordinates: number[][];
    type: string;
}

interface OSMStep {
    distance: number;
    driving_side: string;
    duration: number;
    geometry: OSMGeometry;
}

interface OSRMLeg {
    steps: OSMStep[];
    summary: string;
    weight: number;
    duration: number;
    distance: number;
}

interface OSRMTrip {
    geometry: LineString;
    legs: OSRMLeg[];
    distance: number;
    duration: number;
    weight_name: string;
    weight: number;
}

interface OSRMTripResponse {
    code: string;
    trips: OSRMTrip[];
    waypoints: any[];
}

const createQuestionIcon = (): DivIcon => new L.DivIcon({
    html: '<div style="font-size: 24px; color: #1976d2;">❓</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
});

const createRouteIcon = (): Icon => new L.Icon({
    iconUrl: iconUrl,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const createUserIcon = (): DivIcon => new L.DivIcon({
    html: '<div style="font-size: 24px; color: #FF5722;">👤</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
});


interface ChangeMapCenterProps {
    center: LatLngExpression | null;
}


const ChangeMapCenter: FC<ChangeMapCenterProps> = ({ center }) => {
    const navigate = useNavigate();
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const getLocationMarkerIcon = (type: MarkerType): DivIcon | Icon => {
    switch (type) {
        case 'route':
            return createRouteIcon();
        case 'user':
            return createUserIcon();
        default:
            return createQuestionIcon();
    }
}

interface LocationMarkerProps {
    location: Coordinates & { name?: string; description?: string };
    type: MarkerType;
    onClick?: (location: Coordinates) => void;
}

// ... importy i ikony takie jak wcześniej (bez zmian)

const exampleLocations: LocationData[] = [
    { id: 1, name: "Budynek A", latitude: 50.0645, longitude: 19.9234, description: "A-0" },
    { id: 2, name: "Budynek B", latitude: 50.066, longitude: 19.922, description: "B-2" },
    { id: 3, name: "Budynek C", latitude: 50.0632, longitude: 19.927, description: "C-3" },
];

const userLocation: Coordinates = { latitude: 50.0745, longitude: 19.9234 };

const LocationMarker: FC<LocationMarkerProps> = ({ location, type, onClick }) => {
    const position: LatLngExpression = [location.latitude, location.longitude];

    const handleClick = () => {
        if (onClick) {
            onClick(location);
        }
    };

    return (
        <Marker
            position={position}
            icon={getLocationMarkerIcon(type)}
            eventHandlers={{ click: handleClick }}
        >
            {(location.name || location.description || type === 'route') && (
                <Popup>
                    {location.name && <Typography variant="subtitle1">{location.name}</Typography>}
                    {location.description && <Typography variant="body2">{location.description}</Typography>}
                    {type === "route" && (
                        <>
                            <Typography variant="caption">Punkt trasy</Typography>
                            <Button
                                size="small"
                                onClick={handleClick}
                                sx={{ mt: 1 }}
                                variant="contained"
                            >
                                Prowadź tutaj
                            </Button>
                        </>
                    )}
                </Popup>
            )}
        </Marker>
    );
};

const MapWithRouting: FC = () => {
    const [addRouteAllBlocked, setAddRouteAllBlocked] = useState(false);
    const [locations] = useState<LocationData[]>(exampleLocations);
    const [mapCenter] = useState<LatLngExpression | null>(null);
    const [fullRoutes, setFullRoutes] = useState<RouteSegment[] | null>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const navigate = useNavigate();

    const clearAllRoutes = (): void => {
        setFullRoutes(null);
    };

    const fetchRouteSequenceData = async (points: Coordinates[]): Promise<void> => {
        if (points.length < 2) return;

        const coordinatesString = points.map(p => `${p.longitude},${p.latitude}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data: OSRMRouteResponse = await res.json();

            if (data.routes && data.routes.length > 0) {
                const coords = data.routes[0].geometry.coordinates.map(
                    ([lng, lat]): LatLngExpression => [lat, lng]
                );
                setFullRoutes([coords]);

                if (mapRef.current) {
                    const bounds = L.latLngBounds(coords);
                    mapRef.current.fitBounds(bounds);
                }
            } else {
                setFullRoutes(null);
            }
        } catch (err) {
            console.error("Route error:", err);
            setFullRoutes(null);
        }
    };

    const handleLocationClick = async (location: Coordinates) => {
        await fetchRouteSequenceData([userLocation, location]);
    };

    const addRouteAllHandler = async () => {
        setAddRouteAllBlocked(true);
        await fetchRouteSequenceData([userLocation, ...locations]);
        setTimeout(() => setAddRouteAllBlocked(false), 1000);
    };

    const indexToColor = (index: number): string => {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
        const alpha = index === 0 ? 1.0 : index === 1 ? 0.6 : 0.4;
        const alphaHex = Math.floor(alpha * 255).toString(16).padStart(2, '0');
        return `${colors[index % colors.length]}${alphaHex}`;
    };

    return (
        <Box sx={{ padding: { xs: 1, sm: 2, md: 4 } }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="h6">Campus Map & Routing</Typography>
                {fullRoutes && (
                    <Button variant="outlined" color="secondary" size="small" onClick={clearAllRoutes}>
                        Clear All Routes
                    </Button>
                )}
                <Button
                    disabled={addRouteAllBlocked}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={addRouteAllHandler}
                >
                    {addRouteAllBlocked ? "Calculating..." : "Route To All Buildings"}
                </Button>
            </Box>

            <MapContainer
                center={[50.0645, 19.9234]}
                zoom={15}
                scrollWheelZoom={true}
                style={{
                    height: '75vh',
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid #ccc'
                }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <LocationMarker
                    location={{ ...userLocation, name: "Your Location" }}
                    type="user"
                    onClick={() => {}}
                />

                {locations.map(loc => (
                    <LocationMarker
                        key={loc.id}
                        location={loc}
                        type="route"
                        onClick={handleLocationClick}
                    />
                ))}

                {fullRoutes?.map((segment, i) =>
                    segment.length > 0 && (
                        <Polyline
                            key={`route-${i}`}
                            positions={segment}
                            pathOptions={{
                                color: indexToColor(i),
                                weight: 5
                            }}
                        />
                    )
                )}

                {mapCenter && <ChangeMapCenter center={mapCenter} />}
            </MapContainer>

            <Button variant="contained" onClick={() => navigate("/worlds")}>
                Zakończ trasę
            </Button>
        </Box>
    );
};

export default MapWithRouting;
