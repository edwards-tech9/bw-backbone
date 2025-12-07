'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateJobNumber } from '@/lib/utils';
import { generateQRCode, generateJobQRData } from '@/lib/qr';
import { mockCustomers, useMockData } from '@/lib/mockData';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    job_number: generateJobNumber(),
    customer_id: '',
    description: '',
    priority: 'standard',
    due_date: '',
    total_quoted: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate QR code for the job
      const jobId = crypto.randomUUID();
      const qrData = generateJobQRData(jobId, formData.job_number);
      const qrCodeImage = await generateQRCode(qrData);

      setQrCode(qrCodeImage);

      // In a real app, this would save to Supabase
      if (!useMockData) {
        // TODO: Save to Supabase
        // const { data, error } = await supabase.from('jobs').insert([{ ...formData, id: jobId, qr_code: qrCodeImage }]);
      }

      // Show success message
      alert('Job created successfully!');

      // Redirect after a moment to show QR code
      setTimeout(() => {
        router.push('/jobs');
      }, 2000);
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Error creating job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <a href="/dashboard" className="text-xl font-bold text-gray-900">BW-Backbone</a>
              <a href="/jobs" className="text-sm font-medium text-gray-600">Jobs</a>
            </div>
            <div className="flex items-center">
              <a href="/jobs" className="text-sm text-gray-600 hover:text-gray-900">
                Cancel
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Job</h2>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="job_number" className="block text-sm font-medium text-gray-700 mb-1">
                Job Number
              </label>
              <input
                type="text"
                id="job_number"
                value={formData.job_number}
                onChange={(e) => setFormData({ ...formData, job_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated, but can be overridden</p>
            </div>

            <div>
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <select
                id="customer_id"
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a customer...</option>
                {mockCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name} - {customer.contact_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the job..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="rush">Rush</option>
                  <option value="hold">Hold</option>
                </select>
              </div>

              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="due_date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="total_quoted" className="block text-sm font-medium text-gray-700 mb-1">
                  Quoted Amount
                </label>
                <input
                  type="number"
                  id="total_quoted"
                  step="0.01"
                  value={formData.total_quoted}
                  onChange={(e) => setFormData({ ...formData, total_quoted: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {qrCode && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-900 mb-2">Job Traveler QR Code Generated</h3>
                <div className="flex items-center justify-center">
                  <img src={qrCode} alt="Job QR Code" className="w-48 h-48" />
                </div>
                <p className="text-xs text-green-700 text-center mt-2">
                  This QR code will be saved with the job for scanning
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Job...' : 'Create Job'}
              </button>
              <a
                href="/jobs"
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 text-center transition-colors"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Next Steps After Creating Job</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Add parts and quantities to the job</li>
            <li>Define operations for each part (sandblast, mask, coat, cure)</li>
            <li>Assign operations to staff members</li>
            <li>Print traveler with QR code for shop floor</li>
            <li>Track progress as operations are completed</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
