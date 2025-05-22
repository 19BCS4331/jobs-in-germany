import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, Globe2, ChevronRight, Users, BookOpen, MapPin, Euro, Briefcase, Heart, Home as HomeIcon, Train, GraduationCap, Check, Stethoscope, Utensils, TreePine, ArrowRight, Code2, Plane } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import CountUp from 'react-countup';
import germanyCityscape from '../assets/images/germany-cityscape.jpg';

// Animation variants
const fadeInUp: Variants = {
  initial: {
    y: 60,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const pulseAnimation: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 0.5
    }
  }
};


const cardHoverAnimation: Variants = {
  initial: {
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const iconHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 300
    }
  }
};

const checkmarkAnimation: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15
    }
  }
};

const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const statCardAnimation: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400
    }
  }
};


const Home: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const aboutUsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const smoothBackgroundY = useSpring(backgroundY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToAboutUs = () => {
    aboutUsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    // Add a subtle URL hash change without affecting scroll
    window.history.pushState({}, '', '#about-us');
  };


  return (
    <div className="min-h-screen bg-gray-50" ref={scrollRef}>
      {/* Hero Section with Background Image */}
      <motion.div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${germanyCityscape})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: smoothBackgroundY,
            scale: scale
          }}
        >
          {/* Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-indigo-900/70 to-black/70" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Your Career Journey in Germany
            <motion.span 
              className="block text-indigo-300 mt-2"
              variants={fadeInUp}
            >
              Starts Here
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Connect with top employers in Healthcare and IT sectors. Your skills are in demand.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.button
              className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center space-x-2 group"
              variants={buttonHover}
              whileHover="hover"
              onClick={() => navigate('/how-it-works')}
            >
              <span>How It Works</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
            <motion.button
              className="px-8 py-4 bg-indigo-600/90 text-white rounded-full font-semibold hover:bg-indigo-700 border border-indigo-400/30 backdrop-blur-sm transition-colors duration-200 flex items-center justify-center space-x-2 group"
              variants={buttonHover}
              whileHover="hover"
              onClick={scrollToAboutUs}
            >
              <span>Learn More</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { value: "137K+", label: "IT Jobs" },
              { value: "50K+", label: "Healthcare" },
              { value: "€65K+", label: "Avg. IT Salary" },
              { value: "€4.5K+/m", label: "Avg. Healthcare" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-white backdrop-blur-sm bg-white/5 rounded-lg p-4"
                variants={fadeInUp}
              >
                <motion.div
                  className="text-3xl font-bold mb-1"
                  variants={pulseAnimation}
                >
                  {stat.value}
                </motion.div>
                <div className="text-indigo-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* About Us Section */}
      <motion.div 
        ref={aboutUsRef}
        id='about-us'
        className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(79, 70, 229) 1px, transparent 0)',
            backgroundSize: '40px 40px' 
          }} 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Your Gateway to Success in Germany
            </h2>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              We bridge the gap between international talent and German employers, specializing in Healthcare and IT placements. Our comprehensive support ensures your successful transition to working life in Germany.
            </p>
          </motion.div>

          <motion.div 
            className="mt-20"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Users,
                  title: 'Industry Expertise',
                  description: 'Specialized recruitment in Healthcare & IT sectors with deep market understanding',
                  stats: '10+ Years'
                },
                {
                  icon: BookOpen,
                  title: 'Language Support',
                  description: 'Comprehensive German language training and certification preparation',
                  stats: 'A1 - B2 Level'
                },
                {
                  icon: Plane,
                  title: 'We Will Guide You',
                  description: 'Comprehensive assistance with housing, paperwork, and settling in Germany',
                  stats: 'Full Relocation Support'
                },
                {
                  icon: Globe2,
                  title: 'Success Rate',
                  description: 'Track record of successful placements and candidate satisfaction',
                  stats: '95%+'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  variants={fadeInUp}
                >
                  <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl border border-gray-100">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg w-14 h-14 flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-indigo-600 mb-2">
                      {feature.stats}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Statistics Section with Counter Animations */}
      <motion.div 
        className="py-24 bg-indigo-900 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl font-bold text-white sm:text-4xl"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              The German Advantage
            </motion.h2>
            <motion.p 
              className="mt-4 text-xl text-indigo-100"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Experience world-class working conditions and quality of life
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Digital Health Integration',
                value: 95,
                description: 'Of healthcare facilities use modern digital systems'
              },
              {
                title: 'Job Security Rate',
                value: 97,
                description: 'Employment protection and stable contracts'
              },
              {
                title: 'Work-Life Balance',
                value: 100,
                description: '30 days paid vacation & flexible hours'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20"
                variants={fadeInUp}
              >
                <h3 className="text-xl font-semibold text-white mb-6">{stat.title}</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <motion.span 
                        className="text-4xl font-bold text-white"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <CountUp end={stat.value} duration={2} suffix="%" enableScrollSpy scrollSpyOnce />
                      </motion.span>
                    </div>
                  </div>
                  <motion.div 
                    className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/20"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <motion.div 
                      style={{ width: `${stat.value}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                  </motion.div>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      
      {/* Services Section */}
      <motion.div 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900">Our Services</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* For Recruitment Agencies & Employers */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Recruitment Agencies & Employers</h3>
              <ul className="space-y-4">
                {[
                  'Pre-screened Talent Pool',
                  'German Language Trained Nurses',
                  'Seamless Candidate Referrals',
                  'Long-Term Partnership'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    </motion.div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center text-indigo-600 hover:text-indigo-500"
              >
                Looking for skilled professionals? <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/how-it-works"
                className="mt-4 block text-sm text-gray-500 hover:text-indigo-500"
              >
                Learn more about our process →
              </Link>
            </motion.div>

            {/* For Job Seekers */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Job Seekers</h3>
              <ul className="space-y-4">
                {[
                  'Career Guidance & Consultation',
                  'German Language Training',
                  'Job Matching Services',
                  'Visa & Relocation Assistance'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    </motion.div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center text-indigo-600 hover:text-indigo-500"
              >
                Take the first step towards a career in Germany <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/how-it-works"
                className="mt-4 block text-sm text-gray-500 hover:text-indigo-500"
              >
                See how it works →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Why Germany Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose Germany?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover why Germany is the perfect destination for your career growth
            </p>
          </motion.div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <motion.div
              className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="text-indigo-600 mb-4">
                <motion.div
                  variants={iconHover}
                  whileHover="hover"
                >
                  <Euro className="h-8 w-8" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Strong Economy
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Europe's largest economy with stable growth
                </li>
                <li className="flex items-start">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  High employment rate and job security
                </li>
                <li className="flex items-start">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Competitive salaries with annual increases
                </li>
              </ul>
              <div className="mt-4 p-3 bg-green-50 rounded-md">
                <p className="text-sm text-green-700">
                  <strong>Fact:</strong> Germany's GDP exceeds €4 trillion, making it the 4th largest economy globally.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="text-indigo-600 mb-4">
                <motion.div
                  variants={iconHover}
                  whileHover="hover"
                >
                  <Briefcase className="h-8 w-8" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Work-Life Balance
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  30 days paid vacation annually
                </li>
                <li className="flex items-start">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Flexible working hours and remote options
                </li>
                <li className="flex items-start">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Strong employee protection laws
                </li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Benefit:</strong> Germans work an average of 1,349 hours per year, one of the lowest in OECD countries.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow duration-300"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="text-indigo-600 mb-4">
                <motion.div
                  variants={iconHover}
                  whileHover="hover"
                >
                  <Heart className="h-8 w-8" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quality of Life
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  World-class healthcare system
                </li>
                <li className="flex items-start">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Excellent public infrastructure
                </li>
                <li className="flex items-start">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  High standard of living
                </li>
              </ul>
              <div className="mt-4 p-3 bg-purple-50 rounded-md">
                <p className="text-sm text-purple-700">
                  <strong>Rating:</strong> Germany ranks among the top 10 countries in quality of life indices.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Industry-Specific Benefits */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div
              className="bg-indigo-50 rounded-lg p-6"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <motion.div
                  variants={iconHover}
                  whileHover="hover"
                >
                  <Stethoscope className="h-6 w-6 mr-2" />
                </motion.div>
                For Healthcare Professionals
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-indigo-900">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  High demand for qualified nurses
                </li>
                <li className="flex items-start text-indigo-900">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Structured career advancement
                </li>
                <li className="flex items-start text-indigo-900">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Advanced medical technology
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-indigo-50 rounded-lg p-6"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <motion.div
                  variants={iconHover}
                  whileHover="hover"
                >
                  <Code2 className="h-6 w-6 mr-2" />
                </motion.div>
                For IT Professionals
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-indigo-900">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Thriving tech ecosystem
                </li>
                <li className="flex items-start text-indigo-900">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Innovation-driven environment
                </li>
                <li className="flex items-start text-indigo-900">
                  <motion.div
                    variants={checkmarkAnimation}
                    initial="initial"
                    animate="animate"
                  >
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  English-speaking workplaces
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Quick Facts */}
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            <motion.div
              className="bg-white rounded-lg p-4 text-center border border-gray-100"
              variants={statCardAnimation}
              whileHover="hover"
              initial="initial"
              animate="animate"
              viewport={{ once: true }}
            >
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                #1
              </div>
              <p className="text-sm text-gray-600">
                Most Innovative Economy in Europe
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg p-4 text-center border border-gray-100"
              variants={statCardAnimation}
              whileHover="hover"
              initial="initial"
              animate="animate"
              viewport={{ once: true }}
            >
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                83M+
              </div>
              <p className="text-sm text-gray-600">
                Population with High Purchasing Power
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg p-4 text-center border border-gray-100"
              variants={statCardAnimation}
              whileHover="hover"
              initial="initial"
              animate="animate"
              viewport={{ once: true }}
            >
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                Top 5
              </div>
              <p className="text-sm text-gray-600">
                Global Healthcare System
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg p-4 text-center border border-gray-100"
              variants={statCardAnimation}
              whileHover="hover"
              initial="initial"
              animate="animate"
              viewport={{ once: true }}
            >
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                100%
              </div>
              <p className="text-sm text-gray-600">
                Healthcare Coverage
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Key Facts About Germany */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Germany by the Numbers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover the opportunities waiting for you
            </p>
          </motion.div>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <motion.div
              className="text-center"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-indigo-600 mb-8">Healthcare & Nursing</h3>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    €<CountUp end={4500} duration={2.5} enableScrollSpy scrollSpyOnce />+
                  </div>
                  <p className="text-gray-600">Average Nurse Salary</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    <CountUp end={50000} duration={2} enableScrollSpy scrollSpyOnce />+
                  </div>
                  <p className="text-gray-600">Nursing Job Openings</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    <CountUp end={2000} duration={2} enableScrollSpy scrollSpyOnce />+
                  </div>
                  <p className="text-gray-600">Hospitals in Germany</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    <CountUp end={95} duration={2.5} enableScrollSpy scrollSpyOnce />%
                  </div>
                  <p className="text-gray-600">Digital Health Adoption</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="text-center"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-indigo-600 mb-8">IT & Technology</h3>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    €<CountUp end={65000} duration={2.5} enableScrollSpy scrollSpyOnce />+
                  </div>
                  <p className="text-gray-600">Average IT Salary</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    <CountUp end={137000} duration={2.5} enableScrollSpy scrollSpyOnce />+
                  </div>
                  <p className="text-gray-600">IT Job Vacancies</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    <CountUp end={100} duration={2} enableScrollSpy scrollSpyOnce />B+
                  </div>
                  <p className="text-gray-600">IT Market Size (€)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    <CountUp end={5} duration={1.5} enableScrollSpy scrollSpyOnce />%
                  </div>
                  <p className="text-gray-600">Annual IT Growth Rate</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Work Benefits Section */}
          <motion.div
            className="mt-16 text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-indigo-600 mb-8">German Work Benefits</h3>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  <CountUp end={40} duration={2} enableScrollSpy scrollSpyOnce />h
                </div>
                <p className="text-gray-600">Work Week</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  <CountUp end={97} duration={2.5} enableScrollSpy scrollSpyOnce />%
                </div>
                <p className="text-gray-600">Job Security Rate</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  <CountUp end={6} duration={1.5} enableScrollSpy scrollSpyOnce />+
                </div>
                <p className="text-gray-600">Weeks Paid Sick Leave</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  <CountUp end={12} duration={2} enableScrollSpy scrollSpyOnce />+
                </div>
                <p className="text-gray-600">Months Parental Leave</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Living in Germany */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Living in Germany
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience a high quality of life in one of Europe's most welcoming countries
            </p>
          </motion.div>

          {/* Main Categories Grid */}
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Housing & Cost of Living */}
            <motion.div
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="p-6">
                <div className="text-indigo-600 mb-4">
                  <motion.div
                    variants={iconHover}
                    whileHover="hover"
                  >
                    <HomeIcon className="h-8 w-8" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Housing & Cost of Living
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    Average rent: €800-1200/month
                    <span className="ml-2 text-sm text-indigo-600 cursor-help" title="Based on a 60m² apartment in major cities">ℹ️</span>
                  </li>
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    Utilities: €150-250/month
                    <span className="ml-2 text-sm text-indigo-600 cursor-help" title="Including electricity, heating, cooling, water, garbage">ℹ️</span>
                  </li>
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    Public transport: €70-90/month
                    <span className="ml-2 text-sm text-indigo-600 cursor-help" title="Monthly pass for all public transport">ℹ️</span>
                  </li>
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    Internet & mobile: €40-60/month
                  </li>
                </ul>
                <div className="mt-4 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Costs may vary by city and region
                </div>
              </div>
            </motion.div>

            {/* Healthcare System */}
            <motion.div
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="p-6">
                <div className="text-indigo-600 mb-4">
                  <motion.div
                    variants={iconHover}
                    whileHover="hover"
                  >
                    <Stethoscope className="h-8 w-8" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Healthcare System
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    Universal healthcare coverage
                    <span className="ml-2 text-sm text-indigo-600 cursor-help" title="Coverage starts from your first day of employment">ℹ️</span>
                  </li>
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    Choice of public/private insurance
                  </li>
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    Family coverage included
                    <span className="ml-2 text-sm text-indigo-600 cursor-help" title="Spouse and children are covered at no extra cost">ℹ️</span>
                  </li>
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    Minimal waiting times
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <p className="text-sm text-green-700">
                    <strong>Did you know?</strong> Germany has one of the world's oldest universal healthcare systems, established in 1883.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Education & Language */}
            <motion.div
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="p-6">
                <div className="text-indigo-600 mb-4">
                  <motion.div
                    variants={iconHover}
                    whileHover="hover"
                  >
                    <GraduationCap className="h-8 w-8" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Education & Language
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    Free public education
                  </li>
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    Government-funded language courses
                    <span className="ml-2 text-sm text-indigo-600 cursor-help" title="Integration courses include up to 600 hours of language training">ℹ️</span>
                  </li>
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    International schools available
                  </li>
                  <li className="flex items-center">
                    <motion.div
                      variants={checkmarkAnimation}
                      initial="initial"
                      animate="animate"
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    </motion.div>
                    English widely spoken in workplace
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-indigo-50 rounded-md">
                  <p className="text-sm text-indigo-700">
                    <strong>Pro Tip:</strong> Many companies offer additional language training for international employees.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Features */}
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            <motion.div
              className="text-center group"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="bg-indigo-50 rounded-lg p-6 transition-all duration-300 group-hover:bg-indigo-100">
                <motion.div
                  variants={iconHover}
                  whileHover="hover"
                >
                  <Train className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                </motion.div>
                <h4 className="font-semibold text-gray-900">Transportation</h4>
                <p className="mt-2 text-sm text-gray-600">High-speed rail network connecting all major cities</p>
                <p className="mt-2 text-xs text-indigo-600">ICE trains reach speeds of 300 km/h</p>
              </div>
            </motion.div>

            <motion.div
              className="text-center group"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="bg-indigo-50 rounded-lg p-6 transition-all duration-300 group-hover:bg-indigo-100">
                <motion.div
                  variants={iconHover}
                  whileHover="hover"
                >
                  <Utensils className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                </motion.div>
                <h4 className="font-semibold text-gray-900">Food & Culture</h4>
                <p className="mt-2 text-sm text-gray-600">Rich culinary traditions and festivals</p>
                <p className="mt-2 text-xs text-indigo-600">Over 5,000 types of German beer</p>
              </div>
            </motion.div>

            <motion.div
              className="text-center group"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="bg-indigo-50 rounded-lg p-6 transition-all duration-300 group-hover:bg-indigo-100">
                <motion.div
                  variants={iconHover}
                  whileHover="hover"
                >
                  <TreePine className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                </motion.div>
                <h4 className="font-semibold text-gray-900">Nature & Recreation</h4>
                <p className="mt-2 text-sm text-gray-600">From Alps to Baltic Sea beaches</p>
                <p className="mt-2 text-xs text-indigo-600">16 national parks to explore</p>
              </div>
            </motion.div>

            <motion.div
              className="text-center group"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="bg-indigo-50 rounded-lg p-6 transition-all duration-300 group-hover:bg-indigo-100">
                <motion.div
                  variants={iconHover}
                  whileHover="hover"
                >
                  <Users className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
                </motion.div>
                <h4 className="font-semibold text-gray-900">Community</h4>
                <p className="mt-2 text-sm text-gray-600">Vibrant international communities</p>
                <p className="mt-2 text-xs text-indigo-600">Over 10 million expats in Germany</p>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            className="mt-12 text-center"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-600">
              Ready to start your journey in Germany? Let us help you make the transition smooth and successful.
            </p>
            <motion.button
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              variants={buttonHover}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <motion.div 
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">What Our Candidates & Partners Say</h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <motion.div
              className="bg-gray-50 rounded-lg p-8"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <p className="text-gray-600 italic">"I secured my nursing job in Germany thanks to their support and language training!"</p>
              <p className="mt-4 font-medium">Maria K., Registered Nurse</p>
            </motion.div>
            <motion.div
              className="bg-gray-50 rounded-lg p-8"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <p className="text-gray-600 italic">"An excellent partner for IT recruitment. Reliable, professional, and efficient."</p>
              <p className="mt-4 font-medium">HR Director, German IT Firm</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Get in Touch with Us</h2>
            <p className="mt-4 text-lg text-gray-500">Let's Connect & Grow Together!</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <motion.a
              href="mailto:info@thegermanyjobs.com"
              className="flex items-center justify-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div
                variants={iconHover}
                whileHover="hover"
              >
                <Mail className="h-6 w-6 text-indigo-600 mr-3" />
              </motion.div>
              <span className="text-gray-900">info@thegermanyjobs.com</span>
            </motion.a>
            <motion.a
              href="tel:+919819761300"
              className="flex items-center justify-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div
                variants={iconHover}
                whileHover="hover"
              >
                <Phone className="h-6 w-6 text-indigo-600 mr-3" />
              </motion.div>
              <span className="text-gray-900">+91 9819761300</span>
            </motion.a>
            <motion.div
              className="flex items-center justify-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div
                variants={iconHover}
                whileHover="hover"
              >
                <MapPin className="h-6 w-6 text-indigo-600 mr-3" />
              </motion.div>
              <span className="text-gray-900">Germany</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;