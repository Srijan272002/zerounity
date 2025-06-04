'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Share2, Play, Pause } from 'lucide-react';

interface GamePreviewProps {
  gifUrl?: string;
  interactiveUrl?: string;
  onShare?: () => void;
}

export const GamePreview: React.FC<GamePreviewProps> = ({
  gifUrl,
  interactiveUrl,
  onShare,
}) => {
  const [isInteractive, setIsInteractive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
      {isInteractive && interactiveUrl ? (
        <iframe
          src={interactiveUrl}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      ) : gifUrl ? (
        <div className="relative w-full h-full">
          <Image
            src={gifUrl}
            alt="Game Preview"
            fill
            className="object-contain"
            style={{ display: isPlaying ? 'block' : 'none' }}
          />
          {!isPlaying && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg font-medium">Preview Paused</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <span className="text-muted-foreground">No preview available</span>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {gifUrl && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          )}
          {interactiveUrl && (
            <Button
              variant={isInteractive ? "default" : "secondary"}
              onClick={() => setIsInteractive(!isInteractive)}
            >
              {isInteractive ? "Exit Interactive" : "Interactive Mode"}
            </Button>
          )}
        </div>
        {onShare && (
          <Button variant="secondary" size="icon" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}; 