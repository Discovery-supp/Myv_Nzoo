import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, User, LogOut } from 'lucide-react';

interface HeaderProps {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const translations = {
    fr: {
      home: 'Accueil',
      reservation: 'Réservation',
      admin: 'Administration',
      logout: 'Déconnexion'
    },
    en: {
      home: 'Home',
      reservation: 'Reservation',
      admin: 'Administration',
      logout: 'Logout'
    }
  };

  const t = translations[language];

  const handleLogout = () => {
    setIsAuthenticated(); // Appeler la fonction de déconnexion
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo_nzooimmo.svg" 
              alt="Nzoo Immo" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-2xl font-bold text-sky-light-500">
                Nzoo Immo
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-neutral-600 hover:text-secondary font-medium transition-colors duration-200"
            >
              {t.home}
            </Link>
            <Link 
              to="/spaces" 
              className="text-neutral-600 hover:text-secondary font-medium transition-colors duration-200"
            >
              Espaces
            </Link>
            <Link 
              to="/reservation/coworking" 
              className="text-neutral-600 hover:text-secondary font-medium transition-colors duration-200"
            >
              {t.reservation}
            </Link>
            {isAuthenticated && (
              <Link 
                to="/admin/dashboard" 
                className="text-neutral-600 hover:text-secondary font-medium transition-colors duration-200"
              >
                {t.admin}
              </Link>
            )}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-neutral-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                className="bg-transparent border-none text-sm font-medium text-neutral-600 focus:outline-none cursor-pointer"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
            </div>

            {/* Admin controls */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-neutral-600 hover:text-secondary transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center space-x-2 text-neutral-600 hover:text-secondary transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;