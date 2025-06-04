import * as dotenv from 'dotenv';

// Load environment variables before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { defaultModel } from './config/google-cloud';
import { z } from 'zod';
import authRoutes from './routes/auth';
import aiRoutes from './routes/ai.routes';
import narrativeRoutes from './routes/narrative';
import codeSynthesisRoutes from './routes/code-synthesis';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  abortOnLimit: true,
}));

// Auth routes
app.use('/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/narrative', narrativeRoutes);
app.use('/api/code-synthesis', codeSynthesisRoutes);

const requestSchema = z.object({
  prompt: z.string().min(1).max(1000),
  temperature: z.number().min(0).max(1).optional().default(0.7),
  maxTokens: z.number().min(1).max(2048).optional().default(1024),
});

// Helper function to estimate token count
function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

// Text generation endpoint
app.post('/api/generate-text', async (req, res) => {
  try {
    // Validate request body
    const validatedData = requestSchema.parse(req.body);

    // Generate text using Gemini
    const result = await defaultModel.generateContent(validatedData.prompt);
    const response = await result.response;

    const generatedText = response.text();
    const promptTokens = estimateTokenCount(validatedData.prompt);
    const completionTokens = estimateTokenCount(generatedText);

    res.json({
      text: generatedText,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
    });
  } catch (error) {
    console.error('Error generating text:', error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid request data',
        details: error.errors,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Add a root route handler
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Backend API server is running',
    endpoints: {
      health: '/health',
      auth: '/auth/*',
      generate: '/api/generate-text'
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 