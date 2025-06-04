'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function NavbarClient() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-purple-500/10 bg-[#130d28]/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="text-xl font-bold text-purple-500 hover:text-purple-400 transition-colors"
            >
              GameForge
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm transition-colors hover:text-white/90",
                  pathname === '/dashboard' 
                    ? "text-white font-medium border-b-2 border-purple-500" 
                    : "text-white/60"
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className={cn(
                  "text-sm transition-colors hover:text-white/90",
                  pathname === '/profile' 
                    ? "text-white font-medium border-b-2 border-purple-500" 
                    : "text-white/60"
                )}
              >
                Profile
              </Link>
            </div>
          </div>
          <Link
            href="/auth/signout"
            className="text-sm text-white/60 hover:text-white/90 transition-colors"
          >
            Sign out
          </Link>
        </div>
      </div>
    </nav>
  );
} 