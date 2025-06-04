'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeEditor } from '../code-preview/CodeEditor';
import { DiffViewer } from '../code-preview/DiffViewer';
import { AssetGallery } from '../asset-preview/AssetGallery';
import { GamePreview } from '../game-preview/GamePreview';
import { Button } from '../button';
import { Save } from 'lucide-react';

interface PreviewContainerProps {
  code: {
    current: string;
    original?: string;
    language: string;
  };
  assets: Array<{
    id: string;
    type: 'sprite' | 'background';
    path: string;
    metadata: {
      width: number;
      height: number;
      format: string;
      size: number;
      createdAt: string;
      optimized: boolean;
      tags?: string[];
    };
  }>;
  game: {
    gifUrl?: string;
    interactiveUrl?: string;
  };
  onCodeChange?: (code: string) => void;
  onAssetSelect?: (assetId: string) => void;
  onSave?: () => void;
  onShare?: () => void;
}

export const PreviewContainer: React.FC<PreviewContainerProps> = ({
  code,
  assets,
  game,
  onCodeChange,
  onAssetSelect,
  onSave,
  onShare,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>();

  const handleAssetClick = (assetId: string) => {
    setSelectedAssetId(assetId);
    onAssetSelect?.(assetId);
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined && onCodeChange) {
      onCodeChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="bg-[#1a1625]/50 border border-purple-500/20">
            <TabsTrigger 
              value="preview"
              className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 text-gray-400"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 text-gray-400"
            >
              Code
            </TabsTrigger>
            <TabsTrigger 
              value="assets"
              className="data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 text-gray-400"
            >
              Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="border border-purple-500/20 rounded-lg overflow-hidden">
              <GamePreview
                gifUrl={game.gifUrl}
                interactiveUrl={game.interactiveUrl}
                onShare={onShare}
              />
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4 mt-4">
            {code.original ? (
              <DiffViewer
                originalCode={code.original}
                modifiedCode={code.current}
                language={code.language}
              />
            ) : (
              <div className="border border-purple-500/20 rounded-lg overflow-hidden bg-[#0d1117]">
                <CodeEditor
                  code={code.current}
                  language={code.language}
                  onChange={handleCodeChange}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="assets" className="mt-4">
            <div className="border border-purple-500/20 rounded-lg p-4 bg-[#1a1625]/50">
              <AssetGallery
                assets={assets}
                selectedAssetId={selectedAssetId}
                onAssetClick={(asset) => handleAssetClick(asset.id)}
              />
            </div>
          </TabsContent>
        </Tabs>

        {onSave && (
          <Button 
            variant="outline" 
            onClick={onSave} 
            className="ml-4 border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
}; 