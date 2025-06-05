-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Safely migrate the users table
DO $$
BEGIN
    -- Create the table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    -- Add auth_user_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'auth_user_id'
    ) THEN
        ALTER TABLE public.users ADD COLUMN auth_user_id UUID;
        ALTER TABLE public.users ADD CONSTRAINT fk_auth_user FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- Add other columns if they don't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'email'
    ) THEN
        ALTER TABLE public.users ADD COLUMN email TEXT;
        ALTER TABLE public.users ADD CONSTRAINT users_email_unique UNIQUE (email);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'display_name'
    ) THEN
        ALTER TABLE public.users ADD COLUMN display_name TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.users ADD COLUMN avatar_url TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'settings'
    ) THEN
        ALTER TABLE public.users ADD COLUMN settings JSONB;
    END IF;

    -- Add NOT NULL constraints after ensuring columns exist
    ALTER TABLE public.users ALTER COLUMN auth_user_id SET NOT NULL;
    ALTER TABLE public.users ALTER COLUMN email SET NOT NULL;
    ALTER TABLE public.users ALTER COLUMN display_name SET NOT NULL;

END $$;

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.users', 'Users can view own profile');
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.users', 'Users can update own profile');
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.users', 'Users can insert own profile');
END $$;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT
    USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE
    USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT
    WITH CHECK (auth_user_id = auth.uid());

-- Create index if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = 'users'
        AND indexname = 'idx_users_auth_user_id'
    ) THEN
        CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);
    END IF;
END $$;

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;

-- Add update timestamps trigger
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 