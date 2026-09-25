import React, { useState, useEffect } from 'react';
import type {
  Route,
  CreateRouteRequest,
} from '../../api/routeApi';
import type { Employee } from '../../api/employeeApi';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateRouteRequest) => void;
  route?: Route | null;
  employees: Employee[];
  loading: boolean;
}

const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  route,
  employees,
  loading,
}) => {
  const [formData, setFormData] =
    useState<CreateRouteRequest>({
      name: '',
      description: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      assignedEmployeeId: undefined,
    });

  useEffect(() => {
    if (route) {
      setFormData({
        name: route.name,
        description: route.description,
        area: route.area || '',
        city: route.city || '',
        state: route.state || '',
        pincode: route.pincode || '',
        assignedEmployeeId:
          route.assignedEmployeeId || undefined,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        area: '',
        city: '',
        state: '',
        pincode: '',
        assignedEmployeeId: undefined,
      });
    }
  }, [route, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        isolate
        flex
        items-center
        justify-center
        bg-slate-900/50
        backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
          relative
          z-[10000]
          w-full
          max-w-lg
          max-h-[90vh]
          overflow-hidden
          rounded-[12px]
          border
          border-slate-200
          bg-white
          shadow-xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            p-6
          "
        >
          <h3 className="text-lg font-bold text-slate-900">
            {route ? 'Edit Route' : 'Create New Route'}
          </h3>

          <button
            type="button"
            className="text-slate-400 transition-colors hover:text-slate-600"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(90vh-145px)] overflow-y-auto p-6 space-y-4">

            {/* Route Name */}
            <div>
              <label
                htmlFor="route-name"
                className="
                  mb-1
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-700
                "
              >
                Route Name *
              </label>

              <input
                id="route-name"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-2.5
                  text-sm
                  focus:border-primary
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/20
                "
                placeholder="e.g. Downtown Express"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="route-description"
                className="
                  mb-1
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-700
                "
              >
                Description *
              </label>

              <textarea
                id="route-description"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-2.5
                  text-sm
                  focus:border-primary
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/20
                "
                placeholder="Route description"
                rows={3}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </div>

            {/* Area + City */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="route-area"
                  className="
                    mb-1
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-700
                  "
                >
                  Area
                </label>

                <input
                  id="route-area"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-2.5
                    text-sm
                    focus:border-primary
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/20
                  "
                  placeholder="e.g. North District"
                  type="text"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      area: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="route-city"
                  className="
                    mb-1
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-700
                  "
                >
                  City
                </label>

                <input
                  id="route-city"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-2.5
                    text-sm
                    focus:border-primary
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/20
                  "
                  placeholder="e.g. Mumbai"
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    })
                  }
                />
              </div>

            </div>

            {/* State + Pincode */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="route-state"
                  className="
                    mb-1
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-700
                  "
                >
                  State
                </label>

                <input
                  id="route-state"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-2.5
                    text-sm
                    focus:border-primary
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/20
                  "
                  placeholder="e.g. Maharashtra"
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="route-pincode"
                  className="
                    mb-1
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-700
                  "
                >
                  Pincode
                </label>

                <input
                  id="route-pincode"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-2.5
                    text-sm
                    focus:border-primary
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/20
                  "
                  placeholder="e.g. 400001"
                  type="text"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pincode: e.target.value,
                    })
                  }
                />
              </div>

            </div>

            {/* Employee */}
            <div>
              <label
                htmlFor="route-employee"
                className="
                  mb-1
                  block
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-700
                "
              >
                Assign Employee (Optional)
              </label>

              <select
                id="route-employee"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-2.5
                  text-sm
                  focus:border-primary
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/20
                "
                value={formData.assignedEmployeeId || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedEmployeeId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              >
                <option value="">
                  Select employee
                </option>

                {employees.map((emp) => (
                  <option
                    key={emp.id}
                    value={emp.id}
                  >
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Footer */}
          <div
            className="
              flex
              justify-end
              space-x-3
              border-t
              border-slate-100
              bg-slate-50
              p-4
            "
          >
            <button
              type="button"
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2
                text-sm
                font-semibold
                text-slate-700
                transition-colors
                hover:bg-slate-100
              "
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-primary
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                shadow-sm
                shadow-primary/30
                transition-colors
                hover:bg-primary-dark
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? 'Saving...'
                : route
                  ? 'Update Route'
                  : 'Save Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RouteModal;