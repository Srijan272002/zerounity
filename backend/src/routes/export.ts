import express from 'express';
import { ExportService } from '../services/export/ExportService';
import { z } from 'zod';
import path from 'path';

const router = express.Router();
const exportService = new ExportService();

// Initialize export directories
exportService.initializeDirectories().catch(console.error);

// Schema validation
const generateZipSchema = z.object({
    sourcePath: z.string(),
    outputName: z.string(),
});

const bundleAssetsSchema = z.object({
    assets: z.array(z.string()),
    bundleName: z.string(),
});

const getDownloadSchema = z.object({
    exportId: z.string(),
});

// Routes
router.post('/zip', async (req, res) => {
    try {
        const { sourcePath, outputName } = generateZipSchema.parse(req.body);
        const outputPath = path.join('exports', `${outputName}.zip`);
        
        const zipPath = await exportService.generateZip(sourcePath, outputPath);
        res.json({ success: true, zipPath });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
    }
});

router.post('/bundle', async (req, res) => {
    try {
        const { assets, bundleName } = bundleAssetsSchema.parse(req.body);
        const bundlePath = await exportService.bundleAssets(assets, bundleName);
        res.json({ success: true, bundlePath });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
    }
});

router.get('/download/:exportId', async (req, res) => {
    try {
        const { exportId } = getDownloadSchema.parse(req.params);
        const downloadUrl = await exportService.getDownloadUrl(exportId);
        res.json({ success: true, downloadUrl });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
    }
});

router.post('/validate', async (req, res) => {
    try {
        const { exportPath } = z.object({ exportPath: z.string() }).parse(req.body);
        const isValid = await exportService.validateExport(exportPath);
        res.json({ success: true, isValid });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
    }
});

export default router; 