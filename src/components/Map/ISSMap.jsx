import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Custom ISS Icon (using a simple emoji or SVG for simplicity, but we can customize it)
const issIcon = L.divIcon({
  className: 'custom-iss-icon',
  html: `<div class="text-2xl bg-white rounded-full shadow-lg p-1 animate-pulse border-2 border-blue-500 flex items-center justify-center">🚀</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

// Component to recenter map when ISS moves
const MapRecenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom(), { animate: true });
    }
  }, [position, map]);
  return null;
};

export default function ISSMap({ currentPosition, history, locationName }) {
  if (!currentPosition) return <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl">Loading map...</div>;

  const polylinePositions = history.map(pos => [pos.lat, pos.lng]);

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-inner relative z-0">
      <MapContainer 
        center={[currentPosition.lat, currentPosition.lng]} 
        zoom={4} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter position={currentPosition} />
        
        {history.length > 1 && (
          <Polyline pathOptions={{ color: 'red', weight: 2, dashArray: '5, 5' }} positions={polylinePositions} />
        )}

        <Marker position={[currentPosition.lat, currentPosition.lng]} icon={issIcon}>
          <Popup>
            <div className="text-sm font-semibold">
              <p>ISS Current Position</p>
              <p className="text-slate-500 font-normal">{currentPosition.lat.toFixed(3)}, {currentPosition.lng.toFixed(3)}</p>
              <p className="text-slate-500 font-normal mt-1">{locationName}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
