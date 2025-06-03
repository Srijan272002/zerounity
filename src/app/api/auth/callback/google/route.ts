import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    console.error('API Callback: No code provided in callback');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    console.log('API Callback: Processing OAuth callback with code');
    
    // Create a cookies container
    const cookieStore = cookies();
    
    // Create a Supabase client for the route handler
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);

    // After successful exchange, get the session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('API Callback: No session after code exchange');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    console.log('API Callback: Authentication successful, redirecting to dashboard');
    
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('API Callback error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
} 