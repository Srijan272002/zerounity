import { GenerativeContentBlob } from '@google/generative-ai';
import sharp from 'sharp';
import { getModel, getVisionModel, geminiConfig } from '../config/ai.config';
import { readFile } from 'fs/promises';
import { GenerationController } from './ai/GenerationController';

export class AIService {
  private static instance: AIService;
  private generationController: GenerationController;

  private constructor() {
    this.generationController = GenerationController.getInstance();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateText(prompt: string, generationId: string) {
    try {
      const model = getModel();
      const result = await model.generateContent(prompt);
      
      // Register the generation for potential cancellation
      const abortController = new AbortController();
      this.generationController.registerGeneration(generationId, () => {
        abortController.abort();
      });

      try {
        const response = await result.response;
        this.generationController.completeGeneration(generationId);
        return response.text();
      } catch (error) {
        if (abortController.signal.aborted) {
          throw new Error('Generation cancelled');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text');
    }
  }

  async generateCode(prompt: string, language?: string, generationId?: string) {
    try {
      const model = getModel();
      const formattedPrompt = language 
        ? `Generate code in ${language} for: ${prompt}`
        : `Generate code for: ${prompt}`;
      
      const abortController = new AbortController();
      if (generationId) {
        this.generationController.registerGeneration(generationId, () => {
          abortController.abort();
        });
      }

      try {
        const result = await model.generateContent(formattedPrompt);
        const response = await result.response;
        if (generationId) {
          this.generationController.completeGeneration(generationId);
        }
        return response.text();
      } catch (error) {
        if (abortController.signal.aborted) {
          throw new Error('Generation cancelled');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error generating code:', error);
      throw new Error('Failed to generate code');
    }
  }

  async processImage(imagePath: string): Promise<GenerativeContentBlob> {
    try {
      const imageBuffer = await readFile(imagePath);
      const processedImage = await sharp(imageBuffer)
        .resize(2000, 2000, { fit: 'inside' })
        .toBuffer();
      
      return {
        data: processedImage.toString('base64'),
        mimeType: 'image/jpeg'
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  async analyzeImage(imagePath: string, prompt: string, generationId?: string) {
    try {
      const model = getVisionModel();
      const imageData = await this.processImage(imagePath);
      
      const abortController = new AbortController();
      if (generationId) {
        this.generationController.registerGeneration(generationId, () => {
          abortController.abort();
        });
      }

      try {
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: imageData }] }]
        });
        const response = await result.response;
        if (generationId) {
          this.generationController.completeGeneration(generationId);
        }
        return response.text();
      } catch (error) {
        if (abortController.signal.aborted) {
          throw new Error('Generation cancelled');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async generateWebApp(specification: string, generationId?: string) {
    try {
      const model = getModel();
      const prompt = `Generate a complete web application based on the following specification. 
        Include all necessary components, routing, and styling. 
        Specification: ${specification}`;
      
      const abortController = new AbortController();
      if (generationId) {
        this.generationController.registerGeneration(generationId, () => {
          abortController.abort();
        });
      }

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        if (generationId) {
          this.generationController.completeGeneration(generationId);
        }
        return response.text();
      } catch (error) {
        if (abortController.signal.aborted) {
          throw new Error('Generation cancelled');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error generating web app:', error);
      throw new Error('Failed to generate web app');
    }
  }

  async streamResponse(prompt: string, onChunk: (chunk: string) => void, generationId?: string) {
    try {
      const model = getModel();
      const abortController = new AbortController();
      
      if (generationId) {
        this.generationController.registerGeneration(generationId, () => {
          abortController.abort();
        });
      }

      try {
        const result = await model.generateContentStream(prompt);
        
        for await (const chunk of result.stream) {
          if (abortController.signal.aborted) {
            throw new Error('Generation cancelled');
          }
          const chunkText = chunk.text();
          onChunk(chunkText);
        }

        if (generationId) {
          this.generationController.completeGeneration(generationId);
        }
      } catch (error) {
        if (abortController.signal.aborted) {
          throw new Error('Generation cancelled');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      throw new Error('Failed to stream response');
    }
  }
} 