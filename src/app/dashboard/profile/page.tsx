import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LoadingOverlay } from '@/components/ui/loading';

function ProfileLoading() {
  return <LoadingOverlay message="Loading profile..." />;
}

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <Suspense fallback={<ProfileLoading />}>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
            <div className="mt-5">
              <div className="rounded-md bg-gray-50 p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 text-sm text-gray-900">{session.user.email}</div>
                  </div>
                  {profile && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <div className="mt-1 text-sm text-gray-900">{profile.username || 'Not set'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <div className="mt-1 text-sm text-gray-900">{profile.bio || 'No bio yet'}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
} 