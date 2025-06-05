import { z } from 'zod';
import type { Database } from './supabase';

// Database types for easier access
export type Tables = Database['public']['Tables'];
export type DbUser = Tables['users']['Row'];
export type DbProfile = Tables['profiles']['Row'];

// Base model with common fields
export const BaseModel = z.object({
    id: z.string().uuid(),
    created_at: z.string().or(z.date()).transform(val => 
        typeof val === 'string' ? new Date(val) : val
    ),
    updated_at: z.string().or(z.date()).transform(val => 
        typeof val === 'string' ? new Date(val) : val
    ),
});

// Project Model
export const ProjectModel = BaseModel.extend({
    user_id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    engine: z.enum(['unity', 'godot']),
    status: z.enum(['draft', 'generating', 'completed', 'failed']),
    settings: z.record(z.any()).optional(),
});

// Asset Model
export const AssetModel = BaseModel.extend({
    project_id: z.string().uuid(),
    type: z.enum(['sprite', 'background', 'audio', 'script']),
    filename: z.string(),
    file_path: z.string(),
    metadata: z.record(z.any()).optional(),
    status: z.enum(['pending', 'processing', 'completed', 'failed']),
});

// Export Model
export const ExportModel = BaseModel.extend({
    project_id: z.string().uuid(),
    version: z.string(),
    status: z.enum(['pending', 'processing', 'completed', 'failed']),
    download_url: z.string().optional(),
    file_size: z.number().optional(),
    metadata: z.record(z.any()).optional(),
});

// Story Model
export const StoryModel = BaseModel.extend({
    project_id: z.string().uuid(),
    title: z.string(),
    content: z.record(z.any()),
    version: z.number().default(1),
    status: z.enum(['draft', 'review', 'approved']).default('draft'),
});

// User Model (extends Supabase Auth)
export const UserModel = BaseModel.extend({
    auth_user_id: z.string().uuid(),
    email: z.string().email(),
    display_name: z.string(),
    avatar_url: z.string().optional().nullable(),
    settings: z.record(z.any()).optional().nullable(),
});

// Type Exports
export type Project = z.infer<typeof ProjectModel>;
export type Asset = z.infer<typeof AssetModel>;
export type Export = z.infer<typeof ExportModel>;
export type Story = z.infer<typeof StoryModel>;
export type User = z.infer<typeof UserModel>;

// Validation Functions
export const validateProject = (data: unknown): Project => ProjectModel.parse(data);
export const validateAsset = (data: unknown): Asset => AssetModel.parse(data);
export const validateExport = (data: unknown): Export => ExportModel.parse(data);
export const validateStory = (data: unknown): Story => StoryModel.parse(data);
export const validateUser = (data: unknown): User => UserModel.parse(data); 