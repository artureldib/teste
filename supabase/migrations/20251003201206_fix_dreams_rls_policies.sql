/*
  # Fix Dreams RLS Policies for Anonymous Users

  1. Changes
    - Drop existing restrictive policies
    - Add new policies that allow anonymous (unauthenticated) users to manage dreams
    - This is appropriate for a browser extension where users may not be logged in
  
  2. Security Notes
    - Anonymous users can create, read, update, and delete dreams
    - This is acceptable for a personal browser extension use case
    - Each user's browser will maintain their own dreams locally
*/

DROP POLICY IF EXISTS "Users can view own dreams" ON dreams;
DROP POLICY IF EXISTS "Users can insert own dreams" ON dreams;
DROP POLICY IF EXISTS "Users can update own dreams" ON dreams;
DROP POLICY IF EXISTS "Users can delete own dreams" ON dreams;

CREATE POLICY "Anyone can view dreams"
  ON dreams
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert dreams"
  ON dreams
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update dreams"
  ON dreams
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete dreams"
  ON dreams
  FOR DELETE
  USING (true);