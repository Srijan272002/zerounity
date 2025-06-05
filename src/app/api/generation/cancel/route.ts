import { NextResponse } from 'next/server';
import { GenerationController } from '../../../../../backend/src/services/ai/GenerationController';

export async function POST(request: Request) {
  try {
    const { generationId } = await request.json();
    
    if (!generationId) {
      return NextResponse.json(
        { error: 'Generation ID is required' },
        { status: 400 }
      );
    }

    const controller = GenerationController.getInstance();
    controller.cancelGeneration(generationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error canceling generation:', error);
    return NextResponse.json(
      { error: 'Failed to cancel generation' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 