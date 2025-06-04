import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { DashboardClient } from './DashboardClient';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch user's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch recent activity
  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-[#130d28] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      }>
        <DashboardClient 
          user={session.user}
          projects={projects || []}
          activities={activities || []}
        />
      </Suspense>
    </>
  );
} 