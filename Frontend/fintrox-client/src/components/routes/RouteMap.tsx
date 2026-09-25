import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Route } from '../../api/routeApi';

interface RouteMapProps {
  route: Route | null;
}

const defaultCenter: [number, number] = [12.9716, 77.5946];

const MapController: React.FC<{
  center: [number, number];
  zoom?: number;
}> = ({ center, zoom = 13 }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const RouteMap: React.FC<RouteMapProps> = ({ route }) => {
  const [coordinates, setCoordinates] =
    useState<[number, number]>(defaultCenter);

  useEffect(() => {
    if (!route) {
      setCoordinates(defaultCenter);
      return;
    }

    const fetchCoordinates = async () => {
      const addressParts = [
        route.area,
        route.city,
        route.state,
        route.pincode,
      ].filter(Boolean);

      if (addressParts.length === 0) {
        setCoordinates(defaultCenter);
        return;
      }

      const query = encodeURIComponent(addressParts.join(', '));

      console.log('🔍 Geocoding address:', query);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );

        if (!response.ok) {
          throw new Error(`Geocoding failed: ${response.status}`);
        }

        const data = await response.json();

        console.log('📍 Geocoding result:', data);

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
            setCoordinates([lat, lon]);
          } else {
            setCoordinates(defaultCenter);
          }
        } else {
          setCoordinates(defaultCenter);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setCoordinates(defaultCenter);
      }
    };

    fetchCoordinates();
  }, [route]);

  const customIcon = L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div
        style="
          background-color: #2D6A4F;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "
      ></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div className="relative z-0 h-full w-full min-h-[500px] overflow-hidden">
      <MapContainer
        center={coordinates}
        zoom={13}
        className="relative z-0 h-full w-full min-h-[500px]"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={coordinates} />

        <Marker position={coordinates} icon={customIcon}>
          <Popup>
            <div>
              <p style={{ fontWeight: 'bold' }}>
                {route?.name || 'Route Location'}
              </p>

              {route?.area && (
                <p style={{ fontSize: '12px', color: '#666' }}>
                  {route.area}
                </p>
              )}

              {route?.city && (
                <p style={{ fontSize: '12px', color: '#666' }}>
                  {route.city}, {route.state}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default RouteMap;