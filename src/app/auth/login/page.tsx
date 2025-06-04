'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Full-screen background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fred.png"
          alt="Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      {/* Content overlay with enhanced glassmorphism */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl backdrop-blur-xl bg-black/40 p-8 shadow-xl transition-all">
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-center text-4xl font-bold tracking-tight text-white">
                Welcome to Gamefordge
              </h1>
              <p className="text-center text-xl font-medium text-gray-200">
                Build. Play. Repeat
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleSignIn}
                className="group relative flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white transition-all hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign in with Google
              </button>
              <p className="text-center text-sm text-gray-300">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 