'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ResellerLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
}

interface ResellerMapProps {
  locations: ResellerLocation[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function ResellerMap({
  locations,
  center = [-6.2, 106.816],
  zoom = 10,
  className = '',
}: ResellerMapProps) {
  return (
    <div
      className={`rounded-3xl overflow-hidden border border-faint ${className}`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={icon}
          >
            <Popup>
              <div>
                <strong>{loc.name}</strong>
                <br />
                <span className="text-xs">{loc.address}</span>
                {loc.phone && (
                  <>
                    <br />
                    <span className="text-xs">📞 {loc.phone}</span>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
