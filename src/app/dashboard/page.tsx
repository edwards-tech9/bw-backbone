'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { mockJobs, mockTimePunches, mockQCEvents, useMockData } from '@/lib/mockData';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [stats, setStats] = useState({
    activeJobs: 0,
    pendingQC: 0,
    readyToInvoice: 0,
    staffClockedIn: 0,
  });

  useEffect(() => {
    const checkUser = async () => {
      if (useMockData) {
        // In demo mode, use a mock user
        setUser({ email: 'demo@biltwood.com' } as User);
        loadStats();
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);
      loadStats();
      setLoading(false);
    };

    checkUser();

    if (!useMockData) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session?.user) {
          router.push('/login');
        } else {
          setUser(session.user);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [router]);

  const loadStats = () => {
    if (useMockData) {
      setStats({
        activeJobs: mockJobs.filter(j => j.status === 'in_progress').length,
        pendingQC: mockJobs.filter(j => j.status === 'qa').length,
        readyToInvoice: mockJobs.filter(j => j.status === 'complete').length,
        staffClockedIn: mockTimePunches.filter(p =>
          p.punch_type === 'clock_in' &&
          new Date(p.timestamp).toDateString() === new Date().toDateString()
        ).length,
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">BW-Backbone</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Active Jobs"
            value={stats.activeJobs.toString()}
            description="Currently in progress"
            color="blue"
          />
          <DashboardCard
            title="Pending QC"
            value={stats.pendingQC.toString()}
            description="Awaiting quality control"
            color="yellow"
          />
          <DashboardCard
            title="Ready to Invoice"
            value={stats.readyToInvoice.toString()}
            description="Completed jobs"
            color="green"
          />
          <DashboardCard
            title="Staff Clocked In"
            value={stats.staffClockedIn.toString()}
            description="Currently working"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <ActionButton href="/jobs/new" label="Create New Job" />
              <ActionButton href="/time" label="Time Clock" />
              <ActionButton href="/qa" label="QC Inspection" />
              <ActionButton href="/equipment" label="Equipment Inspection" />
              <ActionButton href="/jobs" label="View All Jobs" />
              <ActionButton href="/staff" label="Staff Management" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="text-sm text-gray-500">
              No recent activity to display
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Setup Required</h3>
          <p className="text-sm text-blue-800 mb-4">
            To get started, you need to configure your Supabase project and run the database migrations.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900">
            <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
            <li>Copy your project URL and anon key to <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
            <li>Run the migration script in <code className="bg-blue-100 px-1 rounded">supabase/migrations/001_initial_schema.sql</code></li>
            <li>Configure Google OAuth for authentication</li>
          </ol>
          <p className="text-sm text-blue-800 mt-4">
            See <code className="bg-blue-100 px-1 rounded">SETUP.md</code> for detailed instructions.
          </p>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  color: 'blue' | 'yellow' | 'green' | 'purple';
}

function DashboardCard({ title, value, description, color }: DashboardCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-900',
    yellow: 'bg-yellow-50 text-yellow-900',
    green: 'bg-green-50 text-green-900',
    purple: 'bg-purple-50 text-purple-900',
  };

  return (
    <div className={`rounded-lg shadow p-6 ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs opacity-75">{description}</p>
    </div>
  );
}

interface ActionButtonProps {
  href: string;
  label: string;
}

function ActionButton({ href, label }: ActionButtonProps) {
  return (
    <a
      href={href}
      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
    >
      {label}
    </a>
  );
}
