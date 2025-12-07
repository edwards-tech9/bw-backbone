'use client';

import { useState, useEffect } from 'react';
import { mockStaff, useMockData } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import type { Staff } from '@/types';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    if (useMockData) {
      setStaff(mockStaff);
    }
  }, []);

  const getRoleBadges = (roles: string[]) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      estimator: 'bg-purple-100 text-purple-800',
      operator: 'bg-green-100 text-green-800',
      qa: 'bg-yellow-100 text-yellow-800',
      billing: 'bg-indigo-100 text-indigo-800',
      marketing: 'bg-pink-100 text-pink-800',
    };

    return roles.map((role) => (
      <span key={role} className={`px-2 py-1 text-xs font-semibold rounded ${colors[role] || 'bg-gray-100 text-gray-800'} mr-1`}>
        {role.toUpperCase()}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <a href="/dashboard" className="text-xl font-bold text-gray-900">BW-Backbone</a>
              <a href="/staff" className="text-sm font-medium text-blue-600">Staff</a>
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
          <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Add Staff Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Staff</h3>
            <p className="text-3xl font-bold text-gray-900">{staff.filter(s => s.status === 'active').length}</p>
            <p className="text-xs text-gray-500 mt-1">Active employees</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Departments</h3>
            <p className="text-3xl font-bold text-gray-900">
              {new Set(staff.map(s => s.department)).size}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active departments</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Average Rate</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(staff.reduce((sum, s) => sum + (s.hourly_rate || 0), 0) / staff.length)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Per hour</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hourly Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {member.first_name?.[0]}{member.last_name?.[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.first_name} {member.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.employee_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadges(member.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.hourly_rate ? formatCurrency(member.hourly_rate) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status.toUpperCase()}
                    </span>
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
