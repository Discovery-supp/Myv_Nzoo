import React from 'react';
import { Award, Users, TrendingUp, Clock } from 'lucide-react';

const About = () => {
  const stats = [
    {
      icon: Award,
      number: "15+",
      label: "Années d'expérience"
    },
    {
      icon: Users,
      number: "1000+",
      label: "Clients satisfaits"
    },
    {
      icon: TrendingUp,
      number: "500+",
      label: "Propriétés vendues"
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Support client"
    }
  ];

  return (
    <section id="apropos" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              À propos de NzooImmo
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Depuis plus de 15 ans, NzooImmo est votre partenaire de confiance dans l'immobilier en Côte d'Ivoire. 
              Nous nous engageons à vous offrir un service personnalisé et professionnel pour tous vos projets immobiliers.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Notre équipe d'experts connaît parfaitement le marché local et vous accompagne à chaque étape, 
              que vous souhaitiez acheter, vendre ou investir dans l'immobilier.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-3">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
              alt="Équipe NzooImmo"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-primary-600 opacity-10 rounded-lg"></div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Pourquoi choisir NzooImmo ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Expertise reconnue</h4>
              <p className="text-gray-600">Une connaissance approfondie du marché immobilier ivoirien</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Service personnalisé</h4>
              <p className="text-gray-600">Un accompagnement sur mesure adapté à vos besoins</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Résultats garantis</h4>
              <p className="text-gray-600">Des transactions réussies et des clients satisfaits</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;