import express from 'express';
import { UnityService } from '../services/unity/UnityService';
import { z } from 'zod';

const router = express.Router();
const unityService = new UnityService();

// Initialize Unity directories
unityService.initializeDirectories().catch(console.error);

// Schema validation
const createProjectSchema = z.object({
    projectName: z.string(),
    templateName: z.string(),
});

const injectCodeSchema = z.object({
    projectName: z.string(),
    targetScript: z.string(),
    codeToInject: z.string(),
    injectionPoint: z.string(),
});

const packageAssetsSchema = z.object({
    projectName: z.string(),
    outputPath: z.string(),
});

// Routes
router.post('/project', async (req, res) => {
    try {
        const { projectName, templateName } = createProjectSchema.parse(req.body);
        const projectPath = await unityService.createProject(projectName, templateName);
        res.json({ success: true, projectPath });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
    }
});

router.post('/inject', async (req, res) => {
    try {
        const { projectName, targetScript, codeToInject, injectionPoint } = injectCodeSchema.parse(req.body);
        await unityService.injectCode(projectName, targetScript, codeToInject, injectionPoint);
        res.json({ success: true });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
    }
});

router.post('/package', async (req, res) => {
    try {
        const { projectName, outputPath } = packageAssetsSchema.parse(req.body);
        await unityService.packageAssets(projectName, outputPath);
        res.json({ success: true, outputPath });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
    }
});

export default router; 