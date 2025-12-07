'use client';

import { useState, useEffect } from 'react';
import { mockStaff, mockTimePunches, useMockData } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import type { Staff, TimePunch } from '@/types';

export default function TimePage() {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [punches, setPunches] = useState<TimePunch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useMockData) {
      setPunches(mockTimePunches);
    }
  }, []);

  const handleClockIn = async () => {
    if (!selectedStaff) {
      alert('Please select a staff member');
      return;
    }

    setLoading(true);
    try {
      const newPunch: TimePunch = {
        id: crypto.randomUUID(),
        staff_id: selectedStaff,
        punch_type: 'clock_in',
        punch_method: 'google_auth',
        timestamp: new Date().toISOString(),
        location: 'Web Portal',
        notes: null,
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
      };

      setPunches([newPunch, ...punches]);
      alert('Clocked in successfully!');
      setSelectedStaff('');
    } catch (error) {
      console.error('Error clocking in:', error);
      alert('Error clocking in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!selectedStaff) {
      alert('Please select a staff member');
      return;
    }

    setLoading(true);
    try {
      const newPunch: TimePunch = {
        id: crypto.randomUUID(),
        staff_id: selectedStaff,
        punch_type: 'clock_out',
        punch_method: 'google_auth',
        timestamp: new Date().toISOString(),
        location: 'Web Portal',
        notes: null,
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
      };

      setPunches([newPunch, ...punches]);
      alert('Clocked out successfully!');
      setSelectedStaff('');
    } catch (error) {
      console.error('Error clocking out:', error);
      alert('Error clocking out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStaffName = (staffId: string) => {
    const staff = mockStaff.find(s => s.id === staffId);
    return staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown';
  };

  const getPunchTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      clock_in: 'Clock In',
      clock_out: 'Clock Out',
      break_start: 'Break Start',
      break_end: 'Break End',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      edited: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <a href="/dashboard" className="text-xl font-bold text-gray-900">BW-Backbone</a>
              <a href="/time" className="text-sm font-medium text-blue-600">Time Clock</a>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Time Clock</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Clock In/Out</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="staff" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Staff Member
                  </label>
                  <select
                    id="staff"
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose staff member...</option>
                    {mockStaff.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.first_name} {staff.last_name} ({staff.employee_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleClockIn}
                    disabled={loading || !selectedStaff}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Clock In
                  </button>
                  <button
                    onClick={handleClockOut}
                    disabled={loading || !selectedStaff}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Clock Out
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>QR Code Scanning:</strong> Staff can also clock in/out by scanning their QR badge at any station tablet.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Mobile App:</strong> Coming soon - clock in/out from personal devices using Google Auth.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Currently Clocked In</h3>
            <div className="space-y-2">
              {mockStaff
                .filter(staff => {
                  const lastPunch = punches
                    .filter(p => p.staff_id === staff.id)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                  return lastPunch?.punch_type === 'clock_in';
                })
                .map(staff => (
                  <div key={staff.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {staff.first_name} {staff.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{staff.department}</p>
                    </div>
                    <span className="text-xs text-green-600 font-semibold">ACTIVE</span>
                  </div>
                ))}
              {mockStaff.filter(staff => {
                const lastPunch = punches
                  .filter(p => p.staff_id === staff.id)
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                return lastPunch?.punch_type === 'clock_in';
              }).length === 0 && (
                <p className="text-sm text-gray-500">No staff currently clocked in</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Recent Punches</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {punches.map((punch) => (
                <tr key={punch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getStaffName(punch.staff_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getPunchTypeLabel(punch.punch_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(punch.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {punch.punch_method.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(punch.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
