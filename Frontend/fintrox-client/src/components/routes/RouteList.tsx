import React from 'react';
import { type Route } from '../../api/routeApi';

interface RouteListProps {
  routes: Route[];
  selectedRoute: Route | null;
  onSelectRoute: (route: Route) => void;
  loading?: boolean;
}

const RouteList: React.FC<RouteListProps> = ({
  routes,
  selectedRoute,
  onSelectRoute,
  loading = false,
}) => {
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
        Active
      </span>
    ) : (
      <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
        Inactive
      </span>
    );
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-slate-200 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {routes.map((route) => (
        <div
          key={route.id}
          className={`p-4 rounded-xl border cursor-pointer space-y-2 transition-all ${selectedRoute?.id === route.id
              ? 'border-primary bg-primary-surface/20'
              : 'border-slate-200 hover:bg-slate-50'
            }`}
          onClick={() => onSelectRoute(route)}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900 text-sm">{route.name}</span>
            {getStatusBadge(route.isActive)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              {route.assignedEmployeeName ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-primary font-bold text-[10px] flex items-center justify-center">
                    {getInitials(route.assignedEmployeeName)}
                  </div>
                  <span>{route.assignedEmployeeName}</span>
                </>
              ) : (
                <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Unassigned</span>
              )}
            </div>
            <span>{route.customerCount || 0} customers</span>
          </div>
        </div>
      ))}
      {routes.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No routes found</p>
          <p className="text-xs">Create a new route to get started</p>
        </div>
      )}
    </div>
  );
};

export default RouteList;