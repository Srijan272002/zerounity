-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- Drop existing policies if they exist
DO $$
BEGIN
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON storage.objects', 'Avatar images are publicly accessible');
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON storage.objects', 'Anyone can upload an avatar');
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON storage.objects', 'Users can update their own avatar');
END $$;

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'avatars'
        AND
        auth.uid() = owner::uuid
    ); 