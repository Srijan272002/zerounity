import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  console.log(`Auth callback: Handling request with code parameter: ${!!code}`);

  if (!code) {
    console.error('No code provided in callback');
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`);
  }

  try {
    const cookieStore = cookies();
    
    // Get the code verifier from cookies
    const codeVerifier = cookieStore.get('supabase-code-verifier')?.value;
    
    if (!codeVerifier) {
      console.error('No code verifier found in cookies');
      return NextResponse.redirect(`${origin}/auth/login?error=no_code_verifier`);
    }

    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Exchange the code for a session
    const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(`${origin}/auth/login?error=exchange_error`);
    }

    if (!session) {
      console.error('No session after code exchange');
      return NextResponse.redirect(`${origin}/auth/login?error=no_session`);
    }

    // Create response with redirect
    const response = NextResponse.redirect(`${origin}/dashboard`);

    // Set auth cookie with session
    response.cookies.set('sb-auth-token', JSON.stringify(session), {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Clean up the code verifier cookie
    response.cookies.delete('supabase-code-verifier');

    return response;
  } catch (error) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(`${origin}/auth/login?error=auth_error`);
  }
} 