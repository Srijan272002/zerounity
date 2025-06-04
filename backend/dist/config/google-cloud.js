"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visionModel = exports.defaultModel = exports.genAI = void 0;
const generative_ai_1 = require("@google/generative-ai");
if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY environment variable');
}
// Initialize Gemini AI
exports.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Default model configuration
exports.defaultModel = exports.genAI.getGenerativeModel({ model: 'gemini-pro' });
// Configuration for the vision model
exports.visionModel = exports.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
