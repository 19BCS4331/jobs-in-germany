import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { 
  Check, 
  GraduationCap, 
  BookOpen, 
  ArrowRight, 
  Building2, 
  Briefcase, 
  Users, 
  Award,
  Lightbulb,
  School,
} from 'lucide-react';
import germanUniversityImage from '../assets/images/germany-university.jpg';

// Animation variants
const fadeInUp: Variants = {
  initial: { y: 60, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } }
};

const pulseAnimation: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }
  }
};

const cardHoverAnimation: Variants = {
  initial: {
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  hover: {
    scale: 1.01,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 200, damping: 25 }
  }
};

const iconHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.01,
    rotate: 5,
    transition: { type: "spring", stiffness: 200, damping: 25 }
  }
};

const checkmarkAnimation: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 15 }
  }
};

const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.01,
    transition: { type: "spring", stiffness: 200, damping: 25 }
  }
};

const statCardAnimation: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  hover: {
    y: -3,
    transition: { type: "spring", stiffness: 200 }
  }
};

const StudyInGermany: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
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
            backgroundImage: `url(${germanUniversityImage})`,
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
            Study in Germany
            <motion.span 
              className="block text-indigo-300 mt-2"
              variants={fadeInUp}
            >
              Unlock Global Opportunities
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Pursue world-class education in one of the most innovative and student-friendly countries in Europe. We're here to guide you at every step.
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
              onClick={() => navigate('/contact')}
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
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
              { value: "400+", label: "Universities" },
              { value: "20K+", label: "Programs" },
              { value: "€0", label: "Tuition (Public)" },
              { value: "350K+", label: "Int'l Students" }
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
              Why Germany?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover why Germany is the perfect destination for your educational journey
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
                <motion.div variants={iconHover} whileHover="hover">
                  <GraduationCap className="h-8 w-8" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                World-Class Education
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Globally recognized universities and degrees
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Excellence in engineering, sciences, medicine, and business
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Research-focused academic environment
                </li>
              </ul>
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
                <motion.div variants={iconHover} whileHover="hover">
                  <Award className="h-8 w-8" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Affordable Tuition
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Low-cost or tuition-free public universities
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Minimal semester fees covering student services
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Numerous scholarship opportunities
                </li>
              </ul>
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
                <motion.div variants={iconHover} whileHover="hover">
                  <Lightbulb className="h-8 w-8" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Innovation Hub
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Leader in research and technology
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Strong industry-academia collaborations
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Access to cutting-edge research facilities
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div
              className="bg-indigo-50 rounded-lg p-6"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <motion.div variants={iconHover} whileHover="hover">
                  <Users className="h-6 w-6 mr-2" />
                </motion.div>
                Vibrant Student Life
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-indigo-900">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Multicultural environment with students from 170+ countries
                </li>
                <li className="flex items-start text-indigo-900">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Diverse cities with rich cultural heritage
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
                <motion.div variants={iconHover} whileHover="hover">
                  <Briefcase className="h-6 w-6 mr-2" />
                </motion.div>
                Work Opportunities
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-indigo-900">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Part-time work allowed during studies (20 hrs/week)
                </li>
                <li className="flex items-start text-indigo-900">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  18-month post-study work visa
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Programs & Universities */}
      <motion.div 
        className="py-24 bg-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
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
              Programs & Universities
            </h2>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              From bachelor's to doctoral degrees, Germany offers a wide range of programs across disciplines at renowned institutions.
            </p>
          </motion.div>

          <motion.div 
            className="mt-20"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {[
                {
                  icon: Building2,
                  title: 'Bachelor\'s Programs',
                  description: 'Undergraduate degrees in various fields with English and German options',
                  stats: '3-4 Years'
                },
                {
                  icon: School,
                  title: 'Master\'s Programs',
                  description: 'Specialized graduate degrees with research opportunities',
                  stats: '1-2 Years'
                },
                {
                  icon: BookOpen,
                  title: 'PhD Programs',
                  description: 'Research-focused doctoral studies at leading institutions',
                  stats: '3-5 Years'
                }
              ].map((program, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  variants={fadeInUp}
                >
                  <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl border border-gray-100">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg w-14 h-14 flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110">
                      <program.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-indigo-600 mb-2">
                      {program.stats}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{program.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{program.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            className="mt-16 bg-indigo-50 rounded-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">Future University Partnerships</h3>
            <p className="text-indigo-700">
              Stay tuned as we announce our official university partnerships – giving you direct access to prestigious institutions in Germany.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Our Services */}
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
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive support for your educational journey in Germany
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Counseling & Application</h3>
              <ul className="space-y-4">
                {[
                  'Personalized program and university selection',
                  'Documentation preparation and review',
                  'Statement of purpose and CV assistance',
                  'Application submission guidance'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    </motion.div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-lg p-8"
              variants={cardHoverAnimation}
              initial="initial"
              whileHover="hover"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Visa & Ongoing Support</h3>
              <ul className="space-y-4">
                {[
                  'Student visa application assistance',
                  'Pre-departure orientation',
                  'Accommodation guidance',
                  'Settling-in and part-time job support'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    </motion.div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div 
        className="py-16 bg-white"
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
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Us</h2>
            <p className="mt-4 text-lg text-gray-600">
              Your trusted partner for international education
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              {
                title: 'Trusted Advisors',
                description: 'Years of experience guiding students to successful admissions'
              },
              {
                title: 'Direct Collaborations',
                description: 'Partnerships with German universities for streamlined applications'
              },
              {
                title: 'Experienced Counselors',
                description: 'Specialized knowledge of German education system'
              },
              {
                title: 'End-to-End Services',
                description: 'Support from course selection to settling in Germany'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-indigo-50 rounded-lg p-6 text-center"
                variants={statCardAnimation}
                whileHover="hover"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-indigo-900 mb-3">{item.title}</h3>
                <p className="text-indigo-700">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white"
            >
              Ready to start your educational journey in Germany?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto"
            >
              Contact us today for a free consultation and take the first step towards studying in Germany.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyInGermany;