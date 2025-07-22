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
            className="px-3 py-1 rounded bg-nzoo-light dark:bg-nzoo-secondary hover:bg-gray-300 dark:hover:bg-gray-600 transition text-nzoo-primary dark:text-white"
          >
            {t.toggleLangLabel}
          </button>
          <button
            onClick={toggleDark}
            className="p-2 rounded-full bg-nzoo-light dark:bg-nzoo-secondary hover:scale-105 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {/* Carrousel de bannières */}
        <section className="relative h-80 md:h-96 lg:h-[500px] overflow-hidden bg-gray-100 dark:bg-gray-800">
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
                    ? 'bg-nzoo-primary shadow-lg' 
                    : 'bg-nzoo-light hover:bg-nzoo-secondary'
               }`}
            ))}
          </div>
        </section>
        {/* Hero Section */}
        <section className="relative flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-gray-900 dark:text-gray-100 px-4 max-w-5xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={goToSpaces}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white py-4 px-8 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
              >
                {t.hero.ctaPrimary}
              </button>
              <button
                onClick={() => window.scrollTo({ top: document.querySelector('#services')?.offsetTop, behavior: 'smooth' })}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-4 px-8 rounded-xl transition-all duration-300 font-semibold text-lg"
              >
                Découvrir nos services
              </button>
            </div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/20 to-blue-200/40 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20 relative z-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Nos Services
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Découvrez nos packs adaptés à tous vos besoins professionnels
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
              {/* Pack Startup & Freelance */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-gray-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl p-8 border border-blue-200/50 dark:border-purple-700/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex items-center mb-8">
                 <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-xl mr-6 flex-shrink-0 shadow-lg">
                   <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Startup" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                    PACK STARTUP & FREE-LANCE
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  Destiné aux startups, freelances, télétravailleurs et professionnels à la recherche d'un espace flexible, accessible et stimulant.
                </p>
                <div className="mb-6 p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-blue-200">
                  <span className="text-3xl font-bold text-blue-600 dark:text-gray-200">$300</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2 text-lg">/mois</span>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">ou $15/jour</div>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-3 flex-shrink-0"></span>
                    Accès à un poste de travail en open space
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-3 flex-shrink-0"></span>
                    Connexion Internet haut débit
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-3 flex-shrink-0"></span>
                    Accès à l'espace détente (café/thé en option)
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-3 flex-shrink-0"></span>
                    2h gratuites de salles de réunion/semaine
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-3 flex-shrink-0"></span>
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
                className="bg-gradient-to-br from-purple-50 to-gray-100 dark:from-purple-900/50 dark:to-gray-800/50 rounded-2xl p-8 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex items-center mb-8">
                 <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-xl mr-6 flex-shrink-0 shadow-lg">
                   <img src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Welcome" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                    PACK WELCOME TO KIN
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  Destiné aux entrepreneurs étrangers, membres de la diaspora et professionnels internationaux souhaitant s'implanter à Kinshasa.
                </p>
                <div className="mb-6 p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-purple-200">
                  <span className="text-3xl font-bold text-purple-600 dark:text-gray-200">$1000</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2 text-lg">/mois</span>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-purple-600 rounded-full mr-3 flex-shrink-0"></span>
                    Accès à un poste de travail en open space
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-purple-600 rounded-full mr-3 flex-shrink-0"></span>
                    Hébergement studio meublé à proximité
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-purple-600 rounded-full mr-3 flex-shrink-0"></span>
                    Accompagnement personnalisé à l'installation
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-purple-600 rounded-full mr-3 flex-shrink-0"></span>
                    Services de secrétariat partiels
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-purple-600 rounded-full mr-3 flex-shrink-0"></span>
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
                className="bg-gradient-to-br from-green-50 to-gray-100 dark:from-green-900/40 dark:to-blue-900/40 rounded-2xl p-8 border border-green-200/50 dark:border-green-700/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex items-center mb-8">
                 <div className="bg-gradient-to-br from-green-600 to-blue-600 p-4 rounded-xl mr-6 flex-shrink-0 shadow-lg">
                   <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Investment" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                    PACK INVEST LOUNGE
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  Destiné aux investisseurs et Business Angels souhaitant s'implanter ou développer une activité à Kinshasa.
                </p>
                <div className="mb-6 p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-green-200">
                  <span className="text-2xl font-bold text-green-600 dark:text-gray-200">
                    Sur mesure
                  </span>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-3 flex-shrink-0"></span>
                    Recherche de partenariats fiables
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-3 flex-shrink-0"></span>
                    Facilitation des échanges locaux
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-3 flex-shrink-0"></span>
                    Visibilité aux projets
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-3 flex-shrink-0"></span>
                    Identification des meilleurs profils
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-3 flex-shrink-0"></span>
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
                className="bg-gradient-to-br from-orange-50 to-gray-100 dark:from-orange-900/40 dark:to-gray-800/50 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-700/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex items-center mb-8">
                 <div className="bg-gradient-to-br from-orange-600 to-blue-600 p-4 rounded-xl mr-6 flex-shrink-0 shadow-lg">
                   <img src="https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Domiciliation" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                    DOMICILIATION COMMERCIALE
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  Services de domiciliation commerciale destinée aux Startups, PME, Freelances et porteurs de projets.
                </p>
                <div className="mb-6 p-4 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-orange-200">
                  <span className="text-3xl font-bold text-orange-600 dark:text-gray-200">$800</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2 text-lg">/an</span>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    ou $100/mois -
                    Min 6 mois
                  </div>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-orange-600 rounded-full mr-3 flex-shrink-0"></span>
                    Adresse légale à Kinshasa
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-orange-600 rounded-full mr-3 flex-shrink-0"></span>
                    Gestion du courrier administratif
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-orange-600 rounded-full mr-3 flex-shrink-0"></span>
                    Attestation de domiciliation
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-orange-600 rounded-full mr-3 flex-shrink-0"></span>
                    Création de site vitrine
                  </li>
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-orange-600 rounded-full mr-3 flex-shrink-0"></span>
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
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Besoin d'un pack personnalisé ? Contactez-nous pour une solution sur mesure.
              </p>
              <button
                onClick={() => navigate('/spaces')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white py-4 px-10 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
              >
                Découvrir nos espaces
              </button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-purple-200/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-200/20 to-blue-200/40 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t.featuresTitle}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {t.features.map(({ icon, title, desc }) => (
                <motion.article 
                  key={title} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-200/50"
                >
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    {icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white dark:bg-gray-800 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {t.testimonialsTitle}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>
            <div className="space-y-12 relative z-10">
              {t.testimonials.map(({ name, text }) => (
                <motion.blockquote
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-10 rounded-2xl shadow-xl text-gray-600 dark:text-gray-300 text-center relative backdrop-blur-sm border border-blue-200/50 dark:border-gray-700/50"
                >
                  <div className="absolute top-4 left-6 text-6xl text-blue-200 dark:text-purple-400 font-serif">"</div>
                  <p className="text-xl italic leading-relaxed mb-6 relative z-10">{text}</p>
                  <footer className="font-semibold text-gray-900 dark:text-gray-100 text-lg">— {name}</footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Access to Spaces */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Découvrez nos espaces
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Explorez notre gamme complète d'espaces de travail modernes et équipés.
              </p>
              <Link
                to="/spaces"
                className="inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-xl transform hover:scale-105"
              >
              Voir tous nos espaces
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
};

export default HomePage;
