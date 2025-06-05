import express from 'express';
import { GodotService } from '../services/godot/GodotService';
import { z } from 'zod';

const router = express.Router();
const godotService = new GodotService();

// Initialize Godot directories
godotService.initializeDirectories().catch(console.error);

// Schema validation
const createProjectSchema = z.object({
    projectName: z.string(),
    templateName: z.string(),
});

const injectGDScriptSchema = z.object({
    projectName: z.string(),
    targetScript: z.string(),
    codeToInject: z.string(),
    injectionPoint: z.string(),
});

const generateSceneSchema = z.object({
    projectName: z.string(),
    sceneName: z.string(),
    sceneConfig: z.object({
        nodes: z.array(z.object({
            name: z.string(),
            type: z.string(),
            properties: z.record(z.string(), z.any()).optional(),
            children: z.array(z.any()).optional(),
        })),
    }),
});

// Routes
router.post('/project', async (req, res) => {
    try {
        const { projectName, templateName } = createProjectSchema.parse(req.body);
        const projectPath = await godotService.createProject(projectName, templateName);
        res.json({ success: true, projectPath });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
    }
});

router.post('/inject', async (req, res) => {
    try {
        const { projectName, targetScript, codeToInject, injectionPoint } = injectGDScriptSchema.parse(req.body);
        await godotService.injectGDScript(projectName, targetScript, codeToInject, injectionPoint);
        res.json({ success: true });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
    }
});

router.post('/scene', async (req, res) => {
    try {
        const { projectName, sceneName, sceneConfig } = generateSceneSchema.parse(req.body);
        const scenePath = await godotService.generateScene(projectName, sceneName, sceneConfig);
        res.json({ success: true, scenePath });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
    }
});

export default router; 