"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const ai_config_1 = require("../config/ai.config");
const ai_service_1 = require("../services/ai.service");
const promises_1 = __importDefault(require("fs/promises"));
const os_1 = __importDefault(require("os"));
const router = (0, express_1.Router)();
const aiService = ai_service_1.AIService.getInstance();
// Apply rate limiting
const limiter = (0, express_rate_limit_1.default)(ai_config_1.rateLimitConfig);
router.use(limiter);
// Configure file upload
router.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    useTempFiles: true,
    tempFileDir: os_1.default.tmpdir()
}));
// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('AI Service Error:', err);
    res.status(500).json({
        error: err.message || 'Internal server error',
        status: 'error'
    });
};
// Text generation endpoint
router.post('/generate/text', async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        const result = await aiService.generateText(prompt);
        res.json({ result });
    }
    catch (error) {
        next(error);
    }
});
// Code generation endpoint
router.post('/generate/code', async (req, res, next) => {
    try {
        const { prompt, language } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        const result = await aiService.generateCode(prompt, language);
        res.json({ result });
    }
    catch (error) {
        next(error);
    }
});
// Image analysis endpoint
router.post('/analyze/image', async (req, res, next) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        const image = req.files.image;
        const result = await aiService.analyzeImage(image.tempFilePath, prompt);
        // Clean up temp file
        await promises_1.default.unlink(image.tempFilePath);
        res.json({ result });
    }
    catch (error) {
        next(error);
    }
});
// Web app generation endpoint
router.post('/generate/webapp', async (req, res, next) => {
    try {
        const { specification } = req.body;
        if (!specification) {
            return res.status(400).json({ error: 'Specification is required' });
        }
        const result = await aiService.generateWebApp(specification);
        res.json({ result });
    }
    catch (error) {
        next(error);
    }
});
// Streaming response endpoint
router.post('/stream', async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        await aiService.streamResponse(prompt, (chunk) => {
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        });
        res.end();
    }
    catch (error) {
        next(error);
    }
});
router.use(errorHandler);
exports.default = router;
