/*
  # Fix Storage Policies for Anonymous Users

  1. Changes
    - Update storage policies to allow anonymous users
    - Allow anyone to upload, update, and delete from storage buckets
    - This is needed for browser extension functionality without authentication
  
  2. Security Notes
    - Public access is appropriate for a personal browser extension
    - Files are already public for reading
    - Anonymous uploads enable the core functionality
*/

DROP POLICY IF EXISTS "Allow authenticated uploads to dream photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own dream photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own dream photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to dream videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own dream videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own dream videos" ON storage.objects;

CREATE POLICY "Allow anyone to upload dream photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'dream-photos');

CREATE POLICY "Allow anyone to update dream photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'dream-photos');

CREATE POLICY "Allow anyone to delete dream photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'dream-photos');

CREATE POLICY "Allow anyone to upload dream videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'dream-videos');

CREATE POLICY "Allow anyone to update dream videos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'dream-videos');

CREATE POLICY "Allow anyone to delete dream videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'dream-videos');