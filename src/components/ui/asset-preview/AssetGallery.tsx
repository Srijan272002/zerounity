'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Asset {
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
}

interface AssetGalleryProps {
  assets: Asset[];
  onAssetClick?: (asset: Asset) => void;
  selectedAssetId?: string;
}

export const AssetGallery: React.FC<AssetGalleryProps> = ({
  assets,
  onAssetClick,
  selectedAssetId,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className={cn(
            'relative aspect-square rounded-lg overflow-hidden border border-border cursor-pointer transition-all hover:scale-105',
            selectedAssetId === asset.id && 'ring-2 ring-primary'
          )}
          onClick={() => onAssetClick?.(asset)}
        >
          <Image
            src={asset.path}
            alt={`${asset.type} - ${asset.id}`}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium capitalize">{asset.type}</span>
              <span className="text-xs text-muted-foreground">
                {(asset.metadata.size / 1024).toFixed(1)}KB
              </span>
            </div>
            {asset.metadata.tags && asset.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {asset.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}; 