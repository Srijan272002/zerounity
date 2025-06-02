import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Path checks
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isRootPage = req.nextUrl.pathname === '/';
  const isPublicAsset = req.nextUrl.pathname.startsWith('/_next') || 
                        req.nextUrl.pathname.includes('/favicon.ico');
  
  // Only protected routes need auth - specifically dashboard routes
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');
  
  // Skip auth check for public routes
  if (!isProtectedRoute && !isAuthPage) {
    return res;
  }
  
  try {
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();
    
    // Redirect if on auth page but already logged in
    if (isAuthPage && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
    
    // If auth fails and trying to access protected route, redirect to login
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 