import React from 'react';
import { Search, MapPin, Euro, Clock } from 'lucide-react';

function Jobs() {
  const jobs = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp GmbH',
      location: 'Berlin',
      salary: '65,000€ - 85,000€',
      type: 'Full-time',
      posted: '2 days ago'
    },
    {
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'Munich',
      salary: '55,000€ - 75,000€',
      type: 'Full-time',
      posted: '3 days ago'
    },
    {
      title: 'Data Scientist',
      company: 'DataWorks',
      location: 'Hamburg',
      salary: '60,000€ - 80,000€',
      type: 'Full-time',
      posted: '1 week ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 page-transition">
      <div className="container mx-auto px-6">
        {/* Search Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5 transition-transform group-focus-within:scale-110" />
              <input
                type="text"
                placeholder="Job title or keyword"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5 transition-transform group-focus-within:scale-110" />
              <input
                type="text"
                placeholder="Location"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-lg"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:bg-blue-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Search Jobs
            </button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600 mt-1">{job.company}</p>
                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center text-gray-500 transition-transform hover:scale-105">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-gray-500 transition-transform hover:scale-105">
                      <Euro className="w-4 h-4 mr-1" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-gray-500 transition-transform hover:scale-105">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.posted}
                    </div>
                  </div>
                </div>
                <button className="mt-4 md:mt-0 bg-blue-50 text-blue-600 px-6 py-2 rounded-lg transition-all duration-200 hover:bg-blue-100 hover:scale-105 active:scale-95">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Jobs;