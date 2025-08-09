import React, { useState } from 'react';
import { Menu, X, Home } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">NzooImmo</span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#accueil" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Accueil
            </a>
            <a href="#proprietes" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Propriétés
            </a>
            <a href="#services" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Services
            </a>
            <a href="#apropos" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              À propos
            </a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="btn-primary">
              Nous contacter
            </button>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#accueil" className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium">
                Accueil
              </a>
              <a href="#proprietes" className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium">
                Propriétés
              </a>
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium">
                Services
              </a>
              <a href="#apropos" className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium">
                À propos
              </a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium">
                Contact
              </a>
              <div className="px-3 py-2">
                <button className="btn-primary w-full">
                  Nous contacter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;