"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("@google-cloud/functions-framework"));
const google_cloud_1 = require("../config/google-cloud");
const zod_1 = require("zod");
const requestSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1).max(1000),
    temperature: zod_1.z.number().min(0).max(1).optional().default(0.7),
    maxTokens: zod_1.z.number().min(1).max(2048).optional().default(1024),
});
// Helper function to estimate token count
function estimateTokenCount(text) {
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
        const validatedData = requestSchema.parse(req.body);
        // Generate text using Gemini
        const result = await google_cloud_1.defaultModel.generateContent(validatedData.prompt);
        const response = await result.response;
        const generatedText = response.text();
        const promptTokens = estimateTokenCount(validatedData.prompt);
        const completionTokens = estimateTokenCount(generatedText);
        const responseData = {
            text: generatedText,
            usage: {
                promptTokens,
                completionTokens,
                totalTokens: promptTokens + completionTokens,
            },
        };
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error('Error generating text:', error);
        if (error instanceof zod_1.z.ZodError) {
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
