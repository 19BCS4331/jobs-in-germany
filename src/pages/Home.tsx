import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { getJobs, getCompanies } from '../lib/api';
import { Briefcase, Building2, MapPin, Euro, ChevronRight, Users, Globe2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Job as ApiJob, Company as ApiCompany } from '../lib/api';
import AnimatedCounter from '../components/AnimatedCounter';

type Job = ApiJob;
type Company = ApiCompany;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home: React.FC = () => {
  const { user, profile } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, companiesData] = await Promise.all([
          getJobs(),
          getCompanies()
        ]);

        setFeaturedJobs(jobsData.slice(0, 6));
        setTopCompanies(companiesData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        className="relative bg-white overflow-hidden pt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
            <div className="pt-6 mx-auto max-w-7xl px-4 sm:pt-10 sm:px-6 md:pt-12 lg:pt-16 lg:px-8 xl:pt-20">
              <div className="sm:text-center lg:text-left">
                <motion.h1 
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="block xl:inline">Launch Your Career in</span>{' '}
                  <span className="block text-indigo-600 xl:inline">Germany</span>
                </motion.h1>
                <motion.p 
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Connect with top German companies, explore exciting job opportunities, and build your future in Europe's largest economy.
                </motion.p>
                <motion.div 
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="rounded-md shadow">
                    <Link
                      to={user ? profile?.user_type === 'employer' ? "/dashboard" : "/jobs" : "/signin"}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:scale-105"
                    >
                      {user ? profile?.user_type === 'employer' ? "Go to Dashboard" : "Explore Jobs" : "Sign In"}
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    {user ? (
                      <Link
                        to="/dashboard/profile-settings"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:scale-105"
                      >
                        View Profile
                      </Link>
                    ) : (
                      <Link
                        to="/signup"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:scale-105"
                      >
                        Get Started
                      </Link>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        <motion.div 
          className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1467226632440-65f0b4957563?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
            alt="Berlin cityscape"
          />
        </motion.div>
      </motion.div>

      {/* Why Germany Section */}
      <motion.div 
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Germany?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Discover the advantages of building your career in one of Europe's most dynamic economies
            </p>
          </motion.div>

          <motion.div 
            className="mt-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Euro,
                  title: 'Strong Economy',
                  description: "Europe's largest economy with excellent job security and competitive salaries"
                },
                {
                  icon: Users,
                  title: 'Work-Life Balance',
                  description: 'Enjoy generous vacation days, flexible working hours, and strong worker protection laws'
                },
                {
                  icon: Globe2,
                  title: 'International Environment',
                  description: 'Work in diverse teams with English often used as a business language'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
                  variants={fadeInUp}
                >
                  <div className="bg-indigo-50 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Key Facts About Germany */}
      <motion.div 
        className="bg-indigo-700"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-center text-3xl font-extrabold text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Key Facts About Working in Germany
          </motion.h2>
          <motion.div 
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { number: '82M+', label: 'Population' },
              { number: '#1', label: 'Economy in Europe' },
              { number: '30', label: 'Days Minimum Vacation' },
              { number: '€4K+', label: 'Average Monthly Salary' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
              >
                <AnimatedCounter value={stat.number} label={stat.label} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Living in Germany */}
      <motion.div 
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Living in Germany
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Germany offers an exceptional quality of life with its rich culture, efficient infrastructure, and comprehensive social security system.
              </p>
              <motion.div 
                className="mt-8 space-y-4"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[
                  'Universal healthcare coverage',
                  'Excellent public transportation',
                  'Rich cultural heritage and modern lifestyle',
                  'High standard of living',
                  'Family-friendly environment',
                  'Safe and stable society'
                ].map((item) => (
                  <motion.div 
                    key={item} 
                    className="flex items-center"
                    variants={fadeInUp}
                  >
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">{item}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div 
              className="mt-10 lg:mt-0"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                className="rounded-lg shadow-lg"
                src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Life in Germany"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Globe2,
                title: 'International Opportunities',
                description: 'Connect with German companies looking for international talent'
              },
              {
                icon: Users,
                title: 'Skilled Professional Network',
                description: 'Join a community of skilled professionals in Germany'
              },
              {
                icon: TrendingUp,
                title: 'Career Growth',
                description: 'Find opportunities that match your skills and advance your career'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="relative p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                variants={fadeInUp}
              >
                <div className="absolute top-6 left-6 bg-indigo-100 rounded-lg p-3">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Jobs Section */}
      <motion.div 
        className="py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
            <Link to="/jobs" className="text-indigo-600 hover:text-indigo-500 flex items-center">
              View all jobs <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {isLoading ? (
              // Loading skeletons
              Array(6).fill(0).map((_, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-sm animate-pulse"
                  variants={fadeInUp}
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="ml-4 h-4 w-48 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : featuredJobs?.length > 0 ? (
              featuredJobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                        {job.title}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Euro className="h-4 w-4 mr-2" />
                      {job.salary_min} - {job.salary_max}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.requirements?.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requirements && job.requirements.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{job.requirements.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <div className="text-gray-500">No jobs found</div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Top Companies Section */}
      <motion.div 
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Top Companies</h2>
            <Link to="/companies" className="text-indigo-600 hover:text-indigo-500 flex items-center">
              View all companies <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {isLoading ? (
              // Loading skeletons for companies
              Array(4).fill(0).map((_, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
                  variants={fadeInUp}
                >
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  </div>
                </motion.div>
              ))
            ) : topCompanies?.length > 0 ? (
              topCompanies.map((company) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.id}`}
                  className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
                >
                  <div className="flex items-center mb-4">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                    {company.name}
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {company.location}
                    </div>
                    <div className="flex items-center mt-1">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {company.industry}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <div className="text-gray-500">No companies found</div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="bg-indigo-700"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-indigo-200">Start your job search today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                {user ? "Go to Dashboard" : "Get Started"}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;