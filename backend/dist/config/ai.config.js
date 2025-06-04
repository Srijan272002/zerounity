"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisionModel = exports.getModel = exports.ai = exports.rateLimitConfig = exports.geminiConfig = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
}
exports.geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY,
    modelName: 'gemini-pro',
    modelNameVision: 'gemini-pro-vision',
    maxOutputTokens: 2048,
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    safetySettings: [
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ],
};
exports.rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
};
exports.ai = new generative_ai_1.GoogleGenerativeAI(exports.geminiConfig.apiKey);
const getModel = () => exports.ai.getGenerativeModel({ model: exports.geminiConfig.modelName });
exports.getModel = getModel;
const getVisionModel = () => exports.ai.getGenerativeModel({ model: exports.geminiConfig.modelNameVision });
exports.getVisionModel = getVisionModel;
