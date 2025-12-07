import { redirect } from 'next/navigation';

export default function Home() {
  // In demo mode, go straight to dashboard
  // In production mode, show login
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  if (useMockData) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
