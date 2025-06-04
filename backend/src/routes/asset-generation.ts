import express from 'express';
import { AssetGenerator } from '../services/asset-generation/AssetGenerator';
import {
  SpriteGenerationConfig,
  BackgroundGenerationConfig,
  AssetOptimizationConfig,
  GeneratedAsset
} from '../types/asset-generation';

const router = express.Router();
const assetGenerator = new AssetGenerator();

// Generate a sprite
router.post('/sprite', async (req, res) => {
  try {
    const config: SpriteGenerationConfig = {
      width: req.body.width,
      height: req.body.height,
      style: req.body.style,
      theme: req.body.theme,
      format: req.body.format,
      tags: req.body.tags
    };

    const sprite = await assetGenerator.generateSprite(config);
    res.json(sprite);
  } catch (error) {
    console.error('Error generating sprite:', error);
    res.status(500).json({ error: 'Failed to generate sprite' });
  }
});

// Generate a background
router.post('/background', async (req, res) => {
  try {
    const config: BackgroundGenerationConfig = {
      width: req.body.width,
      height: req.body.height,
      style: req.body.style,
      theme: req.body.theme,
      format: req.body.format,
      parallaxLayers: req.body.parallaxLayers,
      tags: req.body.tags
    };

    const background = await assetGenerator.generateBackground(config);
    res.json(background);
  } catch (error) {
    console.error('Error generating background:', error);
    res.status(500).json({ error: 'Failed to generate background' });
  }
});

// Optimize an asset
router.post('/optimize', async (req, res) => {
  try {
    const asset: GeneratedAsset = req.body.asset;
    const config: AssetOptimizationConfig = {
      quality: req.body.quality,
      maxWidth: req.body.maxWidth,
      maxHeight: req.body.maxHeight,
      format: req.body.format,
      compressionLevel: req.body.compressionLevel,
      retainMetadata: req.body.retainMetadata
    };

    const result = await assetGenerator.optimizeAsset(asset, config);
    res.json(result);
  } catch (error) {
    console.error('Error optimizing asset:', error);
    res.status(500).json({ error: 'Failed to optimize asset' });
  }
});

// Get asset metadata
router.get('/:id', async (req, res) => {
  try {
    // TODO: Implement asset metadata retrieval from database
    res.status(501).json({ error: 'Not implemented' });
  } catch (error) {
    console.error('Error retrieving asset metadata:', error);
    res.status(500).json({ error: 'Failed to retrieve asset metadata' });
  }
});

export default router; 