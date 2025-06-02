import { Router } from 'express';
import type { Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/auth';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import { UploadedFile } from 'express-fileupload';

const router = Router();

// Profile update schema
const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().max(200).optional(),
});

// Get current user profile
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', req.user!.id)
      .single();

    if (error) throw error;

    res.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.patch('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        user_id: req.user!.id,
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Upload avatar
router.post('/avatar', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const avatar = req.files?.avatar as UploadedFile;
    if (!avatar) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExt = avatar.name.split('.').pop();
    const fileName = `${req.user!.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(fileName, avatar.data);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(fileName);

    await supabaseAdmin
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', req.user!.id);

    res.json({ avatar_url: publicUrl });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// Google OAuth callback
router.get('/callback/google', async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code as string);
    if (error) throw error;

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?session=${JSON.stringify(data)}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
});

export default router; 