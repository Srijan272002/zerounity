'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface GameData {
  code: string;
  assets: Array<{
    id: string;
    type: 'sprite';
    path: string;
    metadata: {
      width: number;
      height: number;
      format: string;
      size: number;
      createdAt: string;
      optimized: boolean;
      tags: string[];
    };
  }>;
}

export default function GamePlayPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    // The game engine will handle loading the game data and assets
    setLoading(false);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#130d28] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#130d28] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <iframe
        src={`/api/game-engine/${sessionId}`}
        className="w-full h-screen border-0"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
} 