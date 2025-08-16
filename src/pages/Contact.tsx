import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Clock, CheckCircle2, AlertCircle, Globe2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Input from '../components/forms/Input';
import TextArea from '../components/forms/TextArea';

interface FormData {
  name: string;
  email: string;
  message: string;
}

type SubmitStatus = 'idle' | 'success' | 'error';

const Contact: React.FC = () => {
  useEffect(() => {
    try {
      emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }, []);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset submit status and clear field error when user starts typing
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Validate form fields
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Clear any previous errors
    setFormErrors({});

    try {
      // Send both emails concurrently
      await Promise.all([
        // Send email notification to team
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }
        ),
        // Send auto-response to user
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_AUTORESPONSE_TEMPLATE_ID,
          {
            to_name: formData.name,
            to_email: formData.email,
            message: formData.message,
          }
        )
      ]);

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-white relative overflow-hidden">
      {/* Background pattern and blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05]" />
        
        {/* Subtle floating blobs */}
        <motion.div
          className="absolute top-1/4 -left-64 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.01, 1],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 -right-64 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.01, 1],
            x: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          {/* Support Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 25 
            }}
            className="flex justify-center"
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-indigo-100 shadow-sm"
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <Clock className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-900">24/7 Support Available</span>
            </motion.div>
          </motion.div>

          {/* Hero Content */}
          <div className="text-center mt-8 relative z-10">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
            >
              Get in Touch <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                We're Here to Help
              </span>
            </motion.h1>
            <motion.p 
              className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
            >
              Have questions about jobs in Germany? Need assistance with your application?
              Our team is ready to support you every step of the way.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.3 }}
                className="space-y-6"
              >
                <motion.div 
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <Mail className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Send us a Mail</h3>
                      <p className="mt-1 text-gray-600 cursor-pointer hover:text-indigo-600" onClick={() => window.open('mailto:info@thegermanyjobs.com', '_blank')}>info@thegermanyjobs.com</p>
                      <p className="mt-1 text-gray-600 cursor-pointer hover:text-indigo-600" onClick={() => window.open('mailto:seema@maraekat.com', '_blank')}>seema@maraekat.com</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <Globe2 className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Our Websites</h3>
                     
                      <p className="mt-1 text-gray-600 cursor-pointer hover:text-indigo-600" onClick={() => window.open('https://www.maraekat.com', '_blank')}>www.maraekat.com</p>
                      <p className="mt-1 text-gray-600 cursor-pointer hover:text-indigo-600" onClick={() => window.open('https://www.thenestindia.com/index.html', '_blank')}>www.thenestindia.com</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <MessageCircle className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                      <p className="mt-1 text-gray-600 cursor-pointer hover:text-indigo-600" onClick={() => window.open('tel:+919819761300', '_blank')}>+91 9819761300</p>
                      <p className="mt-1 text-gray-600 cursor-pointer hover:text-indigo-600" onClick={() => window.open('tel:+9102266587777', '_blank')}>+91 022-66587777</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <MapPin className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Locations</h3>
                      <p className="mt-1 text-gray-600">1. Mumbai, India</p>
                      <p className="mt-1 text-gray-600">2. Kerala, India</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <Input
                  id="name"
                  name="name"
                  label="Name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  error={formErrors.name}
                />

                <Input
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  error={formErrors.email}
                />

                <TextArea
                  id="message"
                  name="message"
                  label="Message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows={4}
                  error={formErrors.message}
                />

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 text-white rounded-lg transition-colors ${
                    isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <span className="text-white/90">Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                <AnimatePresence mode="wait">
                  {isSubmitting && (
                    <motion.div 
                      className="flex items-center justify-center space-x-2 text-indigo-600/80 bg-indigo-50/60 backdrop-blur-[2px] p-3 rounded-lg text-sm"
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                      <span>Your message is being sent...</span>
                    </motion.div>
                  )}

                  {submitStatus === 'success' && (
                    <motion.div 
                      className="flex items-center space-x-2 text-green-600/80 bg-green-50/60 backdrop-blur-[2px] p-3 rounded-lg text-sm"
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                      <motion.div
                        initial={{ rotate: -5 }}
                        animate={{ rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </motion.div>
                      <span>Message sent successfully! We'll get back to you soon.</span>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && errorMessage && (
                    <motion.div 
                      className="flex items-center space-x-2 text-red-600/80 bg-red-50/60 backdrop-blur-[2px] p-3 rounded-lg text-sm"
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                      <motion.div
                        initial={{ rotate: 5 }}
                        animate={{ rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      >
                        <AlertCircle className="h-5 w-5" />
                      </motion.div>
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
