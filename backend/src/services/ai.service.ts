import { GenerativeContentBlob } from '@google/generative-ai';
import sharp from 'sharp';
import { getModel, getVisionModel, geminiConfig } from '../config/ai.config';
import { readFile } from 'fs/promises';

export class AIService {
  private static instance: AIService;
  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateText(prompt: string) {
    try {
      const model = getModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text');
    }
  }

  async generateCode(prompt: string, language?: string) {
    try {
      const model = getModel();
      const formattedPrompt = language 
        ? `Generate code in ${language} for: ${prompt}`
        : `Generate code for: ${prompt}`;
      
      const result = await model.generateContent(formattedPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating code:', error);
      throw new Error('Failed to generate code');
    }
  }

  async processImage(imagePath: string): Promise<GenerativeContentBlob> {
    try {
      const imageBuffer = await readFile(imagePath);
      const processedImage = await sharp(imageBuffer)
        .resize(2000, 2000, { fit: 'inside' }) // Ensure image is within Gemini's limits
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

  async analyzeImage(imagePath: string, prompt: string) {
    try {
      const model = getVisionModel();
      const imageData = await this.processImage(imagePath);
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: imageData }] }]
      });
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async generateWebApp(specification: string) {
    try {
      const model = getModel();
      const prompt = `Generate a complete web application based on the following specification. 
        Include all necessary components, routing, and styling. 
        Specification: ${specification}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating web app:', error);
      throw new Error('Failed to generate web app');
    }
  }

  async streamResponse(prompt: string, onChunk: (chunk: string) => void) {
    try {
      const model = getModel();
      const result = await model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        onChunk(chunkText);
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      throw new Error('Failed to stream response');
    }
  }
} 