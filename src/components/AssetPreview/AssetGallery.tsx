import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

interface Asset {
  id: string;
  type: 'sprite' | 'background' | 'sound';
  url: string;
  name: string;
}

interface AssetGalleryProps {
  assets: Asset[];
  onAssetUpdate: (assetId: string, newUrl: string) => void;
  onAssetDelete: (assetId: string) => void;
}

export const AssetGallery: React.FC<AssetGalleryProps> = ({
  assets,
  onAssetUpdate,
  onAssetDelete,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sprites');

  const filteredAssets = assets.filter((asset) => {
    switch (activeTab) {
      case 'sprites':
        return asset.type === 'sprite';
      case 'backgrounds':
        return asset.type === 'background';
      case 'sounds':
        return asset.type === 'sound';
      default:
        return true;
    }
  });

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="sprites" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sprites">Sprites</TabsTrigger>
          <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
          <TabsTrigger value="sounds">Sound Effects</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setSelectedAsset(asset);
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                    {asset.type !== 'sound' ? (
                      <Image
                        src={asset.url}
                        alt={asset.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-4xl">🔊</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-center truncate">{asset.name}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Asset: {selectedAsset?.name}</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                {selectedAsset.type !== 'sound' ? (
                  <Image
                    src={selectedAsset.url}
                    alt={selectedAsset.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <audio controls src={selectedAsset.url} className="w-full" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept={
                    selectedAsset.type === 'sound'
                      ? 'audio/*'
                      : 'image/*'
                  }
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle file upload and get new URL
                      // Then call onAssetUpdate
                    }
                  }}
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    onAssetDelete(selectedAsset.id);
                    setIsDialogOpen(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 