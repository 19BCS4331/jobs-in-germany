import React, { useEffect, useState } from 'react';
import { FileText, Book, GraduationCap, Briefcase } from 'lucide-react';
import { getResources, type Resource } from '../lib/api';

const iconMap = {
  FileText: <FileText className="w-6 h-6" />,
  Book: <Book className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />
};

function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        setResources(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
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

  // Group resources by category
  const resourcesByCategory = resources.reduce<Record<string, Resource[]>>((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>
        
        <div className="space-y-12">
          {Object.entries(resourcesByCategory).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="text-blue-600">
                        {iconMap[item.icon as keyof typeof iconMap]}
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