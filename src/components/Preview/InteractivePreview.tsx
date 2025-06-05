import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { AssetGallery } from '../AssetPreview/AssetGallery';
import { useGeneration } from '@/hooks/useGeneration';
import { Progress } from '@/components/ui/progress';

interface PreviewData {
  code: {
    unity: string;
    godot: string;
  };
  assets: Array<{
    id: string;
    type: 'sprite' | 'background' | 'sound';
    url: string;
    name: string;
  }>;
}

interface InteractivePreviewProps {
  previewData: PreviewData;
  onCodeUpdate: (engine: 'unity' | 'godot', newCode: string) => void;
  onAssetUpdate: (assetId: string, newUrl: string) => void;
  onAssetDelete: (assetId: string) => void;
  onGeneratePreview: () => Promise<string>;
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({
  previewData,
  onCodeUpdate,
  onAssetUpdate,
  onAssetDelete,
  onGeneratePreview,
}) => {
  const [activeEngine, setActiveEngine] = useState<'unity' | 'godot'>('unity');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);

  const {
    isGenerating,
    progress,
    stage,
    error,
    startGeneration,
    cancelGeneration
  } = useGeneration({
    onComplete: async () => {
      try {
        const url = await onGeneratePreview();
        setPreviewUrl(url);
      } catch (error) {
        console.error('Error generating preview:', error);
      }
    }
  });

  const handleCodeChange = (value: string | undefined) => {
    if (value) {
      onCodeUpdate(activeEngine, value);
    }
  };

  const handleGeneratePreview = async () => {
    const generationId = startGeneration();
    setCurrentGenerationId(generationId);
  };

  const handleCancelGeneration = async () => {
    if (currentGenerationId) {
      await cancelGeneration(currentGenerationId);
      setCurrentGenerationId(null);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
      <ResizablePanel defaultSize={50}>
        <div className="h-full flex flex-col">
          <Tabs defaultValue="code" className="flex-1">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="flex-1">
              <div className="space-y-4 h-full">
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeEngine === 'unity' ? 'default' : 'outline'}
                    onClick={() => setActiveEngine('unity')}
                  >
                    Unity
                  </Button>
                  <Button
                    variant={activeEngine === 'godot' ? 'default' : 'outline'}
                    onClick={() => setActiveEngine('godot')}
                  >
                    Godot
                  </Button>
                </div>
                <div className="h-[calc(100%-60px)]">
                  <Editor
                    height="100%"
                    defaultLanguage={activeEngine === 'unity' ? 'csharp' : 'gdscript'}
                    value={previewData.code[activeEngine]}
                    onChange={handleCodeChange}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      readOnly: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="assets">
              <AssetGallery
                assets={previewData.assets}
                onAssetUpdate={onAssetUpdate}
                onAssetDelete={onAssetDelete}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ResizablePanel>

      <ResizablePanel defaultSize={50}>
        <div className="h-full flex flex-col p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Preview</h3>
            {isGenerating ? (
              <Button
                variant="destructive"
                onClick={handleCancelGeneration}
              >
                Cancel Generation
              </Button>
            ) : (
              <Button
                onClick={handleGeneratePreview}
                disabled={isGenerating}
              >
                Generate Preview
              </Button>
            )}
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-gray-500 capitalize">{stage}</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Game Preview"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">
                  Generate a preview to see your game in action
                </p>
              </div>
            )}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}; 