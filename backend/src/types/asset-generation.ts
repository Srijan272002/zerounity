export interface SpriteGenerationConfig {
  width: number;
  height: number;
  style: string;
  theme: string;
  format: 'png' | 'jpg' | 'webp';
  tags?: string[];
}

export interface BackgroundGenerationConfig {
  width: number;
  height: number;
  style: string;
  theme: string;
  format: 'png' | 'jpg' | 'webp';
  parallaxLayers?: number;
  tags?: string[];
}

export interface AssetOptimizationConfig {
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  format: 'png' | 'jpg' | 'webp';
  compressionLevel: number;
  retainMetadata?: boolean;
}

export interface GeneratedAsset {
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

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  path: string;
} 