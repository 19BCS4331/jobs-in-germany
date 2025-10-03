import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { 
  Check, 
  ArrowRight, 
  Building2, 
  Users, 
  Globe,
  Award,
  Calendar,
  Code,
  Briefcase,
  Landmark,
  Plane,
  Hotel,
  CreditCard,
} from 'lucide-react';
import partners from '../assets/images/partners.jpg';

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

const AboutUs: React.FC = () => {
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
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${partners})`,
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
            About Us
            <motion.span 
              className="block text-indigo-300 mt-2"
              variants={fadeInUp}
            >
              The Germany Jobs & Maraekat Infotech
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Connecting talent with opportunities
          </motion.p>
        </div>
      </motion.div>

      {/* TheGermanyJobs Section */}
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
              The Germany Jobs
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              An initiative by Maraekat Infotech Limited dedicated to connecting talented professionals with exceptional career opportunities in Germany.
            </p>
          </motion.div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <motion.div
              className="bg-white rounded-lg shadow-sm p-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="text-indigo-600 mb-4">
                <motion.div variants={iconHover} whileHover="hover">
                  <Briefcase className="h-8 w-8" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 mb-6">
                We bridge the gap between international talent and German employers, focusing on the healthcare and IT sectors where demand is highest. Our mission is to simplify the complex process of international recruitment while ensuring both employers and job seekers find their perfect match.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Specialized in nursing and IT recruitment
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  End-to-end support for international candidates
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Tailored solutions for German employers
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg shadow-sm p-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="text-indigo-600 mb-4">
                <motion.div variants={iconHover} whileHover="hover">
                  <Globe className="h-8 w-8" />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Our Services
              </h3>
              <p className="text-gray-600 mb-6">
                We provide comprehensive support throughout the entire recruitment and relocation process, ensuring a smooth transition for professionals moving to Germany.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Job matching and placement services
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Visa and work permit assistance
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Relocation support and cultural integration
                </li>
                <li className="flex items-start">
                  <motion.div variants={checkmarkAnimation} initial="initial" animate="animate">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  </motion.div>
                  Language training resources
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Maraekat Company Section */}
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
              Maraekat Infotech Limited
            </h2>
            <div className="flex items-center justify-center mt-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">ISO 9001:2008 Certified</span>
            </div>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              A technology leader delivering innovative solutions globally since 1993
            </p>
          </motion.div>

          {/* Company History */}
          <motion.div
            className="mt-16 bg-white rounded-lg shadow-lg p-8"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 rounded-full p-3 mr-4">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our History</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Conceptualized in 1993, Maraekat Infotech Limited has been at the forefront of technological innovation for over two decades. Headquartered in Mumbai, we have consistently delivered breakthrough solutions to clients across the globe.
            </p>
            <p className="text-gray-600">
              Our journey began with a vision to provide tailored software solutions that address specific business challenges. Today, we have evolved into a comprehensive technology partner serving diverse industries with our specialized expertise.
            </p>
          </motion.div>

          {/* Company Philosophy */}
          <motion.div
            className="mt-8 bg-white rounded-lg shadow-lg p-8"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 rounded-full p-3 mr-4">
                <Landmark className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Our Philosophy</h3>
            </div>
            <p className="text-gray-600 mb-6">
              At Maraekat, we believe there is no "one-size-fits-all" approach to technology. Organizations need tailor-made software solutions to achieve optimal results, and this is precisely where our expertise lies.
            </p>
            <p className="text-gray-600">
              By combining revolutionary technology with an energetic workforce, we create customized solutions that address the unique challenges faced by our clients, enabling them to thrive in an increasingly competitive landscape.
            </p>
          </motion.div>

          {/* Industry Focus */}
          <div className="mt-16">
            <motion.h3
              className="text-2xl font-bold text-center text-gray-900 mb-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Industry Expertise
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  icon: CreditCard,
                  title: 'Foreign Exchange',
                  description: 'Innovative solutions for currency exchange and international transactions'
                },
                {
                  icon: Plane,
                  title: 'Travel',
                  description: 'Streamlined systems for travel booking and management'
                },
                {
                  icon: Globe,
                  title: 'Tourism',
                  description: 'Digital platforms enhancing tourism experiences and operations'
                },
                {
                  icon: Hotel,
                  title: 'Hospitality',
                  description: 'Comprehensive management systems for the hospitality sector'
                }
              ].map((industry, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
                  variants={cardHoverAnimation}
                  initial="initial"
                  whileHover="hover"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <div className="text-indigo-600 mb-4 flex justify-center">
                    <motion.div variants={iconHover} whileHover="hover">
                      <industry.icon className="h-8 w-8" />
                    </motion.div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2 text-center">{industry.title}</h4>
                  <p className="text-gray-600 text-center">{industry.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Our Approach */}
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
              Our Approach
            </h2>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Combining technological innovation with deep industry knowledge to deliver exceptional results
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Code,
                title: 'Innovative Technology',
                description: 'We leverage cutting-edge technologies to create solutions that address complex business challenges.'
              },
              {
                icon: Users,
                title: 'Talented Team',
                description: 'Our energetic workforce brings together diverse skills and perspectives to drive innovation.'
              },
              {
                icon: Award,
                title: 'Quality Assurance',
                description: 'As an ISO 9001:2008 certified company, we maintain rigorous quality standards in all our processes.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg p-8"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <item.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "30+", label: "Years of Excellence" },
              { value: "100+", label: "Global Clients" },
              { value: "200+", label: "Team Members" },
              { value: "4", label: "Industry Domains" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={statCardAnimation}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <motion.div
                  className="text-4xl font-bold text-white mb-2"
                  variants={pulseAnimation}
                >
                  {stat.value}
                </motion.div>
                <div className="text-indigo-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900"
            >
              Ready to explore opportunities in Germany?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Contact us today to learn how we can help you find your dream job in Germany or connect you with top talent.
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
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
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

export default AboutUs;
