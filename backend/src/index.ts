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
import gamesRoutes from './routes/games';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  abortOnLimit: true,
}));

// Serve static files from the public directory
app.use('/assets', express.static(path.join(__dirname, '../../public/assets')));

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('error', (error) => {
    console.error('Socket error:', socket.id, error);
  });

  socket.on('start_generation', async (data) => {
    try {
      const { sessionId, data: generationData } = data;
      console.log('Starting generation:', sessionId, {
        prompt: generationData.prompt,
        gameType: generationData.gameType
      });

      // Send initial status
      socket.emit('status_update', {
        type: 'status_update',
        data: {
          agents: [
            { id: 'narrative', name: 'Narrative Generation', status: 'in_progress', progress: 0 },
            { id: 'code', name: 'Code Generation', status: 'waiting', progress: 0 },
            { id: 'asset', name: 'Asset Generation', status: 'waiting', progress: 0 }
          ],
          currentAgent: 'narrative',
          steps: [
            {
              id: 'init',
              name: 'Initialization',
              description: 'Setting up the generation environment',
              status: 'in_progress',
              retryCount: 0
            },
            {
              id: 'narrative',
              name: 'Story Generation',
              description: 'Creating game narrative and mechanics',
              status: 'waiting',
              retryCount: 0
            }
          ],
          currentStep: 'init'
        }
      });

      // Simulate initialization progress
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update initialization complete
      socket.emit('status_update', {
        type: 'status_update',
        data: {
          agents: [
            { id: 'narrative', name: 'Narrative Generation', status: 'in_progress', progress: 20 },
            { id: 'code', name: 'Code Generation', status: 'waiting', progress: 0 },
            { id: 'asset', name: 'Asset Generation', status: 'waiting', progress: 0 }
          ],
          currentAgent: 'narrative',
          steps: [
            {
              id: 'init',
              name: 'Initialization',
              description: 'Setting up the generation environment',
              status: 'completed',
              retryCount: 0
            },
            {
              id: 'narrative',
              name: 'Story Generation',
              description: 'Creating game narrative and mechanics',
              status: 'in_progress',
              retryCount: 0
            }
          ],
          currentStep: 'narrative'
        }
      });

      // Simulate narrative generation progress
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update narrative progress
      socket.emit('status_update', {
        type: 'status_update',
        data: {
          agents: [
            { id: 'narrative', name: 'Narrative Generation', status: 'completed', progress: 100 },
            { id: 'code', name: 'Code Generation', status: 'in_progress', progress: 0 },
            { id: 'asset', name: 'Asset Generation', status: 'waiting', progress: 0 }
          ],
          currentAgent: 'code',
          steps: [
            {
              id: 'init',
              name: 'Initialization',
              description: 'Setting up the generation environment',
              status: 'completed',
              retryCount: 0
            },
            {
              id: 'narrative',
              name: 'Story Generation',
              description: 'Creating game narrative and mechanics',
              status: 'completed',
              retryCount: 0
            }
          ],
          currentStep: 'code'
        }
      });

      // Simulate completion
      await new Promise(resolve => setTimeout(resolve, 1000));

      socket.emit('generation_complete', {
        type: 'generation_complete',
        data: {
          success: true,
          message: 'Game generated successfully'
        }
      });

    } catch (error) {
      console.error('Generation error:', error);
      socket.emit('error', {
        type: 'error',
        data: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          recoverable: false
        }
      });
    }
  });

  socket.on('cancel_generation', (data) => {
    const { sessionId } = data;
    console.log('Cancelling generation:', sessionId);
    // TODO: Implement cancellation logic
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Auth routes
app.use('/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/narrative', narrativeRoutes);
app.use('/api/code-synthesis', codeSynthesisRoutes);
app.use('/api/games', gamesRoutes);

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

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 