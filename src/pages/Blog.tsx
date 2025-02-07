import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

function Blog() {
  const posts = [
    {
      title: 'The Complete Guide to Job Hunting in Germany',
      excerpt: 'Everything you need to know about finding your dream job in Germany, from preparation to acceptance.',
      author: 'Sarah Schmidt',
      date: 'March 15, 2024',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Understanding German Work Culture',
      excerpt: 'Learn about the unique aspects of German workplace culture and how to thrive in it.',
      author: 'Michael Weber',
      date: 'March 12, 2024',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Top Tech Companies in Germany for 2024',
      excerpt: 'Discover the most innovative and employee-friendly tech companies in Germany.',
      author: 'Thomas Mueller',
      date: 'March 10, 2024',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Career Insights</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="mx-2">•</div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </div>
                </div>
                <button className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;