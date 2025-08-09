import React from 'react';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';

const Hero = () => {
  return (
    <section id="accueil" className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div 
        className="relative min-h-screen flex items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')"
        }}
      >
        <div className="absolute inset-0 bg-primary-900 opacity-75"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Trouvez votre
            <span className="block text-yellow-400">maison de rêve</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Découvrez les meilleures propriétés avec NzooImmo, votre partenaire de confiance dans l'immobilier
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Localisation"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 appearance-none">
                  <option>Type de bien</option>
                  <option>Appartement</option>
                  <option>Maison</option>
                  <option>Villa</option>
                  <option>Terrain</option>
                </select>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 appearance-none">
                  <option>Budget max</option>
                  <option>50 000 000 FCFA</option>
                  <option>100 000 000 FCFA</option>
                  <option>200 000 000 FCFA</option>
                  <option>500 000 000 FCFA</option>
                </select>
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center">
                <Search className="h-5 w-5 mr-2" />
                Rechercher
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">500+</div>
              <div className="text-sm md:text-base opacity-90">Propriétés vendues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">15+</div>
              <div className="text-sm md:text-base opacity-90">Années d'expérience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">1000+</div>
              <div className="text-sm md:text-base opacity-90">Clients satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400">50+</div>
              <div className="text-sm md:text-base opacity-90">Agents experts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;