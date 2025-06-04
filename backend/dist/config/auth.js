"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfig = exports.supabaseAdmin = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}
// Initialize Supabase client with public anon key
exports.supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
// Initialize admin client with service role key for backend operations
exports.supabaseAdmin = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// Auth configuration
exports.authConfig = {
    providers: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackUrl: process.env.GOOGLE_CALLBACK_URL,
        },
    },
    session: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        signIn: async ({ user, account, profile }) => {
            if (!user.email)
                return false;
            try {
                // Check if user exists
                const { data: existingUser } = await exports.supabaseAdmin
                    .from('users')
                    .select('id')
                    .eq('email', user.email)
                    .single();
                if (!existingUser) {
                    // Create new user profile
                    await exports.supabaseAdmin.from('users').insert({
                        email: user.email,
                        name: profile?.name || user.email.split('@')[0],
                        avatar_url: profile?.image || null,
                        provider: account.provider,
                    });
                }
                return true;
            }
            catch (error) {
                console.error('Error in sign in callback:', error);
                return false;
            }
        },
    },
};
