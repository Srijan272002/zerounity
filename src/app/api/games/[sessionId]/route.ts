import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    // TODO: Replace with actual game data retrieval from your backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games/${params.sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch game data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching game data:', error);
    return NextResponse.json(
      { error: 'Failed to load game data' },
      { status: 500 }
    );
  }
} 