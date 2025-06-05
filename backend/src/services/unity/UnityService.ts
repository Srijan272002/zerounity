import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export class UnityService {
    private templatePath: string;
    private projectsPath: string;

    constructor() {
        this.templatePath = path.join(process.cwd(), 'templates', 'unity');
        this.projectsPath = path.join(process.cwd(), 'projects', 'unity');
    }

    async initializeDirectories() {
        await fs.mkdir(this.templatePath, { recursive: true });
        await fs.mkdir(this.projectsPath, { recursive: true });
    }

    async createProject(projectName: string, templateName: string) {
        const templateDir = path.join(this.templatePath, templateName);
        const projectDir = path.join(this.projectsPath, projectName);

        // Check if template exists
        const templateExists = await fs.access(templateDir).then(() => true).catch(() => false);
        if (!templateExists) {
            throw new Error(`Template ${templateName} does not exist`);
        }

        // Create project directory
        await fs.mkdir(projectDir, { recursive: true });

        // Copy template to project directory
        await this.copyDirectory(templateDir, projectDir);

        return projectDir;
    }

    async injectCode(projectName: string, targetScript: string, codeToInject: string, injectionPoint: string) {
        const projectDir = path.join(this.projectsPath, projectName);
        const scriptPath = path.join(projectDir, 'Assets', 'Scripts', targetScript);

        let scriptContent = await fs.readFile(scriptPath, 'utf-8');
        scriptContent = scriptContent.replace(injectionPoint, codeToInject);
        
        await fs.writeFile(scriptPath, scriptContent);
    }

    async packageAssets(projectName: string, outputPath: string) {
        const projectDir = path.join(this.projectsPath, projectName);
        const assetsDir = path.join(projectDir, 'Assets');

        // Create a zip file containing the assets
        // Implementation depends on the specific packaging requirements
        // This is a placeholder for the actual implementation
        await execAsync(`cd "${assetsDir}" && zip -r "${outputPath}" ./*`);
    }

    private async copyDirectory(src: string, dest: string) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }
} 