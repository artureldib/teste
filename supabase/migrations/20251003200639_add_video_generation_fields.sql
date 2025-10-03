/*
  # Add Video Generation Fields to Dreams Table

  1. Changes
    - Add `video_status` field to track generation status (pending, generating, completed, failed)
    - Add `video_prompt` field to store enriched prompt for video generation
    - Add `error_message` field to store any generation errors
  
  2. Notes
    - Status helps track the video generation pipeline
    - Enriched prompt allows us to enhance user input for better video results
    - Error messages help with debugging and user feedback
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dreams' AND column_name = 'video_status'
  ) THEN
    ALTER TABLE dreams ADD COLUMN video_status text DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dreams' AND column_name = 'video_prompt'
  ) THEN
    ALTER TABLE dreams ADD COLUMN video_prompt text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dreams' AND column_name = 'error_message'
  ) THEN
    ALTER TABLE dreams ADD COLUMN error_message text;
  END IF;
END $$;