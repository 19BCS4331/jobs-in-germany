import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, GraduationCap, Euro } from 'lucide-react';

const stats = [
  {
    id: 1,
    name: 'Active Job Seekers',
    value: '2M+',
    icon: Users,
    description: 'Professionals looking for opportunities',
  },
  {
    id: 2,
    name: 'Companies',
    value: '50K+',
    icon: Building2,
    description: 'Top German companies hiring',
  },
  {
    id: 3,
    name: 'Success Rate',
    value: '89%',
    icon: GraduationCap,
    description: 'Job placement success rate',
  },
  {
    id: 4,
    name: 'Average Salary',
    value: '€65K',
    icon: Euro,
    description: 'Annual average salary in Germany',
  },
];

const StatisticsSection = () => {
  return (
    <div className="bg-white py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Trusted by professionals across Germany
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 text-lg leading-8 text-gray-600"
            >
              Join thousands of professionals who've found their dream job in Germany
            </motion.p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex flex-col bg-gray-400/5 p-8 backdrop-blur-sm hover:bg-gray-400/10 transition-colors duration-300"
                >
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
                  <dd className="order-first mb-3">
                    <div className="flex items-center justify-center">
                      <Icon className="h-8 w-8 text-indigo-600 mb-2" />
                    </div>
                    <div className="text-3xl font-bold tracking-tight text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                  <dd className="text-sm text-gray-500">{stat.description}</dd>
                </motion.div>
              );
            })}
          </dl>
        </div>
      </motion.div>
    </div>
  );
};

export default StatisticsSection;
