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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
// Load environment variables before any other imports
dotenv.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const google_cloud_1 = require("./config/google-cloud");
const zod_1 = require("zod");
const auth_1 = __importDefault(require("./routes/auth"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const narrative_1 = __importDefault(require("./routes/narrative"));
const code_synthesis_1 = __importDefault(require("./routes/code-synthesis"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    abortOnLimit: true,
}));
// Auth routes
app.use('/auth', auth_1.default);
app.use('/api/ai', ai_routes_1.default);
app.use('/api/narrative', narrative_1.default);
app.use('/api/code-synthesis', code_synthesis_1.default);
const requestSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1).max(1000),
    temperature: zod_1.z.number().min(0).max(1).optional().default(0.7),
    maxTokens: zod_1.z.number().min(1).max(2048).optional().default(1024),
});
// Helper function to estimate token count
function estimateTokenCount(text) {
    return Math.ceil(text.length / 4);
}
// Text generation endpoint
app.post('/api/generate-text', async (req, res) => {
    try {
        // Validate request body
        const validatedData = requestSchema.parse(req.body);
        // Generate text using Gemini
        const result = await google_cloud_1.defaultModel.generateContent(validatedData.prompt);
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
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
