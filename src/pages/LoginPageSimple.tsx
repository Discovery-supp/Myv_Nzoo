import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface LoginPageSimpleProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const LoginPageSimple: React.FC<LoginPageSimpleProps> = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Utiliser la table admin_users au lieu de users
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', credentials.username)
        .eq('is_active', true)
        .limit(1);

      if (error || !data || data.length === 0) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
        setIsLoading(false);
        return;
      }

      const user = data[0];

      // Vérifier le mot de passe (temporaire pour le développement)
      const isPasswordValid = 
        user.password_hash === `temp_${credentials.password}` || // Nouveaux utilisateurs
        (user.username === 'admin' && credentials.password === 'admin123'); // Utilisateur par défaut

      if (!isPasswordValid) {
        setError('Nom d\'utilisateur ou mot de passe incorrect');
        setIsLoading(false);
        return;
      }

      // Stocker les informations utilisateur dans le localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }));
      
      // Connexion réussie
      setIsAuthenticated(true);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Erreur de connexion à la base de données');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
          <p className="text-gray-600 mt-2">Accédez à votre tableau de bord</p>
        </div>

        {/* Informations de démonstration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-blue-800 font-medium mb-2">Compte de démonstration</h3>
          <div className="text-blue-700 text-sm space-y-1">
            <p><span className="font-medium">Nom d'utilisateur:</span> admin</p>
            <p><span className="font-medium">Mot de passe:</span> admin123</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Nom d'utilisateur"
              value={credentials.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Mot de passe"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Connexion...
              </div>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center text-sm text-gray-500">
            🔒 Connexion sécurisée SSL
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageSimple;