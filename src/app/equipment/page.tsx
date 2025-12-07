'use client';

import { useState, useEffect } from 'react';
import { mockEquipment, useMockData } from '@/lib/mockData';
import type { Equipment } from '@/types';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    if (useMockData) {
      setEquipment(mockEquipment);
    }
  }, []);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      operational: 'bg-green-100 text-green-800',
      down: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      retired: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${colors[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getServiceStatus = (currentMeter: number | null, nextServiceDue: number | null) => {
    if (!currentMeter || !nextServiceDue) return null;

    const remaining = nextServiceDue - currentMeter;
    const percentage = (remaining / (nextServiceDue - (nextServiceDue - currentMeter))) * 100;

    if (percentage <= 10) {
      return <span className="text-red-600 font-semibold">DUE NOW</span>;
    } else if (percentage <= 25) {
      return <span className="text-yellow-600 font-semibold">DUE SOON</span>;
    }
    return <span className="text-green-600">OK</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <a href="/dashboard" className="text-xl font-bold text-gray-900">BW-Backbone</a>
              <a href="/equipment" className="text-sm font-medium text-blue-600">Equipment</a>
            </div>
            <div className="flex items-center">
              <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Equipment Management</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Record Inspection
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Add Equipment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Equipment</h3>
            <p className="text-3xl font-bold text-gray-900">{equipment.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Operational</h3>
            <p className="text-3xl font-bold text-green-600">
              {equipment.filter(e => e.status === 'operational').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">In Maintenance</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {equipment.filter(e => e.status === 'maintenance').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Down</h3>
            <p className="text-3xl font-bold text-red-600">
              {equipment.filter(e => e.status === 'down').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipment.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.equipment_name}</div>
                    <div className="text-sm text-gray-500">
                      {item.manufacturer} {item.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.equipment_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.current_meter ? `${item.current_meter} ${item.meter_type}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getServiceStatus(item.current_meter, item.next_service_due)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Inspect
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {equipment.some(e => e.notes) && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2">Equipment Notes</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              {equipment.filter(e => e.notes).map((item) => (
                <li key={item.id}>
                  <strong>{item.equipment_name}:</strong> {item.notes}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
