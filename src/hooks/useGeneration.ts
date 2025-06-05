import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { io, Socket } from 'socket.io-client';

interface GenerationState {
  isGenerating: boolean;
  progress: number;
  stage: string;
  error: string | null;
}

interface UseGenerationOptions {
  onProgress?: (progress: number, stage: string) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export function useGeneration(options: UseGenerationOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    stage: '',
    error: null,
  });

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('progressUpdate', (data) => {
      setState((prev) => ({
        ...prev,
        progress: data.progress,
        stage: data.stage,
        isGenerating: data.status === 'in_progress',
      }));

      options.onProgress?.(data.progress, data.stage);

      if (data.status === 'completed') {
        options.onComplete?.();
      } else if (data.status === 'error') {
        setState((prev) => ({ ...prev, error: data.error }));
        options.onError?.(data.error);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [options.onProgress, options.onComplete, options.onError]);

  const startGeneration = useCallback(() => {
    const generationId = uuidv4();
    setState({
      isGenerating: true,
      progress: 0,
      stage: 'initializing',
      error: null,
    });
    socket?.emit('startGeneration', { generationId });
    return generationId;
  }, [socket]);

  const cancelGeneration = useCallback(async (generationId: string) => {
    try {
      const response = await fetch('/api/generation/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ generationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel generation');
      }

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: 'Generation cancelled',
      }));
    } catch (error) {
      console.error('Error cancelling generation:', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to cancel generation',
      }));
    }
  }, []);

  return {
    ...state,
    startGeneration,
    cancelGeneration,
  };
} 