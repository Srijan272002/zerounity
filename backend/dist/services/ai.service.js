"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const sharp_1 = __importDefault(require("sharp"));
const ai_config_1 = require("../config/ai.config");
const promises_1 = require("fs/promises");
class AIService {
    constructor() { }
    static getInstance() {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }
    async generateText(prompt) {
        try {
            const model = (0, ai_config_1.getModel)();
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Error generating text:', error);
            throw new Error('Failed to generate text');
        }
    }
    async generateCode(prompt, language) {
        try {
            const model = (0, ai_config_1.getModel)();
            const formattedPrompt = language
                ? `Generate code in ${language} for: ${prompt}`
                : `Generate code for: ${prompt}`;
            const result = await model.generateContent(formattedPrompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Error generating code:', error);
            throw new Error('Failed to generate code');
        }
    }
    async processImage(imagePath) {
        try {
            const imageBuffer = await (0, promises_1.readFile)(imagePath);
            const processedImage = await (0, sharp_1.default)(imageBuffer)
                .resize(2000, 2000, { fit: 'inside' }) // Ensure image is within Gemini's limits
                .toBuffer();
            return {
                data: processedImage.toString('base64'),
                mimeType: 'image/jpeg'
            };
        }
        catch (error) {
            console.error('Error processing image:', error);
            throw new Error('Failed to process image');
        }
    }
    async analyzeImage(imagePath, prompt) {
        try {
            const model = (0, ai_config_1.getVisionModel)();
            const imageData = await this.processImage(imagePath);
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: imageData }] }]
            });
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Error analyzing image:', error);
            throw new Error('Failed to analyze image');
        }
    }
    async generateWebApp(specification) {
        try {
            const model = (0, ai_config_1.getModel)();
            const prompt = `Generate a complete web application based on the following specification. 
        Include all necessary components, routing, and styling. 
        Specification: ${specification}`;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Error generating web app:', error);
            throw new Error('Failed to generate web app');
        }
    }
    async streamResponse(prompt, onChunk) {
        try {
            const model = (0, ai_config_1.getModel)();
            const result = await model.generateContentStream(prompt);
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                onChunk(chunkText);
            }
        }
        catch (error) {
            console.error('Error streaming response:', error);
            throw new Error('Failed to stream response');
        }
    }
}
exports.AIService = AIService;
