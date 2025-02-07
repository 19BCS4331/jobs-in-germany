import React from 'react';
import { FileText, Book, GraduationCap, Briefcase } from 'lucide-react';

function Resources() {
  const resources = [
    {
      category: 'Visa & Work Permits',
      items: [
        {
          title: 'German Work Visa Guide',
          description: 'Complete guide to obtaining a work visa in Germany.',
          icon: <FileText className="w-6 h-6" />
        },
        {
          title: 'Blue Card Information',
          description: 'Everything you need to know about the EU Blue Card.',
          icon: <FileText className="w-6 h-6" />
        }
      ]
    },
    {
      category: 'Language & Culture',
      items: [
        {
          title: 'German Language Resources',
          description: 'Free and paid resources for learning German.',
          icon: <Book className="w-6 h-6" />
        },
        {
          title: 'Cultural Integration Guide',
          description: 'Tips for adapting to German work culture.',
          icon: <Book className="w-6 h-6" />
        }
      ]
    },
    {
      category: 'Career Development',
      items: [
        {
          title: 'CV Writing Guide',
          description: 'How to write a German-style CV and cover letter.',
          icon: <GraduationCap className="w-6 h-6" />
        },
        {
          title: 'Interview Preparation',
          description: 'Common interview questions and best practices.',
          icon: <Briefcase className="w-6 h-6" />
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>
        
        <div className="space-y-12">
          {resources.map((category, index) => (
            <div key={index}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">{category.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="text-blue-600">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        <button className="mt-4 text-blue-600 font-medium hover:text-blue-700 transition">
                          Learn More →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Resources;