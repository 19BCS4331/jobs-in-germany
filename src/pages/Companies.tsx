import React, { useEffect, useState } from 'react';
import { MapPin, Users, Star } from 'lucide-react';
import { getCompanies, type Company } from '../lib/api';
import { Link } from 'react-router-dom';

function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Top Companies in Germany</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {companies.map((company) => (
            <div key={company.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <img
                  src={company.logo_url}
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
                      {company.star_rating}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{company.description}</p>
                </div>
                <Link 
                  to={`/jobs?company=${company.id}`}
                  className="md:self-start bg-blue-50 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-100 transition"
                >
                  View Jobs
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Companies;