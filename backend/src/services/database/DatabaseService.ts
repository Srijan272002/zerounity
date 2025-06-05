import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Redis } from 'ioredis';
import { Project, Asset, Export, Story, User } from '../../models';

export class DatabaseService {
    private supabase: SupabaseClient;
    private redis: Redis | null = null;
    private cacheEnabled: boolean;
    private cacheTTL: number = 300; // 5 minutes default

    constructor() {
        // Initialize Supabase client
        this.supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
        );

        // Initialize Redis if enabled
        this.cacheEnabled = process.env.CACHE_ENABLED === 'true';
        if (this.cacheEnabled) {
            try {
                this.redis = new Redis(process.env.REDIS_URL!);
                // Handle Redis connection errors
                this.redis.on('error', (error) => {
                    console.error('Redis connection error:', error);
                    this.cacheEnabled = false;
                    this.redis = null;
                });
            } catch (error) {
                console.error('Failed to initialize Redis:', error);
                this.cacheEnabled = false;
                this.redis = null;
            }
        }
    }

    // Project Methods
    async createProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
        const { data: project, error } = await this.supabase
            .from('projects')
            .insert(data)
            .single();

        if (error) throw error;
        return project as Project;
    }

    async getProject(id: string): Promise<Project | null> {
        // Try cache first
        if (this.cacheEnabled && this.redis) {
            const cached = await this.getFromCache<Project>(`project:${id}`);
            if (cached) return cached;
        }

        const { data: project, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (project && this.cacheEnabled && this.redis) {
            await this.setInCache(`project:${id}`, project);
        }

        return project as Project | null;
    }

    async getUserProjects(userId: string): Promise<Project[]> {
        const cacheKey = `user:${userId}:projects`;
        
        if (this.cacheEnabled && this.redis) {
            const cached = await this.getFromCache<Project[]>(cacheKey);
            if (cached) return cached;
        }

        const { data: projects, error } = await this.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (projects && this.cacheEnabled && this.redis) {
            await this.setInCache(cacheKey, projects);
        }

        return projects as Project[];
    }

    // Asset Methods
    async createAsset(data: Omit<Asset, 'id' | 'created_at' | 'updated_at'>): Promise<Asset> {
        const { data: asset, error } = await this.supabase
            .from('assets')
            .insert(data)
            .single();

        if (error) throw error;
        await this.invalidateCache(`project:${data.project_id}:assets`);
        return asset as Asset;
    }

    async getProjectAssets(projectId: string): Promise<Asset[]> {
        const cacheKey = `project:${projectId}:assets`;
        
        if (this.cacheEnabled && this.redis) {
            const cached = await this.getFromCache<Asset[]>(cacheKey);
            if (cached) return cached;
        }

        const { data: assets, error } = await this.supabase
            .from('assets')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (assets && this.cacheEnabled && this.redis) {
            await this.setInCache(cacheKey, assets);
        }

        return assets as Asset[];
    }

    // Export Methods
    async createExport(data: Omit<Export, 'id' | 'created_at' | 'updated_at'>): Promise<Export> {
        const { data: gameExport, error } = await this.supabase
            .from('exports')
            .insert(data)
            .single();

        if (error) throw error;
        await this.invalidateCache(`project:${data.project_id}:exports`);
        return gameExport as Export;
    }

    async getProjectExports(projectId: string): Promise<Export[]> {
        const cacheKey = `project:${projectId}:exports`;
        
        if (this.cacheEnabled && this.redis) {
            const cached = await this.getFromCache<Export[]>(cacheKey);
            if (cached) return cached;
        }

        const { data: exports, error } = await this.supabase
            .from('exports')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (exports && this.cacheEnabled && this.redis) {
            await this.setInCache(cacheKey, exports);
        }

        return exports as Export[];
    }

    // Story Methods
    async createStory(data: Omit<Story, 'id' | 'created_at' | 'updated_at'>): Promise<Story> {
        const { data: story, error } = await this.supabase
            .from('stories')
            .insert(data)
            .single();

        if (error) throw error;
        await this.invalidateCache(`project:${data.project_id}:story`);
        return story as Story;
    }

    async getProjectStory(projectId: string): Promise<Story | null> {
        const cacheKey = `project:${projectId}:story`;
        
        if (this.cacheEnabled && this.redis) {
            const cached = await this.getFromCache<Story>(cacheKey);
            if (cached) return cached;
        }

        const { data: story, error } = await this.supabase
            .from('stories')
            .select('*')
            .eq('project_id', projectId)
            .single();

        if (error) throw error;
        if (story && this.cacheEnabled && this.redis) {
            await this.setInCache(cacheKey, story);
        }

        return story as Story | null;
    }

    // Cache Methods
    private async getFromCache<T>(key: string): Promise<T | null> {
        if (!this.cacheEnabled || !this.redis) return null;
        try {
            const cached = await this.redis.get(key);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error('Cache read error:', error);
            return null;
        }
    }

    private async setInCache(key: string, value: any): Promise<void> {
        if (!this.cacheEnabled || !this.redis) return;
        try {
            await this.redis.set(key, JSON.stringify(value), 'EX', this.cacheTTL);
        } catch (error) {
            console.error('Cache write error:', error);
        }
    }

    private async invalidateCache(key: string): Promise<void> {
        if (!this.cacheEnabled || !this.redis) return;
        try {
            await this.redis.del(key);
        } catch (error) {
            console.error('Cache invalidation error:', error);
        }
    }

    // Cleanup
    async cleanup(): Promise<void> {
        if (this.redis) {
            try {
                await this.redis.quit();
            } catch (error) {
                console.error('Redis cleanup error:', error);
            } finally {
                this.redis = null;
            }
        }
    }
} 