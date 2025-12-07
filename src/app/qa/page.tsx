'use client';

import { useState, useEffect } from 'react';
import { mockJobs, mockQCEvents, mockStaff, useMockData } from '@/lib/mockData';
import { formatDateTime } from '@/lib/utils';
import type { QCEvent } from '@/types';

export default function QAPage() {
  const [qcEvents, setQCEvents] = useState<QCEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    job_id: '',
    inspector_id: '',
    result: 'pass' as 'pass' | 'fail' | 'conditional',
    defect_types: [] as string[],
    severity: '',
    notes: '',
  });

  useEffect(() => {
    if (useMockData) {
      setQCEvents(mockQCEvents);
    }
  }, []);

  const defectOptions = [
    'orange_peel',
    'fisheye',
    'contamination',
    'overspray',
    'thin_coverage',
    'runs',
    'bubbles',
    'scratches',
    'dents',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: QCEvent = {
      id: crypto.randomUUID(),
      job_id: formData.job_id,
      part_id: null,
      operation_id: null,
      inspector_id: formData.inspector_id,
      result: formData.result,
      defect_types: formData.defect_types,
      severity: formData.severity as any,
      photo_urls: [],
      corrective_action: null,
      notes: formData.notes,
      inspected_at: new Date().toISOString(),
    };

    setQCEvents([newEvent, ...qcEvents]);
    setShowForm(false);
    setFormData({
      job_id: '',
      inspector_id: '',
      result: 'pass',
      defect_types: [],
      severity: '',
      notes: '',
    });

    alert('QC inspection recorded successfully!');
  };

  const toggleDefect = (defect: string) => {
    if (formData.defect_types.includes(defect)) {
      setFormData({
        ...formData,
        defect_types: formData.defect_types.filter(d => d !== defect),
      });
    } else {
      setFormData({
        ...formData,
        defect_types: [...formData.defect_types, defect],
      });
    }
  };

  const getJobNumber = (jobId: string) => {
    const job = mockJobs.find(j => j.id === jobId);
    return job?.job_number || 'Unknown';
  };

  const getInspectorName = (inspectorId: string) => {
    const inspector = mockStaff.find(s => s.id === inspectorId);
    return inspector ? `${inspector.first_name} ${inspector.last_name}` : 'Unknown';
  };

  const getResultBadge = (result: string) => {
    const colors: Record<string, string> = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      conditional: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${colors[result]}`}>
        {result.toUpperCase()}
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
              <a href="/qa" className="text-sm font-medium text-blue-600">Quality Control</a>
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
          <h2 className="text-2xl font-bold text-gray-900">Quality Control</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'New Inspection'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Record QC Inspection</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job
                  </label>
                  <select
                    value={formData.job_id}
                    onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select job...</option>
                    {mockJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.job_number} - {job.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inspector
                  </label>
                  <select
                    value={formData.inspector_id}
                    onChange={(e) => setFormData({ ...formData, inspector_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select inspector...</option>
                    {mockStaff.filter(s => s.role.includes('qa')).map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.first_name} {staff.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Result
                  </label>
                  <select
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                    <option value="conditional">Conditional</option>
                  </select>
                </div>

                {formData.result !== 'pass' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severity
                    </label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select severity...</option>
                      <option value="minor">Minor</option>
                      <option value="major">Major</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                )}
              </div>

              {formData.result !== 'pass' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Defect Types
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {defectOptions.map((defect) => (
                      <label key={defect} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.defect_types.includes(defect)}
                          onChange={() => toggleDefect(defect)}
                          className="mr-2"
                        />
                        <span className="text-sm">{defect.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Record Inspection
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Recent Inspections</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspector
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Defects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {qcEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getJobNumber(event.job_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getInspectorName(event.inspector_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getResultBadge(event.result)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {event.defect_types.length > 0
                      ? event.defect_types.join(', ')
                      : 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(event.inspected_at)}
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
