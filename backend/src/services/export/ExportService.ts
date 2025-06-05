import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const execAsync = promisify(exec);

interface AssetMetadata {
    filename: string;
    hash: string;
    size: number;
    type: string;
}

interface ExportManifest {
    id: string;
    timestamp: string;
    assets: AssetMetadata[];
    totalSize: number;
    version: string;
}

export class ExportService {
    private exportsPath: string;
    private bundlesPath: string;
    private tempPath: string;

    constructor() {
        this.exportsPath = path.join(process.cwd(), 'exports');
        this.bundlesPath = path.join(process.cwd(), 'bundles');
        this.tempPath = path.join(process.cwd(), 'temp');
    }

    async initializeDirectories() {
        await fs.mkdir(this.exportsPath, { recursive: true });
        await fs.mkdir(this.bundlesPath, { recursive: true });
        await fs.mkdir(this.tempPath, { recursive: true });
    }

    async generateZip(sourcePath: string, outputPath: string): Promise<string> {
        // Ensure output directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        // Generate ZIP file
        await execAsync(`cd "${sourcePath}" && zip -r "${outputPath}" ./*`);

        // Validate ZIP file
        await this.validateZipFile(outputPath);

        return outputPath;
    }

    async bundleAssets(assets: string[], bundleName: string): Promise<string> {
        const bundlePath = path.join(this.bundlesPath, `${bundleName}.bundle`);
        const tempBundleDir = path.join(this.tempPath, crypto.randomUUID());
        
        try {
            // Create temporary directory for bundling
            await fs.mkdir(tempBundleDir, { recursive: true });

            // Copy assets to temp directory with metadata
            const metadata: AssetMetadata[] = [];
            let totalSize = 0;

            for (const asset of assets) {
                const assetStats = await fs.stat(asset);
                const hash = await this.generateFileHash(asset);
                const filename = path.basename(asset);
                
                // Copy asset to temp directory
                await fs.copyFile(asset, path.join(tempBundleDir, filename));

                metadata.push({
                    filename,
                    hash,
                    size: assetStats.size,
                    type: path.extname(asset).slice(1)
                });

                totalSize += assetStats.size;
            }

            // Create manifest
            const manifest: ExportManifest = {
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                assets: metadata,
                totalSize,
                version: '1.0'
            };

            // Write manifest
            await fs.writeFile(
                path.join(tempBundleDir, 'manifest.json'),
                JSON.stringify(manifest, null, 2)
            );

            // Create bundle
            await this.generateZip(tempBundleDir, bundlePath);

            return bundlePath;
        } finally {
            // Cleanup temp directory
            await fs.rm(tempBundleDir, { recursive: true, force: true });
        }
    }

    async validateExport(exportPath: string): Promise<boolean> {
        try {
            // Check if file exists
            await fs.access(exportPath);

            // Check if it's a valid ZIP file
            await this.validateZipFile(exportPath);

            // If it's a bundle, validate manifest
            if (exportPath.endsWith('.bundle')) {
                const tempExtractDir = path.join(this.tempPath, crypto.randomUUID());
                try {
                    // Extract bundle
                    await execAsync(`unzip -q "${exportPath}" -d "${tempExtractDir}"`);

                    // Read and validate manifest
                    const manifestPath = path.join(tempExtractDir, 'manifest.json');
                    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

                    // Validate each asset
                    for (const asset of manifest.assets) {
                        const assetPath = path.join(tempExtractDir, asset.filename);
                        const hash = await this.generateFileHash(assetPath);
                        
                        if (hash !== asset.hash) {
                            throw new Error(`Asset integrity check failed for ${asset.filename}`);
                        }
                    }
                } finally {
                    await fs.rm(tempExtractDir, { recursive: true, force: true });
                }
            }

            return true;
        } catch (error) {
            console.error('Export validation failed:', error);
            return false;
        }
    }

    async getDownloadUrl(exportId: string): Promise<string> {
        const exportPath = path.join(this.exportsPath, exportId);
        
        // Validate export exists and is valid
        if (!(await this.validateExport(exportPath))) {
            throw new Error('Invalid or corrupted export');
        }

        // In a real implementation, you might:
        // 1. Generate a signed URL
        // 2. Create a temporary download token
        // 3. Set up proper authentication
        
        // For now, we'll return a simple path
        return `/downloads/${exportId}`;
    }

    private async validateZipFile(zipPath: string): Promise<void> {
        try {
            // Test ZIP file integrity
            await execAsync(`unzip -t "${zipPath}"`);
        } catch (error) {
            throw new Error('Invalid ZIP file');
        }
    }

    private async generateFileHash(filePath: string): Promise<string> {
        const content = await fs.readFile(filePath);
        return crypto.createHash('sha256').update(content).digest('hex');
    }
} 