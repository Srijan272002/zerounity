import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Sign out on server side
    await supabase.auth.signOut();
    
    // Create response with redirect
    const response = NextResponse.redirect(new URL('/', request.url), {
      status: 302,
    });

    // Clear all auth-related cookies
    const authCookies = [
      'supabase-auth-token',
      'sb-access-token',
      'sb-refresh-token',
      '__session',
    ];

    authCookies.forEach(cookieName => {
      response.cookies.delete(cookieName);
      
      // Also try to delete with different paths and domains
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
      });
    });

    return response;
  } catch (error) {
    console.error('Error during sign out:', error);
    // Even if there's an error, try to redirect and clear cookies
    const response = NextResponse.redirect(new URL('/', request.url), {
      status: 302,
    });
    
    response.cookies.delete('supabase-auth-token');
    return response;
  }
} 