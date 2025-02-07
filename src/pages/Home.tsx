import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Heart, Euro, Globe2, TreePine, Search, ArrowRight } from 'lucide-react';
import StatisticsSection from '../components/StatisticsSection';

function Home() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20">
          <div className="container mx-auto px-6 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Your Career Journey in
                <span className="text-indigo-400"> Germany</span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-100 max-w-2xl mb-8"
            >
              Discover opportunities in Europe's largest economy, where innovation meets tradition and work-life balance is a priority.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="group bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Search Jobs</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-white focus:ring-offset-2">
                Post a Job
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Why Germany Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Germany?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Germany offers unique advantages for professionals seeking to advance their careers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Building2 className="w-8 h-8 text-indigo-600" />,
                title: "Strong Economy",
                description: "Europe's largest economy with numerous multinational companies and startups."
              },
              {
                icon: <Euro className="w-8 h-8 text-indigo-600" />,
                title: "Competitive Salaries",
                description: "High earning potential with excellent benefits and work-life balance."
              },
              {
                icon: <Heart className="w-8 h-8 text-indigo-600" />,
                title: "Quality of Life",
                description: "Excellent healthcare, education, and social security systems."
              },
              {
                icon: <Globe2 className="w-8 h-8 text-indigo-600" />,
                title: "International Environment",
                description: "Diverse workplaces with English often used as a business language."
              },
              {
                icon: <GraduationCap className="w-8 h-8 text-indigo-600" />,
                title: "Career Growth",
                description: "Abundant opportunities for professional development and learning."
              },
              {
                icon: <TreePine className="w-8 h-8 text-indigo-600" />,
                title: "Work-Life Balance",
                description: "Generous vacation policies and emphasis on personal time."
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-indigo-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-indigo-600 py-16"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully built their careers in Germany
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-indigo-50 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-white focus:ring-offset-2">
            Get Started
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;