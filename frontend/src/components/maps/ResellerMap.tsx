'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

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

function FitBounds({ locations, center, zoom }: { locations: ResellerLocation[]; center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    } else {
      map.setView(center, zoom);
    }
  }, [map, locations, center, zoom]);

  return null;
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
        <FitBounds locations={locations} center={center} zoom={zoom} />
        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={icon}>
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
