import sharp, { Blend } from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  SpriteGenerationConfig,
  BackgroundGenerationConfig,
  AssetOptimizationConfig,
  GeneratedAsset,
  OptimizationResult
} from '../../types/asset-generation';

export class AssetGenerator {
  private outputDir: string;
  private tempDir: string;

  constructor(outputDir: string = 'assets', tempDir: string = 'temp') {
    this.outputDir = outputDir;
    this.tempDir = tempDir;
  }

  public async generateSprite(config: SpriteGenerationConfig): Promise<GeneratedAsset> {
    try {
      const id = uuidv4();
      const outputPath = path.join(this.outputDir, 'sprites', `${id}.${config.format}`);

      // TODO: Integrate with AI image generation service
      // For now, create a placeholder colored rectangle
      const sprite = await sharp({
        create: {
          width: config.width,
          height: config.height,
          channels: 4,
          background: { r: 255, g: 0, b: 0, alpha: 1 }
        }
      })
      .toFormat(config.format)
      .toFile(outputPath);

      return {
        id,
        type: 'sprite',
        path: outputPath,
        metadata: {
          width: sprite.width,
          height: sprite.height,
          format: sprite.format,
          size: sprite.size || 0,
          createdAt: new Date().toISOString(),
          optimized: false,
          tags: config.tags
        }
      };
    } catch (error) {
      console.error('Error generating sprite:', error);
      throw new Error('Failed to generate sprite');
    }
  }

  public async generateBackground(config: BackgroundGenerationConfig): Promise<GeneratedAsset> {
    try {
      const id = uuidv4();
      const outputPath = path.join(this.outputDir, 'backgrounds', `${id}.${config.format}`);
      const numLayers = config.parallaxLayers || 1;
      
      // Generate base layer
      // TODO: Integrate with AI image generation service
      const baseLayer = await sharp({
        create: {
          width: config.width,
          height: config.height,
          channels: 4,
          background: { r: 0, g: 0, b: 255, alpha: 1 }
        }
      }).toBuffer();

      // For parallax effect, create and composite multiple layers
      const layers = await Promise.all(
        Array(numLayers).fill(null).map(async (_, index) => {
          const opacity = 1 - (index * 0.2);
          return {
            input: baseLayer,
            blend: 'overlay' as Blend,
            opacity
          };
        })
      );

      const background = await sharp(baseLayer)
        .composite(layers)
        .toFormat(config.format)
        .toFile(outputPath);

      return {
        id,
        type: 'background',
        path: outputPath,
        metadata: {
          width: background.width,
          height: background.height,
          format: background.format,
          size: background.size || 0,
          createdAt: new Date().toISOString(),
          optimized: false,
          tags: config.tags
        }
      };
    } catch (error) {
      console.error('Error generating background:', error);
      throw new Error('Failed to generate background');
    }
  }

  public async optimizeAsset(
    asset: GeneratedAsset,
    config: AssetOptimizationConfig
  ): Promise<OptimizationResult> {
    try {
      const originalStats = await sharp(asset.path).metadata();
      const originalSize = originalStats.size || 0;

      const optimizedPath = path.join(
        this.outputDir,
        'optimized',
        `${path.basename(asset.path, path.extname(asset.path))}_optimized.${config.format}`
      );

      let pipeline = sharp(asset.path);

      // Apply size constraints if specified
      if (config.maxWidth || config.maxHeight) {
        pipeline = pipeline.resize(config.maxWidth, config.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Apply format-specific optimizations
      switch (config.format) {
        case 'png':
          pipeline = pipeline.png({
            compressionLevel: config.compressionLevel,
            quality: config.quality
          });
          break;
        case 'jpg':
          pipeline = pipeline.jpeg({
            quality: config.quality
          });
          break;
        case 'webp':
          pipeline = pipeline.webp({
            quality: config.quality,
            lossless: config.quality === 100
          });
          break;
      }

      // Remove metadata if not needed
      if (!config.retainMetadata) {
        pipeline = pipeline.withMetadata();
      }

      const optimizedImage = await pipeline.toFile(optimizedPath);

      return {
        originalSize,
        optimizedSize: optimizedImage.size || 0,
        compressionRatio: (originalSize || 1) / (optimizedImage.size || 1),
        path: optimizedPath
      };
    } catch (error) {
      console.error('Error optimizing asset:', error);
      throw new Error('Failed to optimize asset');
    }
  }
} 