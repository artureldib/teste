/*
  # Create Styleguide Styles Table

  1. New Tables
    - `styles`
      - `id` (uuid, primary key) - Unique identifier for each style
      - `category` (text) - Style category (e.g., 'color', 'typography', 'spacing')
      - `name` (text) - Style name (e.g., 'slate-500', 'text-lg')
      - `value` (text) - Style value (e.g., '#64748b', '1.125rem')
      - `description` (text, nullable) - Optional description of the style
      - `css_class` (text, nullable) - Tailwind CSS class name
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update
  
  2. Security
    - Enable RLS on `styles` table
    - Add policy for public read access (styleguide is typically public)
    - Add policy for authenticated users to create/update/delete styles
*/

CREATE TABLE IF NOT EXISTS styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  value text NOT NULL,
  description text,
  css_class text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view styles"
  ON styles
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert styles"
  ON styles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update styles"
  ON styles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete styles"
  ON styles
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_styles_category ON styles(category);
CREATE INDEX IF NOT EXISTS idx_styles_name ON styles(name);