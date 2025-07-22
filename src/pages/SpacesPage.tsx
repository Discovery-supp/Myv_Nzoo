import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { getAllSpaces } from '../data/spacesData';

interface SpacesPageProps {
  language: 'fr' | 'en';
}

const SpacesPage: React.FC<SpacesPageProps> = ({ language }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Persist dark mode in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dark');
    setDarkMode(stored === 'true');
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('dark', darkMode.toString());
  }, [darkMode]);

  const toggleDark = () => setDarkMode((d) => !d);

  const translations = {
    fr: {
      title: 'Nos Espaces de Travail',
      subtitle: 'Découvrez nos espaces modernes et équipés pour tous vos besoins professionnels',
      bookButton: 'Réserver',
      backHome: 'Retour à l\'accueil'
    },
    en: {
      title: 'Nos Espaces de Travail',
      subtitle: 'Découvrez nos espaces modernes et équipés pour tous vos besoins professionnels',
      bookButton: 'Réserver',
      backHome: 'Retour à l\'accueil'
    }
  };

  const t = translations[language];

  // Obtenir les espaces depuis le fichier de données
  const spaces = getAllSpaces(language);

  // Fonction pour obtenir le prix formaté d'un espace
  const getSpacePrice = (spaceKey: string) => {
    const space = spaces[spaceKey];
    if (!space) return '';
    
    if (space.dailyPrice) {
      return language === 'fr' ? `À partir de $${space.dailyPrice}/jour` : `From $${space.dailyPrice}/day`;
    }
    if (space.monthlyPrice) {
      return language === 'fr' ? `À partir de $${space.monthlyPrice}/mois` : `From $${space.monthlyPrice}/month`;
    }
    if (space.hourlyPrice) {
      return language === 'fr' ? `À partir de $${space.hourlyPrice}/heure` : `From $${space.hourlyPrice}/hour`;
    }
    return '';
  };

  // Fonction pour obtenir la capacité formatée
  const getSpaceCapacity = (spaceKey: string) => {
    const space = spaces[spaceKey];
    if (!space) return '';
    
    if (spaceKey === 'coworking') {
      return language === 'fr' ? `Max ${space.maxOccupants} personnes` : `Max ${space.maxOccupants} people`;
    }
    if (spaceKey === 'bureau-prive') {
      return language === 'fr' ? 'Équipe complète' : 'Full team';
    }
    if (spaceKey === 'salle-reunion') {
      return language === 'fr' ? `Jusqu'à ${space.maxOccupants} personnes` : `Up to ${space.maxOccupants} people`;
    }
    return '';
  };

  // Fonction pour obtenir la couleur d'un espace
  const getSpaceColor = (spaceKey: string) => {
    const colorMap: Record<string, string> = {
      coworking: 'blue',
      'bureau-prive': 'green',
      'salle-reunion': 'purple'
    };
    return colorMap[spaceKey] || 'blue';
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-700 font-sans">
        <Helmet>
          <title>Nzoo Immo - {t.title}</title>
        </Helmet>

        {/* Dark mode toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleDark}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-gray-800" />
            )}
          </button>
        </div>

        {/* Header Section */}
        <section className="relative py-48">
          {/* Background Banner */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/Bannière_Pack 2.png"
              alt="Bannière Pack 2"
              className="w-full h-full object-cover scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </section>

        {/* Spaces Section */}
        <section className="py-24 bg-white dark:bg-gray-800">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(spaces).map(([spaceKey, space], index) => {
                const color = getSpaceColor(spaceKey);
                const price = getSpacePrice(spaceKey);
                const capacity = getSpaceCapacity(spaceKey);
                const link = `/reservation/${spaceKey}`;
                
                const colorMap: Record<string, string> = {
                  blue: 'text-blue-600 dark:text-blue-400',
                  green: 'text-green-600 dark:text-green-400',
                  purple: 'text-purple-600 dark:text-purple-400',
                };
                const buttonMap: Record<string, string> = {
                  blue: 'bg-blue-600 hover:bg-blue-700',
                  green: 'bg-green-600 hover:bg-green-700',
                  purple: 'bg-purple-600 hover:bg-purple-700',
                };
                
                return (
                  <motion.article
                    key={spaceKey}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
                  >
                    <div className="relative overflow-hidden">
                      {/* Galerie d'images */}
                      <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
                        {space.images && space.images.length > 0 ? (
                          <img
                            src={space.images[0]}
                            alt={space.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{space.title}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Indicateur de galerie si plusieurs images */}
                        {space.images && space.images.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs font-medium">
                            📷 {space.images.length}
                          </div>
                        )}
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className={`text-2xl font-bold mb-3 ${colorMap[color]}`}>
                        {space.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                        {space.description}
                      </p>
                      
                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Équipements inclus :
                        </h4>
                        <ul className="space-y-1">
                          {space.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                          {space.features.length > 3 && (
                            <li className="text-sm text-gray-500 italic">
                              +{space.features.length - 3} autres...
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {/* Price and Capacity */}
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-semibold">{price}</span>
                        <span>{capacity}</span>
                      </div>
                      
                      {/* Book Button */}
                      <Link
                        to={link}
                        className={`block ${buttonMap[color]} text-white text-center py-3 rounded-lg transition-all duration-200 font-medium hover:shadow-lg transform hover:-translate-y-1`}
                      >
                        {t.bookButton}
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Prêt à réserver votre espace ?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Choisissez l'espace qui correspond le mieux à vos besoins et réservez en quelques clics.
            </p>
            <Link
              to="/reservation/coworking"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Commencer ma réservation
            </Link>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
};

export default SpacesPage;