import React, { useState, useEffect, useRef, FC } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression, Map as LeafletMap, DivIcon, Icon } from 'leaflet';
import { Box, Typography, Button } from "@mui/material";
import { Feature, LineString, Point } from 'geojson'; // For OSRM response typing

// Fix for default marker icons (ensure these paths are correct relative to your build output)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

// --- Interfaces and Types ---

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

type RouteSegment = LatLngExpression[]; // An array of [lat, lng] pairs for a polyline

// Simplified interfaces for OSRM responses (add more fields if needed)
interface OSRMRoute {
    geometry: LineString; // GeoJSON LineString
    legs: any[]; // Add more specific type if legs are used
    distance: number;
    duration: number;
}

interface OSRMRouteResponse {
    code: string;
    routes: OSRMRoute[];
    waypoints: any[]; // Add more specific type if waypoints are used
}

interface OSMGeometry {
    coordinates: number[][]; // Array of [lng, lat] pairs
    type: string; // Typically "LineString" for routes
}

interface OSMStep {
    distance: number;
    driving_side: string;
    duration: number;
    geometry: OSMGeometry; // GeoJSON LineString
}

interface OSRMLeg {
    steps: OSMStep[]; // Add more specific type if steps are used
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
    waypoints: any[]; // Add more specific type if waypoints are used
}


// --- Icon Creation ---

const createQuestionIcon = (): DivIcon => new L.DivIcon({
    html: '<div style="font-size: 24px; color: #1976d2;">❓</div>',
    className: '', // Avoid default Leaflet styles if needed
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

// --- Data ---

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
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom()); // Keep existing zoom or set a default like 16
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
        default: // or 'default'
            return createQuestionIcon();
    }
}

// --- Marker Component ---

interface LocationMarkerProps {
    location: Coordinates & { name?: string; description?: string }; // Allow optional name/desc
    type: MarkerType;
    onClick?: (location: Coordinates) => void; // Make onClick optional or required based on usage
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
            {(location.name || location.description) && ( // Only show popup if there's content
                <Popup>
                    {location.name && <Typography variant="subtitle1">{location.name}</Typography>}
                    {location.description && <Typography variant="body2">{location.description}</Typography>}
                    {type === "route" && <Typography variant="caption">Route endpoint</Typography>}
                </Popup>
            )}
        </Marker>
    );
};

// --- Main Map Component ---

const MapWithRouting: FC = () => {
    const [addRouteAllBlocked, setAddRouteAllBlocked] = useState<boolean>(false);
    const [locations] = useState<LocationData[]>(exampleLocations);
    const [mapCenter] = useState<LatLngExpression | null>(null);
    const [fullRoutes, setFullRoutes] = useState<RouteSegment[] | null>(null); // State for multi-stop trip routes
    const mapRef = useRef<LeafletMap | null>(null);

    // Example function for fetching route between two points (if needed separately)
    // const fetchRouteBetweenTwoPoints = async (start: Coordinates, end: Coordinates): Promise<void> => {
    //     try {
    //         const response = await fetch(
    //             `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
    //         );
    //         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    //         const data: OSRMRouteResponse = await response.json();

    //         console.log("OSRM Route Response:", data);

    //         if (data.routes && data.routes.length > 0 && data.routes[0].geometry) {
    //             // OSRM GeoJSON is [lng, lat], Leaflet Polyline needs [lat, lng]
    //             const coordinates = data.routes[0].geometry.coordinates.map(
    //                 (coord): LatLngExpression => [coord[1], coord[0]]
    //             );
    //             setRoute(coordinates);
    //             setRouteEndpoints([start, end]);
    //             // Optional: Center map on the new route
    //             if (mapRef.current && coordinates.length > 0) {
    //                const bounds = L.latLngBounds(coordinates);
    //                mapRef.current.fitBounds(bounds);
    //             }
    //         } else {
    //              console.warn("No route found between points.");
    //              setRoute(null);
    //              setRouteEndpoints([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching route:", error);
    //         setRoute(null);
    //         setRouteEndpoints([]);
    //     }
    // };

    const handleLocationClick = (location: Coordinates): void => {
        // Currently disabled in the original code, implement selection logic if needed
        console.log("Location clicked (currently no action):", location);
    };

    const clearAllRoutes = (): void => {
        setFullRoutes(null);
    }

    const fetchTripData = async (points: LocationData[]): Promise<void> => {
        console.log("Fetching trip data for points:", points);

        if (points.length === 0) {
            console.warn("No locations provided for trip planning.");
            setFullRoutes(null); // Clear existing routes if points are empty
            return;
        }


        const allPoints = [userLocation, ...points];
        const coordinatesString = allPoints
            .map(point => `${point.longitude},${point.latitude}`)
            .join(';');

        // Use overview=full for detailed geometry per leg if available, or simplify if needed
        const url = `https://router.project-osrm.org/trip/v1/driving/${coordinatesString}?overview=full&geometries=geojson&steps=true&annotations=true`;
        // Alternative if full overview causes issues or is too large: ?overview=simplified

        try {
            const tripResponse = await fetch(url);
            if (!tripResponse.ok) throw new Error(`HTTP error! status: ${tripResponse.status}`);
            const tripData: OSRMTripResponse = await tripResponse.json();

            console.log("OSRM Trip Response:", tripData);

            if (tripData.trips && tripData.trips.length > 0) {
                const routes: RouteSegment[] = [];
                tripData.trips[0].legs.forEach(leg => {
                    var newRoute = leg.steps.map((step: OSMStep) => {
                        // OSRM GeoJSON is [lng, lat], Leaflet Polyline needs [lat, lng]
                        return step.geometry.coordinates.map(
                            (coord): LatLngExpression => [coord[1], coord[0]]
                        );
                    });
                    // Flatten the array of arrays into a single array of coordinates
                    const flatRoute = newRoute.flat();
                    routes.push(flatRoute);
                });

                 // The OSRM trip API calculates legs between consecutive waypoints.
                 // If the request includes N waypoints (including start), it returns N legs.
                 // If the goal is Start -> P1 -> P2 -> P3, the legs are:
                 // Leg 0: Start -> P1
                 // Leg 1: P1 -> P2
                 // Leg 2: P2 -> P3
                 // Leg 3: P3 -> Start (or optimized endpoint)
                 // We typically want to display routes connecting the specified points, excluding the final return leg.
                setFullRoutes(routes.slice(0, points.length)); // Display routes between points, excluding final leg to start
                console.log("Fetched routes:", routes.slice(0, points.length));

                // Optional: Fit map bounds to the entire trip
                if (mapRef.current && routes.length > 0) {
                    const allCoords = routes.flat();
                    if(allCoords.length > 0) {
                        const bounds = L.latLngBounds(allCoords);
                        mapRef.current.fitBounds(bounds);
                    }
                }

            } else {
                 console.warn("No trips found in OSRM response.");
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
                // Ensure the button is unblocked even if fetch fails
                setTimeout(() => {
                    setAddRouteAllBlocked(false);
                }, 1000); // Shorter delay might be okay, 3s seemed long
            });
    };

    const indexToColor = (index: number): string => {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
        // More robust alpha mapping
        const alpha = index === 0 ? 1.0 : index === 1 ? 0.6 : 0.4; // Example: Decrease opacity
        const alphaHex = Math.floor(alpha * 255).toString(16).padStart(2, '0');
        const color = colors[index % colors.length];
        return `${color}${alphaHex}`; // Append alpha hex code (RGBA hex format)
    };

    return (
        <Box sx={{ padding: { xs: 1, sm: 2, md: 4 } }}> {/* Responsive padding */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="h6" component="h2"> {/* Use h2 for semantic structure */}
                   Campus Map & Routing
                </Typography>
                {fullRoutes && ( // Button to clear the multi-stop routes
                    <Button
                        variant="outlined"
                        color="secondary" // Use theme colors
                        size="small"
                        onClick={clearAllRoutes}
                    >
                        Clear All Routes
                    </Button>
                )}
                <Button
                    disabled={addRouteAllBlocked}
                    variant="contained" // Make primary action more prominent
                    color="primary"
                    size="small"
                    onClick={addRouteAllHandler}
                >
                    {addRouteAllBlocked ? "Calculating..." : "Route To All Buildings"}
                </Button>
            </Box>

            <MapContainer
                center={[50.0645, 19.9234]} // Initial center
                zoom={15} // Slightly more zoomed in initially?
                scrollWheelZoom={true}
                style={{
                    height: '75vh', // Adjust height as needed
                    width: '100%',
                    borderRadius: '8px', // Slightly softer corners
                    border: '1px solid #ccc' // Add a subtle border
                }}
                ref={mapRef} // Use ref with MapContainer directly
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* User's Location Marker */}
                <LocationMarker
                    location={{ ...userLocation, name: "Your Location" }} // Add name for popup
                    type="user"
                    // No onClick action needed for user marker, pass empty func or make prop optional
                    onClick={() => console.log("User marker clicked")}
                />

                {/* Markers for Example Locations */}
                {locations.map((loc) => (
                    <LocationMarker
                        key={loc.id}
                        location={loc}
                        type="route" // Use 'route' type for the building icons/popups
                        onClick={handleLocationClick} // Attach click handler for potential selection
                    />
                ))}

                {/* Display Calculated Multi-Stop Routes */}
                {fullRoutes?.map((routeSegment, index) => (
                     routeSegment && routeSegment.length > 0 && ( // Ensure segment is valid
                         <Polyline
                            key={`route-${index}`} // More descriptive key
                            positions={routeSegment}
                            pathOptions={{ // Use pathOptions for styling
                                color: indexToColor(index),
                                weight: 5,
                                // opacity is handled by alpha in indexToColor
                            }}
                        />
                     )
                ))}

                {/* Component to smoothly change map center if needed */}
                {mapCenter && <ChangeMapCenter center={mapCenter} />}
            </MapContainer>

            <Button variant={"contained"}> Zakończ trasę</Button>
        </Box>
    );
};

export default MapWithRouting;