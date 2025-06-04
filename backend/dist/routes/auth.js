"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../config/auth");
const auth_2 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Profile update schema
const updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50).optional(),
    bio: zod_1.z.string().max(500).optional(),
    location: zod_1.z.string().max(100).optional(),
    website: zod_1.z.string().url().max(200).optional(),
});
// Get current user profile
router.get('/me', auth_2.requireAuth, async (req, res) => {
    try {
        const { data: profile, error } = await auth_1.supabase
            .from('profiles')
            .select('*')
            .eq('user_id', req.user.id)
            .single();
        if (error)
            throw error;
        res.json({ profile });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
// Update user profile
router.patch('/me', auth_2.requireAuth, async (req, res) => {
    try {
        const validatedData = updateProfileSchema.parse(req.body);
        const { data: profile, error } = await auth_1.supabaseAdmin
            .from('profiles')
            .upsert({
            user_id: req.user.id,
            ...validatedData,
            updated_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (error)
            throw error;
        res.json({ profile });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: 'Invalid data', details: error.errors });
        }
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
// Upload avatar
router.post('/avatar', auth_2.requireAuth, async (req, res) => {
    try {
        const avatar = req.files?.avatar;
        if (!avatar) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${req.user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await auth_1.supabaseAdmin.storage
            .from('avatars')
            .upload(fileName, avatar.data);
        if (uploadError)
            throw uploadError;
        const { data: { publicUrl } } = auth_1.supabaseAdmin.storage
            .from('avatars')
            .getPublicUrl(fileName);
        await auth_1.supabaseAdmin
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('user_id', req.user.id);
        res.json({ avatar_url: publicUrl });
    }
    catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'Failed to upload avatar' });
    }
});
// Google OAuth callback
router.get('/callback/google', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ error: 'Missing authorization code' });
        }
        const { data, error } = await auth_1.supabase.auth.exchangeCodeForSession(code);
        if (error)
            throw error;
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?session=${JSON.stringify(data)}`);
    }
    catch (error) {
        console.error('OAuth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
});
exports.default = router;
