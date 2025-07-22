/*
  # Create complete spaces table with all required columns

  1. New Tables
    - `spaces` table with all required columns:
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `type` (text, required) - coworking, bureau-prive, salle-reunion
      - `description` (text)
      - `features` (text array)
      - `max_occupants` (integer, default 1)
      - `daily_price` (numeric)
      - `monthly_price` (numeric)
      - `yearly_price` (numeric)
      - `hourly_price` (numeric)
      - `is_active` (boolean, default true)
      - `images` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `spaces` table
    - Add policies for authenticated users to manage spaces
*/

-- Drop the table if it exists to recreate it with the correct structure
DROP TABLE IF EXISTS spaces;

-- Create the spaces table with all required columns
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

-- Create policies for authenticated users to manage spaces
CREATE POLICY "Authenticated users can view spaces"
  ON spaces
  FOR SELECT
  TO authenticated
  USING (true);

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

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_spaces_updated_at
  BEFORE UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO spaces (name, type, description, features, max_occupants, daily_price, monthly_price, is_active) VALUES
('Espace Coworking Principal', 'coworking', 'Grand espace de coworking avec vue sur la ville', ARRAY['WiFi', 'Imprimante', 'Café', 'Climatisation'], 20, 25.00, 400.00, true),
('Bureau Privé Executive', 'bureau-prive', 'Bureau privé pour 2-4 personnes avec équipements premium', ARRAY['WiFi', 'Téléphone', 'Tableau blanc', 'Climatisation'], 4, 80.00, 1200.00, true),
('Salle de Réunion Alpha', 'salle-reunion', 'Salle de réunion moderne avec équipements audiovisuels', ARRAY['Projecteur', 'WiFi', 'Tableau blanc', 'Visioconférence'], 8, 50.00, 0, true);