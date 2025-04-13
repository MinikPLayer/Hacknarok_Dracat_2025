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

const exampleLocations: LocationData[] = [
    { id: 1, name: "Budynek A", latitude: 50.0645, longitude: 19.9234, description: "A-0" },
    { id: 2, name: "Budynek B", latitude: 50.066, longitude: 19.922, description: "B-2" },
    { id: 3, name: "Budynek C", latitude: 50.0632, longitude: 19.927, description: "C-3" },
];

const userLocation: Coordinates = { latitude: 50.0745, longitude: 19.9234 };

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
            {(location.name || location.description) && (
                <Popup>
                    {location.name && <Typography variant="subtitle1">{location.name}</Typography>}
                    {location.description && <Typography variant="body2">{location.description}</Typography>}
                    {type === "route" && (
                        <>
                            <Typography variant="caption">Route endpoint</Typography>
                            <Button
                                size="small"
                                onClick={() => onClick?.(location)}
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
    const [addRouteAllBlocked, setAddRouteAllBlocked] = useState<boolean>(false);
    const [locations] = useState<LocationData[]>(exampleLocations);
    const [mapCenter] = useState<LatLngExpression | null>(null);
    const [fullRoutes, setFullRoutes] = useState<RouteSegment[] | null>(null);
    const mapRef = useRef<LeafletMap | null>(null);
    const navigate = useNavigate();

    const handleLocationClick = async (location: Coordinates): Promise<void> => {
        console.log("Generating route to:", location);
        const singleLocation = [location];
        await fetchTripData(singleLocation);
    };

    const clearAllRoutes = (): void => {
        setFullRoutes(null);
    }

    const fetchTripData = async (points: Coordinates[]): Promise<void> => {
        if (points.length === 0) {
            setFullRoutes(null);
            return;
        }

        const allPoints = [userLocation, ...points];
        const coordinatesString = allPoints
            .map(point => `${point.longitude},${point.latitude}`)
            .join(';');

        const url = `https://router.project-osrm.org/trip/v1/driving/${coordinatesString}?overview=full&geometries=geojson&steps=true&annotations=true&source=first&destination=last`;

        try {
            const tripResponse = await fetch(url);
            if (!tripResponse.ok) throw new Error(`HTTP error! status: ${tripResponse.status}`);
            const tripData: OSRMTripResponse = await tripResponse.json();

            if (tripData.trips && tripData.trips.length > 0) {
                const routes: RouteSegment[] = [];
                tripData.trips[0].legs.forEach(leg => {
                    var newRoute = leg.steps.map((step: OSMStep) => {
                        return step.geometry.coordinates.map(
                            (coord): LatLngExpression => [coord[1], coord[0]]
                        );
                    });
                    const flatRoute = newRoute.flat();
                    routes.push(flatRoute);
                });

                setFullRoutes(routes.slice(0, points.length));

                if (mapRef.current && routes.length > 0) {
                    const allCoords = routes.flat();
                    if (allCoords.length > 0) {
                        const bounds = L.latLngBounds(allCoords);
                        mapRef.current.fitBounds(bounds);
                    }
                }

            } else {
                setFullRoutes(null);
            }
        } catch (error) {
            console.error("Error fetching trip data:", error);
            setFullRoutes(null);
        }
    };

    const addRouteAllHandler = (): void => {
        setAddRouteAllBlocked(true);
        fetchTripData(locations)
            .finally(() => {
                setTimeout(() => {
                    setAddRouteAllBlocked(false);
                }, 1000);
            });
    };

    const indexToColor = (index: number): string => {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
        const alpha = index === 0 ? 1.0 : index === 1 ? 0.6 : 0.4;
        const alphaHex = Math.floor(alpha * 255).toString(16).padStart(2, '0');
        const color = colors[index % colors.length];
        return `${color}${alphaHex}`;
    };

    return (
        <Box sx={{ padding: { xs: 1, sm: 2, md: 4 } }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="h6" component="h2">
                    Campus Map & Routing
                </Typography>
                {fullRoutes && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={clearAllRoutes}
                    >
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
                    onClick={() => console.log("User marker clicked")}
                />

                {locations.map((loc) => (
                    <LocationMarker
                        key={loc.id}
                        location={loc}
                        type="route"
                        onClick={handleLocationClick}
                    />
                ))}

                {fullRoutes?.map((routeSegment, index) => (
                    routeSegment && routeSegment.length > 0 && (
                        <Polyline
                            key={`route-${index}`}
                            positions={routeSegment}
                            pathOptions={{
                                color: indexToColor(index),
                                weight: 5,
                            }}
                        />
                    )
                ))}

                {mapCenter && <ChangeMapCenter center={mapCenter} />}
            </MapContainer>

            <Button
                variant="contained"
                onClick={() => navigate("/worlds")}
            >
                Zakończ trasę
            </Button>
        </Box>
    );
};

export default MapWithRouting;
