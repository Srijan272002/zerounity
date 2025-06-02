import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

// Initialize Gemini AI
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Default model configuration
export const defaultModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Configuration for the vision model
export const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' }); 