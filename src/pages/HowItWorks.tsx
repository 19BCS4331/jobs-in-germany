import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileCheck, Users, GraduationCap, Building2, Plane, FileText, MessageCircle, Briefcase, ChevronRight, ArrowRight, CheckCircle2, ArrowDownCircle } from 'lucide-react';
import FlipCard from '../components/FlipCard';
import ProgressBar from '../components/ProgressBar';

// Enhanced animation variants with spring physics
const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: springTransition
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25
    }
  },
  hover: {
    scale: 1.01,
    y: -3,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25
    }
  }
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const shimmerEffect = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
      repeatDelay: 1
    }
  }
};

const HowItWorks: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Hero Section */}
      <motion.div 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springTransition}
      >
        {/* Animated Background Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-[0.15]"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1, ...springTransition }}
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(79, 70, 229) 1px, transparent 0)',
            backgroundSize: '40px 40px' 
          }} 
        />
        
        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...springTransition }}
              className="inline-block mb-8 relative overflow-hidden group"
            >
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-6 py-2 rounded-full inline-block relative overflow-hidden">
                <span className="relative z-10">4 Simple Steps</span>
                <motion.div 
                  className="absolute inset-0 bg-indigo-200/50 rounded-full -z-[1]"
                  variants={shimmerEffect}
                  initial="initial"
                  animate="animate"
                />
              </span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.div
              variants={floatingAnimation}
              initial="initial"
              animate="animate"
              className="mb-8"
            >
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 leading-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ...springTransition }}
              >
                Your Journey to a<br />
                <span className="text-gray-900">German Career</span>
              </motion.h1>
            </motion.div>

            {/* Description */}
            <motion.p 
              className="mt-8 text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, ...springTransition }}
            >
              We've streamlined the process of finding and securing your dream job in Germany. 
              Our proven four-step pathway ensures a smooth transition to your new career.
            </motion.p>

            {/* Key Features */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {[
                {
                  title: "Guided Process",
                  description: "Step-by-step support from application to relocation"
                },
                {
                  title: "Expert Support",
                  description: "Dedicated team of recruitment and relocation specialists"
                },
                {
                  title: "Proven Success",
                  description: "95%+ success rate in job placements"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="relative bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-50 overflow-hidden group"
                  variants={cardHover}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: hoveredCard === index ? 5 : 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 25
                    }}
                  >
                    <CheckCircle2 className="h-8 w-8 text-indigo-600 mb-4" />
                  </motion.div>
                  <motion.h3 
                    className="text-lg font-semibold text-gray-900 mb-2"
                    animate={{ 
                      scale: hoveredCard === index ? 1.05 : 1,
                      color: hoveredCard === index ? "#4F46E5" : "#111827"
                    }}
                    transition={springTransition}
                  >
                    {feature.title}
                  </motion.h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <motion.div 
                    className="absolute inset-0 bg-indigo-50/50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={springTransition}
              >
                <ArrowDownCircle className="h-10 w-10 text-indigo-600 animate-bounce cursor-pointer" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <motion.div 
          className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute top-1/2 right-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      {/* Statistics Section */}
      <motion.section 
        className="py-24 bg-gradient-radial from-indigo-50/50 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={springTransition}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={fadeInUp}
            >
              Our Success Metrics
            </motion.h2>
            <p className="text-lg text-gray-600">
              We take pride in our proven track record of helping professionals like you succeed in Germany.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              <ProgressBar
                label="Digital Health Adoption"
                value={95}
                color="indigo"
              />
              <ProgressBar
                label="Job Security Rate"
                value={97}
                color="indigo"
              />
              <ProgressBar
                label="Healthcare Coverage"
                value={100}
                color="indigo"
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  front: (
                    <div className="h-full flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-indigo-50">
                      <Users className="h-12 w-12 text-indigo-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Expert Support
                      </h3>
                      <p className="text-gray-600 text-center">
                        Click to learn more about our dedicated team
                      </p>
                    </div>
                  ),
                  back: (
                    <div className="h-full flex flex-col items-center justify-center p-6 bg-indigo-600 rounded-xl text-white">
                      <h3 className="text-xl font-semibold mb-4">
                        What You Get
                      </h3>
                      <ul className="text-sm space-y-2 text-center">
                        <li>• Personal Career Advisor</li>
                        <li>• Immigration Specialists</li>
                        <li>• Language Training Support</li>
                        <li>• Cultural Integration Guide</li>
                      </ul>
                    </div>
                  )
                },
                {
                  front: (
                    <div className="h-full flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-indigo-50">
                      <Building2 className="h-12 w-12 text-indigo-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Partner Network
                      </h3>
                      <p className="text-gray-600 text-center">
                        Click to explore our extensive network
                      </p>
                    </div>
                  ),
                  back: (
                    <div className="h-full flex flex-col items-center justify-center p-6 bg-indigo-600 rounded-xl text-white">
                      <h3 className="text-xl font-semibold mb-4">
                        Our Network Includes
                      </h3>
                      <ul className="text-sm space-y-2 text-center">
                        <li>• Top German Employers</li>
                        <li>• Healthcare Institutions</li>
                        <li>• Housing Partners</li>
                        <li>• Integration Services</li>
                      </ul>
                    </div>
                  )
                }
              ].map((card, index) => (
                <div key={index} className="h-48">
                  <FlipCard
                    front={card.front}
                    back={card.back}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* For Job Seekers */}
      <motion.div 
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
          <div className="text-center max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-sm font-medium px-4 py-1.5 rounded-full"
            >
              For Job Seekers
            </motion.span>
            <motion.h2 
              className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Your Path to Success in Germany
            </motion.h2>
            <motion.p 
              className="mt-6 text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              We guide you through every step of your journey, from application to relocation
            </motion.p>
          </div>

          <motion.div 
            className="mt-20"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: FileText,
                  title: 'Submit Your Profile',
                  description: 'Share your qualifications and career goals',
                  details: [
                    'Complete online application',
                    'Submit required documents',
                    'Specify preferred locations',
                    'Indicate availability'
                  ]
                },
                {
                  icon: GraduationCap,
                  title: 'Language Training',
                  description: 'Achieve B1/B2 Goethe certification',
                  details: [
                    'Assessment of current level',
                    'Customized learning plan',
                    'Regular progress tracking',
                    'Exam preparation support'
                  ]
                },
                {
                  icon: MessageCircle,
                  title: 'Job Matching',
                  description: 'Connect with verified employers',
                  details: [
                    'Profile presentation',
                    'Interview preparation',
                    'Salary negotiation support',
                    'Contract review assistance'
                  ]
                },
                {
                  icon: Plane,
                  title: 'Relocation Support',
                  description: 'Guidance through the entire process',
                  details: [
                    'Visa application help',
                    'Housing assistance',
                    'Bank account setup',
                    'Local registration support'
                  ]
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative bg-white rounded-xl p-8 border border-gray-100"
                  // variants={fadeInUp}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  variants={cardHover}
                >
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl w-14 h-14 flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110">
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="absolute top-8 right-8 text-5xl font-bold text-indigo-50">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-gray-600 group">
                        <ArrowRight className="h-4 w-4 text-indigo-500 mr-2 transition-transform duration-200 group-hover:translate-x-1" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* For Recruitment Agencies & Employers */}
      <motion.div 
        className="py-10 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-sm font-medium px-4 py-1.5 rounded-full"
            >
              For Employers
            </motion.span>
            <motion.h2 
              className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Partner with Us to Access Top Talent
            </motion.h2>
            <motion.p 
              className="mt-6 text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              A streamlined process to connect with qualified healthcare and IT professionals ready to work in Germany
            </motion.p>
          </div>

          <motion.div 
            className="mt-20"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  icon: FileCheck,
                  title: 'Partner with Us',
                  description: "Sign up as a partner and share your requirements. We'll understand your needs and create a customized talent pipeline.",
                  details: [
                    'Complete partnership agreement',
                    'Define your hiring criteria',
                    'Set recruitment timeline',
                    'Discuss terms and conditions'
                  ]
                },
                {
                  icon: Users,
                  title: 'Access Pre-Screened Talent',
                  description: 'Get access to our database of qualified nurses and IT professionals who meet German standards.',
                  details: [
                    'View detailed candidate profiles',
                    'Access language certifications',
                    'Review technical qualifications',
                    'Check availability status'
                  ]
                },
                {
                  icon: Briefcase,
                  title: 'Complete Hiring Process',
                  description: 'We handle the initial screening while you focus on final selection and legal requirements.',
                  details: [
                    'Interview shortlisted candidates',
                    'Make job offers',
                    'Handle employment contracts',
                    'Support visa process'
                  ]
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative bg-white rounded-xl p-8 border border-gray-100"
                  // variants={fadeInUp}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  variants={cardHover}
                >
                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl w-14 h-14 flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110">
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="absolute top-8 right-8 text-5xl font-bold text-indigo-50">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-gray-600 group">
                        <ArrowRight className="h-4 w-4 text-indigo-500 mr-2 transition-transform duration-200 group-hover:translate-x-1" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
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
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">Let's discuss your needs.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HowItWorks;
