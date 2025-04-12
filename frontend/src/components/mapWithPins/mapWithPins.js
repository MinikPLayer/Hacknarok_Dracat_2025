import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Typography, TextField, Autocomplete, Alert } from "@mui/material";

// Custom ❓ icon
const questionIcon = new L.DivIcon({
    html: '<div style="font-size: 24px;">❓</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
});

// Example locations
const exampleLocations = [
    { id: 1, name: "Budynek A", latitude: 50.0645, longitude: 19.9234, description: "A-0" },
    { id: 2, name: "Budynek B", latitude: 50.066, longitude: 19.922, description: "B-2" },
    { id: 3, name: "Budynek C", latitude: 50.0632, longitude: 19.927, description: "C-3" },
];

const ChangeMapCenter = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon], 16);
    }, [lat, lon, map]);
    return null;
};

export default function MapWithPins() {
    const [locations, setLocations] = useState(exampleLocations);
    const [query, setQuery] = useState("");
    const [mapCenter, setMapCenter] = useState(null);
    const [error, setError] = useState("");
    const markerRef = useRef(null);

    return (
        <Box sx={{ padding: 4 }}>
            <MapContainer
                center={[50.0645, 19.9234]} // Coordinates for the center of the map
                zoom={13} // Zoom level
                scrollWheelZoom={true} // Enable scroll wheel zoom
                style={{
                    height: '100vh',
                    width: '100%',
                    marginTop: '20px',
                    borderRadius: '10px',
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[loc.latitude, loc.longitude]}
                        icon={questionIcon}
                        ref={markerRef}
                    >
                        <Popup>
                            <Typography variant="subtitle1">{loc.name}</Typography>
                            <Typography variant="body2">{loc.description}</Typography>
                        </Popup>
                    </Marker>
                ))}

                {mapCenter && <ChangeMapCenter lat={mapCenter.lat} lon={mapCenter.lon} />}
            </MapContainer>
        </Box>
    );
}
