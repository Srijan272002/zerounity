import { z } from 'zod';

// Base model with common fields
const BaseModel = z.object({
    id: z.string().uuid(),
    created_at: z.date(),
    updated_at: z.date(),
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
    auth_id: z.string(),
    email: z.string().email(),
    display_name: z.string(),
    avatar_url: z.string().optional(),
    settings: z.record(z.any()).optional(),
});

// Types
export type Project = z.infer<typeof ProjectModel>;
export type Asset = z.infer<typeof AssetModel>;
export type Export = z.infer<typeof ExportModel>;
export type Story = z.infer<typeof StoryModel>;
export type User = z.infer<typeof UserModel>; 