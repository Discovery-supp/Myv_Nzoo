import React from 'react';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';

const FeaturedProperties = () => {
  const properties = [
    {
      id: 1,
      title: "Villa moderne à Cocody",
      location: "Cocody, Abidjan",
      price: "250 000 000",
      image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      beds: 4,
      baths: 3,
      area: 350,
      type: "Villa"
    },
    {
      id: 2,
      title: "Appartement de luxe à Plateau",
      location: "Plateau, Abidjan",
      price: "180 000 000",
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      beds: 3,
      baths: 2,
      area: 120,
      type: "Appartement"
    },
    {
      id: 3,
      title: "Maison familiale à Marcory",
      location: "Marcory, Abidjan",
      price: "120 000 000",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      beds: 5,
      baths: 3,
      area: 280,
      type: "Maison"
    },
    {
      id: 4,
      title: "Penthouse avec vue mer",
      location: "Zone 4, Abidjan",
      price: "400 000 000",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      beds: 4,
      baths: 4,
      area: 200,
      type: "Penthouse"
    },
    {
      id: 5,
      title: "Villa avec piscine à Riviera",
      location: "Riviera, Abidjan",
      price: "320 000 000",
      image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      beds: 6,
      baths: 4,
      area: 450,
      type: "Villa"
    },
    {
      id: 6,
      title: "Studio moderne à Yopougon",
      location: "Yopougon, Abidjan",
      price: "45 000 000",
      image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      beds: 1,
      baths: 1,
      area: 45,
      type: "Studio"
    }
  ];

  return (
    <section id="proprietes" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Propriétés en vedette
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de propriétés exceptionnelles dans les meilleurs quartiers d'Abidjan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {property.type}
                  </span>
                </div>
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {property.title}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.area}m²</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-600">
                    {property.price} FCFA
                  </div>
                  <button className="btn-primary text-sm">
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-secondary">
            Voir toutes les propriétés
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;