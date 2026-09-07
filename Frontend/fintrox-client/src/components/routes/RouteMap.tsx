import React, { useEffect, useRef } from 'react';
import type { Route } from '../../api/routeApi';

interface RouteMapProps {
  route: Route | null;
}

const RouteMap: React.FC<RouteMapProps> = ({ route }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (route && mapRef.current) {
      // Map initialization would go here
      // Using Leaflet or Google Maps
      console.log('Map would render for route:', route.name);
    }
  }, [route]);

  return (
    <div className="flex-1 relative bg-slate-100">
      <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" id="leafletMap">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-slate-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <p className="text-sm font-medium">Map View</p>
            <p className="text-xs">Select a route to view its location</p>
            {route && (
              <div className="mt-4 text-left max-w-sm mx-auto">
                <p className="text-sm font-semibold">{route.name}</p>
                <p className="text-xs text-slate-500">{route.area}</p>
                <p className="text-xs text-slate-500">{route.city}, {route.state}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;