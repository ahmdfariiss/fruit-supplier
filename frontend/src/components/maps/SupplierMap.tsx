'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with Next.js
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

interface SupplierMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function SupplierMap({
  center = [-6.2748, 106.8672],
  zoom = 15,
  className = '',
}: SupplierMapProps) {
  return (
    <div
      className={`rounded-3xl overflow-hidden border border-faint ${className}`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={icon}>
          <Popup>
            <div className="text-center">
              <strong>BuahKita HQ</strong>
              <br />
              Jl. H. Taiman Ujung No.67
              <br />
              Kramatjati, Jakarta Timur
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
