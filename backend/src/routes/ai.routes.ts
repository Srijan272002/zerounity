import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import { rateLimitConfig } from '../config/ai.config';
import { AIService } from '../services/ai.service';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

const router = Router();
const aiService = AIService.getInstance();

// Apply rate limiting
const limiter = rateLimit(rateLimitConfig);
router.use(limiter);

// Configure file upload
router.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  useTempFiles: true,
  tempFileDir: os.tmpdir()
}));

// Error handler middleware
const errorHandler = (err: Error, req: any, res: any, next: any) => {
  console.error('AI Service Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
    status: 'error'
  });
};

// Text generation endpoint
router.post('/generate/text', async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const generationId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const result = await aiService.generateText(prompt, generationId);
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

// Code generation endpoint
router.post('/generate/code', async (req, res, next) => {
  try {
    const { prompt, language } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await aiService.generateCode(prompt, language);
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

// Image analysis endpoint
router.post('/analyze/image', async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const image = req.files.image as fileUpload.UploadedFile;
    const result = await aiService.analyzeImage(image.tempFilePath, prompt);
    
    // Clean up temp file
    await fs.unlink(image.tempFilePath);
    
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

// Web app generation endpoint
router.post('/generate/webapp', async (req, res, next) => {
  try {
    const { specification } = req.body;
    if (!specification) {
      return res.status(400).json({ error: 'Specification is required' });
    }

    const result = await aiService.generateWebApp(specification);
    res.json({ result });
  } catch (error) {
    next(error);
  }
});

// Streaming response endpoint
router.post('/stream', async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await aiService.streamResponse(prompt, (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    res.end();
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router; 