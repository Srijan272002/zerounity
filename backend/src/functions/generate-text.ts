import * as functions from '@google-cloud/functions-framework';
import { defaultModel } from '../config/google-cloud';
import { z } from 'zod';

const requestSchema = z.object({
  prompt: z.string().min(1).max(1000),
  temperature: z.number().min(0).max(1).optional().default(0.7),
  maxTokens: z.number().min(1).max(2048).optional().default(1024),
});

interface GenerateTextRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

interface GenerateTextResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Helper function to estimate token count
function estimateTokenCount(text: string): number {
  // A rough estimation: average of 4 characters per token
  return Math.ceil(text.length / 4);
}

functions.http('generateText', async (req, res) => {
  try {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send('');
      return;
    }

    // Validate request method
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // Validate request body
    const validatedData = requestSchema.parse(req.body) as GenerateTextRequest;

    // Generate text using Gemini
    const result = await defaultModel.generateContent(validatedData.prompt);
    const response = await result.response;

    const generatedText = response.text();
    const promptTokens = estimateTokenCount(validatedData.prompt);
    const completionTokens = estimateTokenCount(generatedText);

    const responseData: GenerateTextResponse = {
      text: generatedText,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
    };

    res.status(200).json(responseData);
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