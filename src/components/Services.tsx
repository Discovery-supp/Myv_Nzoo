import React from 'react';
import { Home, Search, FileText, Calculator, Users, Shield } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Search,
      title: "Recherche de propriétés",
      description: "Nous vous aidons à trouver la propriété parfaite selon vos critères et votre budget."
    },
    {
      icon: Home,
      title: "Vente de biens",
      description: "Vendez votre propriété rapidement et au meilleur prix avec notre expertise du marché."
    },
    {
      icon: FileText,
      title: "Gestion locative",
      description: "Confiez-nous la gestion de vos biens locatifs pour un rendement optimal."
    },
    {
      icon: Calculator,
      title: "Évaluation immobilière",
      description: "Obtenez une estimation précise de la valeur de votre bien immobilier."
    },
    {
      icon: Users,
      title: "Conseil en investissement",
      description: "Bénéficiez de nos conseils d'experts pour vos investissements immobiliers."
    },
    {
      icon: Shield,
      title: "Accompagnement juridique",
      description: "Nous vous accompagnons dans toutes les démarches juridiques et administratives."
    }
  ];

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une gamme complète de services immobiliers pour répondre à tous vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="btn-primary">
            Découvrir tous nos services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;