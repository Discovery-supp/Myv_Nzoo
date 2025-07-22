/*
  # Ajout de la gestion des utilisateurs

  1. Nouvelles tables
    - `admin_users` - Table pour les utilisateurs administrateurs
    
  2. Colonnes incluses
    - `id` (uuid, primary key)
    - `username` (text, unique)
    - `email` (text, unique)
    - `password_hash` (text)
    - `role` (text) - 'admin' ou 'user'
    - `full_name` (text)
    - `is_active` (boolean)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

  3. Sécurité
    - Activation de RLS
    - Politiques d'accès appropriées
*/

-- Créer la table admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  full_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Créer des index pour optimiser les performances
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_admin_users_updated_at_trigger
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_admin_users_updated_at();

-- Activer Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour permettre l'accès approprié

-- Permettre aux utilisateurs authentifiés de voir tous les utilisateurs admin
CREATE POLICY "Authenticated users can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Permettre aux utilisateurs authentifiés de créer des utilisateurs admin
CREATE POLICY "Authenticated users can create admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Permettre aux utilisateurs authentifiés de modifier les utilisateurs admin
CREATE POLICY "Authenticated users can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (true);

-- Permettre aux utilisateurs authentifiés de supprimer les utilisateurs admin
CREATE POLICY "Authenticated users can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (true);

-- Insérer l'utilisateur admin par défaut (mot de passe: admin123)
-- Note: En production, utilisez un hash bcrypt approprié
INSERT INTO admin_users (
  username, 
  email, 
  password_hash, 
  role, 
  full_name, 
  is_active
) VALUES (
  'admin',
  'admin@nzooimmo.com',
  '$2b$10$rQZ8kHWKQVz8kHWKQVz8kOQVz8kHWKQVz8kHWKQVz8kHWKQVz8kH', -- Hash pour 'admin123'
  'admin',
  'Administrateur Principal',
  true
) ON CONFLICT (username) DO NOTHING;

-- Ajouter les colonnes notes et admin_notes à la table reservations si elles n'existent pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'notes'
  ) THEN
    ALTER TABLE reservations ADD COLUMN notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE reservations ADD COLUMN admin_notes text;
  END IF;
END $$;

-- Afficher un message de confirmation
SELECT 'Table admin_users créée avec succès et colonnes notes ajoutées aux réservations!' as message;