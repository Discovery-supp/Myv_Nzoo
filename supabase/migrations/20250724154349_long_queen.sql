/*
  # Recreate spaces table with complete schema

  1. New Tables
    - Drop and recreate `spaces` table with all required columns:
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `type` (text, required with check constraint)
      - `description` (text)
      - `features` (text array)
      - `max_occupants` (integer)
      - `daily_price`, `monthly_price`, `yearly_price`, `hourly_price` (numeric)
      - `is_active` (boolean)
      - `images` (text array)
      - `created_at`, `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `spaces` table
    - Add policies for public read access and authenticated write access
*/

-- Drop the existing spaces table if it exists
DROP TABLE IF EXISTS spaces CASCADE;

-- Create the spaces table with complete schema
CREATE TABLE spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('coworking', 'bureau-prive', 'salle-reunion')),
  description text DEFAULT '',
  features text[] DEFAULT '{}',
  max_occupants integer DEFAULT 1 CHECK (max_occupants > 0),
  daily_price numeric(10,2) DEFAULT 0,
  monthly_price numeric(10,2) DEFAULT 0,
  yearly_price numeric(10,2) DEFAULT 0,
  hourly_price numeric(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view active spaces"
  ON spaces
  FOR SELECT
  USING (is_active = true);

-- Create policies for authenticated users to manage spaces
CREATE POLICY "Authenticated users can insert spaces"
  ON spaces
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update spaces"
  ON spaces
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete spaces"
  ON spaces
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO spaces (name, type, description, features, max_occupants, daily_price, monthly_price, yearly_price, hourly_price, is_active) VALUES
('Espace Coworking Principal', 'coworking', 'Grand espace de coworking avec vue sur la ville', ARRAY['WiFi', 'Imprimante', 'Café', 'Climatisation'], 20, 25.00, 400.00, 4000.00, 0, true),
('Bureau Privé Executive', 'bureau-prive', 'Bureau privé pour 2-4 personnes avec équipements premium', ARRAY['WiFi', 'Téléphone', 'Tableau blanc', 'Climatisation'], 4, 80.00, 1200.00, 12000.00, 0, true),
('Salle de Réunion Alpha', 'salle-reunion', 'Salle de réunion moderne avec équipements audiovisuels', ARRAY['Projecteur', 'WiFi', 'Tableau blanc', 'Visioconférence'], 8, 0, 0, 0, 50.00, true);