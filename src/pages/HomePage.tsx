import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Calendar, CreditCard, Shield } from 'lucide-react';

// Texte FR/EN simple ici
const texts = {
  fr: {
    hero: {
      title: 'Réservez votre espace de travail idéal',
      subtitle:
        'Des bureaux modernes, du coworking flexible et des salles de réunion professionnelles à Kinshasa',
      ctaPrimary: 'Réserver maintenant',
    },
    spacesTitle: 'Nos Espaces',
    featuresTitle: 'Pourquoi choisir Nzoo Immo ?',
    testimonialsTitle: 'Témoignages',
    features: [
      {
        icon: <Calendar className="w-8 h-8 text-blue-600" />,
        title: 'Réservation Simple',
        desc: 'Système de réservation intuitif avec calendrier interactif',
      },
      {
        icon: <CreditCard className="w-8 h-8 text-green-600" />,
        title: 'Paiement Sécurisé',
        desc: 'Cartes VISA et Mobile Money acceptés',
      },
      {
        icon: <Shield className="w-8 h-8 text-purple-600" />,
        title: 'Support 24/7',
        desc: 'Une équipe dédiée toujours disponible',
      },
    ],
    testimonials: [
      {
        name: 'Marie Dupont',
        text: 'Excellent service, espaces très confortables et bien équipés',
      },
      {
        name: 'Jean Martin',
        text: 'Réservation simple et rapide, je recommande vivement !',
      },
      {
        name: 'Sophie Bernard',
        text: 'Le support client est toujours disponible et efficace',
      },
    ],
    toggleLangLabel: 'Passer en anglais',
  },
  en: {
    hero: {
      title: 'Réservez votre espace de travail idéal',
      subtitle:
        'Des bureaux modernes, du coworking flexible et des salles de réunion professionnelles à Kinshasa',
      ctaPrimary: 'Réserver maintenant',
    },
    spacesTitle: 'Nos Espaces',
    featuresTitle: 'Pourquoi choisir Nzoo Immo ?',
    testimonialsTitle: 'Témoignages',
    features: [
      {
        icon: <Calendar className="w-8 h-8 text-blue-600" />,
        title: 'Réservation Simple',
        desc: 'Système de réservation intuitif avec calendrier interactif',
      },
      {
        icon: <CreditCard className="w-8 h-8 text-green-600" />,
        title: 'Paiement Sécurisé',
        desc: 'Cartes VISA et Mobile Money acceptés',
      },
      {
        icon: <Shield className="w-8 h-8 text-purple-600" />,
        title: 'Support 24/7',
        desc: 'Une équipe dédiée toujours disponible',
      },
    ],
    testimonials: [
      {
        name: 'Marie Dupont',
        text: 'Excellent service, espaces très confortables et bien équipés',
      },
      {
        name: 'Jean Martin',
        text: 'Réservation simple et rapide, je recommande vivement !',
      },
      {
        name: 'Sophie Bernard',
        text: 'Le support client est toujours disponible et efficace',
      },
    ],
    toggleLangLabel: 'Switch to English',
  },
};

// Images de bannière pour le carrousel
const bannerImages = [
  '/Bannière_Pack 1.png',
  '/Bannière_Pack 2.png',
  '/Bannière_Pack 3.png',
  '/Bannière_Pack 5.png',
  '/Bannière_Pack 6.png'
];
const HomePage: React.FC = () => {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [darkMode, setDarkMode] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const navigate = useNavigate();

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

  // Carrousel automatique des bannières
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        (prevIndex + 1) % bannerImages.length
      );
    }, 4000); // Change d'image toutes les 4 secondes

    return () => clearInterval(interval);
  }, []);
  const toggleDark = () => setDarkMode((d) => !d);
  const toggleLang = () => setLang((l) => (l === 'fr' ? 'en' : 'fr'));

  const t = texts[lang];

  // Fonction pour naviguer vers la page des espaces
  const goToSpaces = () => {
    navigate('/spaces');
  };


  return (
    <HelmetProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-700 font-sans">
        <Helmet>
          <title>Nzoo Immo - {t.hero.title}</title>
        </Helmet>

        {/* Language & Dark mode toggles */}
        <div className="fixed top-4 right-4 z-50 flex space-x-4">
          <button
            onClick={toggleLang}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {t.toggleLangLabel}
          </button>
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

        {/* Carrousel de bannières */}
        <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <div className="relative w-full h-full">
            {bannerImages.map((image, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: index === currentBannerIndex ? 1 : 0,
                  x: index === currentBannerIndex ? 0 : (index < currentBannerIndex ? -100 : 100)
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <img
                  src={image}
                  alt={`Bannière ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Indicateurs de pagination */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBannerIndex 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </section>
        {/* Hero Section */}
        <section className="relative flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white px-4 max-w-4xl"
          >
            <h1 className="text-5xl font-bold leading-tight mb-6">{t.hero.title}</h1>
            <p className="text-xl mb-8 opacity-90">{t.hero.subtitle}</p>
            <div className="flex justify-center">
              <button
                onClick={goToSpaces}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-lg transition-colors"
              >
                {t.hero.ctaPrimary}
              </button>
            </div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Nos Services
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Découvrez nos packs adaptés à tous vos besoins professionnels
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {/* Pack Startup & Freelance */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-8 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                 <div className="bg-blue-600 p-4 rounded-lg mr-6 flex-shrink-0">
                   <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Startup" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                    PACK STARTUP & FREE-LANCE
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Destiné aux startups, freelances, télétravailleurs et professionnels à la recherche d'un espace flexible, accessible et stimulant.
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">$300/mois</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">ou $15/jour</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Accès à un poste de travail en open space
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Connexion Internet haut débit
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Accès à l'espace détente (café/thé en option)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    2h gratuites de salles de réunion/semaine
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Réception de courrier professionnel
                  </li>
                </ul>
              </motion.div>

              {/* Pack Welcome to Kin */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-8 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                 <div className="bg-green-600 p-4 rounded-lg mr-6 flex-shrink-0">
                   <img src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Welcome" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                    PACK WELCOME TO KIN
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Destiné aux entrepreneurs étrangers, membres de la diaspora et professionnels internationaux souhaitant s'implanter à Kinshasa.
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">$1000/mois</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Accès à un poste de travail en open space
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Hébergement studio meublé à proximité
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Accompagnement personnalisé à l'installation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Services de secrétariat partiels
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Support bilingue (français/anglais)
                  </li>
                </ul>
              </motion.div>

              {/* Pack Invest Lounge */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-8 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                 <div className="bg-purple-600 p-4 rounded-lg mr-6 flex-shrink-0">
                   <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Investment" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                    PACK INVEST LOUNGE
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Destiné aux investisseurs et Business Angels souhaitant s'implanter ou développer une activité à Kinshasa.
                </p>
                <div className="mb-4">
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    Sur mesure
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Recherche de partenariats fiables
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Facilitation des échanges locaux
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Visibilité aux projets
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Identification des meilleurs profils
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Suivi des projets financés
                  </li>
                </ul>
              </motion.div>

              {/* Domiciliation Commerciale */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl p-8 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                 <div className="bg-orange-600 p-4 rounded-lg mr-6 flex-shrink-0">
                   <img src="https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Domiciliation" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200">
                    DOMICILIATION COMMERCIALE
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Services de domiciliation commerciale destinée aux Startups, PME, Freelances et porteurs de projets.
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">$800/an</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">ou $100/mois</span>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Min 6 mois
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Adresse légale à Kinshasa
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Gestion du courrier administratif
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Attestation de domiciliation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Création de site vitrine
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    2 jours/mois en coworking
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mt-16"
            >
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Besoin d'un pack personnalisé ? Contactez-nous pour une solution sur mesure.
              </p>
              <button
                onClick={() => navigate('/spaces')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
              >
                Découvrir nos espaces
              </button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-16">
              {t.featuresTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {t.features.map(({ icon, title, desc }) => (
                <article key={title} className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-16">
              {t.testimonialsTitle}
            </h2>
            <div className="space-y-12">
              {t.testimonials.map(({ name, text }) => (
                <motion.blockquote
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg shadow-md text-gray-700 dark:text-gray-300 text-center italic"
                >
                  <p>“{text}”</p>
                  <footer className="mt-4 font-semibold text-gray-900 dark:text-gray-100">— {name}</footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Access to Spaces */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Découvrez nos espaces
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Explorez notre gamme complète d'espaces de travail modernes et équipés.
            </p>
            <Link
              to="/spaces"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Voir tous nos espaces
            </Link>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
};

export default HomePage;
