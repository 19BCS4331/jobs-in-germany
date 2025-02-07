import React from 'react';
import { MapPin, Users, Star } from 'lucide-react';

function Companies() {
  const companies = [
    {
      name: 'TechCorp GmbH',
      logo: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=100&h=100',
      location: 'Berlin',
      industry: 'Technology',
      size: '1000-5000',
      rating: 4.5,
      description: 'Leading technology company specializing in cloud solutions and digital transformation.'
    },
    {
      name: 'Innovation Labs',
      logo: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&q=80&w=100&h=100',
      location: 'Munich',
      industry: 'Software',
      size: '500-1000',
      rating: 4.3,
      description: 'Innovation-driven software development company creating cutting-edge solutions.'
    },
    {
      name: 'DataWorks',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100',
      location: 'Hamburg',
      industry: 'Data Analytics',
      size: '100-500',
      rating: 4.7,
      description: 'Data analytics company helping businesses make data-driven decisions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Top Companies in Germany</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {companies.map((company, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {company.location}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {company.size} employees
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      {company.rating}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{company.description}</p>
                </div>
                <button className="md:self-start bg-blue-50 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-100 transition">
                  View Jobs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Companies;