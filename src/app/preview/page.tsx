'use client';

import React from 'react';
import { PreviewContainer } from '@/components/ui/preview/PreviewContainer';

const sampleCode = `// Sample game code
class Player {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.speed = 5;
  }

  update() {
    // Update player position
    if (input.isKeyDown('right')) {
      this.position.x += this.speed;
    }
  }
}`;

const sampleAssets = [
  {
    id: '1',
    type: 'sprite' as const,
    path: '/assets/player.png',
    metadata: {
      width: 32,
      height: 32,
      format: 'png',
      size: 2048,
      createdAt: '2024-03-10T12:00:00Z',
      optimized: true,
      tags: ['player', 'character']
    }
  },
  // Add more sample assets as needed
];

export default function PreviewPage() {
  const handleCodeChange = (newCode: string) => {
    console.log('Code changed:', newCode);
  };

  const handleAssetSelect = (assetId: string) => {
    console.log('Asset selected:', assetId);
  };

  const handleSave = () => {
    console.log('Saving changes...');
  };

  const handleShare = () => {
    console.log('Sharing preview...');
  };

  return (
    <div className="min-h-screen bg-[#130d28] text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Game Preview</h1>
              <p className="text-gray-400">
                Test and refine your game before exporting
              </p>
            </div>
          </div>

          <div className="bg-[#1a1625] rounded-lg border border-purple-500/20 p-6">
            <PreviewContainer
              code={{
                current: sampleCode,
                language: 'typescript'
              }}
              assets={sampleAssets}
              game={{
                gifUrl: '/assets/preview.gif',
                interactiveUrl: '/game/preview'
              }}
              onCodeChange={handleCodeChange}
              onAssetSelect={handleAssetSelect}
              onSave={handleSave}
              onShare={handleShare}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 