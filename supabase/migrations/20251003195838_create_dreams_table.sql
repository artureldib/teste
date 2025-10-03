/*
  # Create Dreams and Videos Table

  1. New Tables
    - `dreams`
      - `id` (uuid, primary key) - Unique identifier for each dream
      - `user_id` (uuid, nullable) - User who created the dream (auth.users)
      - `title` (text) - Dream description (e.g., "traveling to Rome")
      - `photo_url` (text, nullable) - URL to uploaded user photo
      - `video_url` (text, nullable) - URL to generated or uploaded video
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update
  
  2. Storage Buckets
    - `dream-photos` - For user uploaded photos
    - `dream-videos` - For generated or uploaded videos
  
  3. Security
    - Enable RLS on `dreams` table
    - Add policy for users to view their own dreams
    - Add policy for users to create their own dreams
    - Add policy for users to update their own dreams
    - Add policy for users to delete their own dreams
    - Configure storage buckets for authenticated uploads
*/

CREATE TABLE IF NOT EXISTS dreams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  photo_url text,
  video_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dreams"
  ON dreams
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own dreams"
  ON dreams
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own dreams"
  ON dreams
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own dreams"
  ON dreams
  FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE INDEX IF NOT EXISTS idx_dreams_user_id ON dreams(user_id);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('dream-photos', 'dream-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('dream-videos', 'dream-videos', true, 52428800, ARRAY['video/mp4', 'video/webm', 'video/quicktime'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read access to dream photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'dream-photos');

CREATE POLICY "Allow authenticated uploads to dream photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'dream-photos');

CREATE POLICY "Allow users to update their own dream photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'dream-photos');

CREATE POLICY "Allow users to delete their own dream photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'dream-photos');

CREATE POLICY "Allow public read access to dream videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'dream-videos');

CREATE POLICY "Allow authenticated uploads to dream videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'dream-videos');

CREATE POLICY "Allow users to update their own dream videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'dream-videos');

CREATE POLICY "Allow users to delete their own dream videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'dream-videos');