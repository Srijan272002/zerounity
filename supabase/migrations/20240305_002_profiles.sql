-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    website TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.profiles', 'Profiles are viewable by owner');
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.profiles', 'Profiles are editable by owner');
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.profiles', 'Profiles can be created by owner');
END $$;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by owner" ON public.profiles
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = profiles.user_id
        AND users.auth_user_id = auth.uid()
    ));

CREATE POLICY "Profiles are editable by owner" ON public.profiles
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = profiles.user_id
        AND users.auth_user_id = auth.uid()
    ));

CREATE POLICY "Profiles can be created by owner" ON public.profiles
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = profiles.user_id
        AND users.auth_user_id = auth.uid()
    ));

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Add timestamp trigger for profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = 'profiles'
        AND indexname = 'idx_profiles_user_id'
    ) THEN
        CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
    END IF;
END $$; 