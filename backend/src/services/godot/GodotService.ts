import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export class GodotService {
    private templatePath: string;
    private projectsPath: string;

    constructor() {
        this.templatePath = path.join(process.cwd(), 'templates', 'godot');
        this.projectsPath = path.join(process.cwd(), 'projects', 'godot');
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

    async injectGDScript(projectName: string, targetScript: string, codeToInject: string, injectionPoint: string) {
        const projectDir = path.join(this.projectsPath, projectName);
        const scriptPath = path.join(projectDir, 'scripts', targetScript);

        let scriptContent = await fs.readFile(scriptPath, 'utf-8');
        scriptContent = scriptContent.replace(injectionPoint, codeToInject);
        
        await fs.writeFile(scriptPath, scriptContent);
    }

    async generateScene(projectName: string, sceneName: string, sceneConfig: any) {
        const projectDir = path.join(this.projectsPath, projectName);
        const scenePath = path.join(projectDir, 'scenes', `${sceneName}.tscn`);

        // Generate scene content based on configuration
        const sceneContent = this.generateSceneContent(sceneConfig);
        await fs.writeFile(scenePath, sceneContent);

        return scenePath;
    }

    private generateSceneContent(config: any): string {
        // Basic Godot scene structure
        return `[gd_scene format=3 uid="uid://example"]

[node name="Root" type="Node2D"]
${this.generateSceneNodes(config)}`;
    }

    private generateSceneNodes(config: any, indent: string = ''): string {
        if (!config.nodes) return '';

        return config.nodes.map((node: any) => {
            const nodeStr = `${indent}[node name="${node.name}" type="${node.type}"]\n`;
            const properties = node.properties ? 
                Object.entries(node.properties)
                    .map(([key, value]) => `${indent}${key} = ${value}`)
                    .join('\n') + '\n'
                : '';
            const children = node.children ? 
                this.generateSceneNodes(node.children, indent + '\t') : '';
            
            return nodeStr + properties + children;
        }).join('\n');
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