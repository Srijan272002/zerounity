"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const code_synthesis_1 = require("../services/code-synthesis");
const router = express_1.default.Router();
const unityGenerator = new code_synthesis_1.UnityGenerator();
const godotGenerator = new code_synthesis_1.GodotGenerator();
// Generate code for either Unity or Godot
router.post('/generate', async (req, res) => {
    try {
        const request = {
            engine: req.body.engine,
            category: req.body.category,
            parameters: req.body.parameters || {},
            customization: req.body.customization
        };
        if (!['unity', 'godot'].includes(request.engine)) {
            return res.status(400).json({ error: 'Invalid engine specified' });
        }
        const generator = request.engine === 'unity' ? unityGenerator : godotGenerator;
        const result = generator.generateCode(request);
        res.json(result);
    }
    catch (error) {
        console.error('Error generating code:', error);
        res.status(500).json({ error: 'Failed to generate code' });
    }
});
// Get available templates for an engine
router.get('/templates/:engine', (req, res) => {
    try {
        const { engine } = req.params;
        if (!['unity', 'godot'].includes(engine)) {
            return res.status(400).json({ error: 'Invalid engine specified' });
        }
        const generator = engine === 'unity' ? unityGenerator : godotGenerator;
        const templates = generator.getAllTemplates();
        res.json(templates);
    }
    catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});
// Get a specific template
router.get('/templates/:engine/:id', (req, res) => {
    try {
        const { engine, id } = req.params;
        if (!['unity', 'godot'].includes(engine)) {
            return res.status(400).json({ error: 'Invalid engine specified' });
        }
        const generator = engine === 'unity' ? unityGenerator : godotGenerator;
        const template = generator.getTemplate(id);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }
        res.json(template);
    }
    catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).json({ error: 'Failed to fetch template' });
    }
});
// Add a new template
router.post('/templates/:engine', (req, res) => {
    try {
        const { engine } = req.params;
        if (!['unity', 'godot'].includes(engine)) {
            return res.status(400).json({ error: 'Invalid engine specified' });
        }
        const generator = engine === 'unity' ? unityGenerator : godotGenerator;
        const template = req.body;
        if (template.engine !== engine) {
            return res.status(400).json({ error: 'Template engine mismatch' });
        }
        generator.addTemplate(template);
        res.json({ message: 'Template added successfully', template });
    }
    catch (error) {
        console.error('Error adding template:', error);
        res.status(500).json({ error: 'Failed to add template' });
    }
});
exports.default = router;
