import { motion } from "framer-motion";
import {
  Check,
  GraduationCap,
  Book,
  Calendar,
  Award,
  ArrowRight,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LearnGerman() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-indigo-600">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kummuni.com/storage/2025/01/german-language-class-2024-12-02-09-14-51-utc.webp"
            alt="German language class"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-900 opacity-90 z-10"></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Learn German for Free
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-xl text-indigo-100 max-w-2xl"
            >
              Start your journey to German fluency with our complimentary
              language classes designed specifically for healthcare and IT
              professionals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Register for Free Classes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <a
                href="https://wa.me/919819761300"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </motion.div>
          </div>
        </div>

        {/* Wave pattern at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </div>

      {/* Program Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp}>
            <GraduationCap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">
              Our Free German Language Program
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We offer complimentary German language classes to help you prepare
              for your career in Germany. Our program is tailored specifically
              for healthcare and IT professionals looking to work in Germany.
            </p>
          </motion.div>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Book className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                A1 Level Classes
              </h3>
              <p className="text-gray-600 mb-4">
                Two free A1 level German classes to help you build a foundation
                in the German language. Perfect for complete beginners.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic vocabulary and phrases</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Simple grammar structures</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Introduction to German pronunciation</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                A2 Level Classes
              </h3>
              <p className="text-gray-600 mb-4">
                Already know A1 German? Pass our assessment and get two free A2
                level classes to advance your German language skills.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Expanded vocabulary for daily use</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>More complex grammar structures</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Conversational practice</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Flexible Schedule
              </h3>
              <p className="text-gray-600 mb-4">
                Our classes are designed to fit your busy schedule with options
                for both weekday and weekend sessions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Online live classes</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Weekend batch options</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Recorded sessions for review</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* NEW: Card 4 - B1 Level Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                B1 Level Classes
              </h3>
              <p className="text-gray-600 mb-4">
                Take your German to the intermediate level with our specialized B1 classes. Perfect for healthcare professionals preparing for workplace communication.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Medical and technical vocabulary</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Complex sentence structures</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Workplace communication scenarios</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Telc B1 exam preparation</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* NEW: Card 5 - B2 Level Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                B2 Level Classes
              </h3>
              <p className="text-gray-600 mb-4">
                Achieve professional fluency with our advanced B2 classes. Essential for IT professionals and those seeking long-term career growth in Germany.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced professional vocabulary</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Technical discussions and presentations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Job interview preparation</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Goethe/Telc B2 certification preparation</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-indigo-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold text-gray-900"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-gray-600"
            >
              Getting started with our free German language classes is simple
            </motion.p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md z-10 relative">
                <span className="text-xl font-bold text-indigo-600">1</span>
              </div>
              <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-indigo-200 z-0"></div>
              <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                Register
              </h3>
              <p className="text-gray-600">
                Fill out our simple registration form to express your interest
                in the free German classes.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md z-10 relative">
                <span className="text-xl font-bold text-indigo-600">2</span>
              </div>
              <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-indigo-200 z-0"></div>
              <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                Assessment
              </h3>
              <p className="text-gray-600">
                Take a quick assessment to determine your current German
                language level (if any).
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md z-10 relative">
                <span className="text-xl font-bold text-indigo-600">3</span>
              </div>
              <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-indigo-200 z-0"></div>
              <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                Schedule
              </h3>
              <p className="text-gray-600">
                Choose your preferred time slots for the two free classes based
                on your availability.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-md z-10 relative">
                <span className="text-xl font-bold text-indigo-600">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">
                Learn
              </h3>
              <p className="text-gray-600">
                Attend your scheduled classes and start your journey to German
                language proficiency.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Learn German */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-900"
          >
            Why Learn German?
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-lg text-gray-600">
            Learning German opens up numerous opportunities for your career in
            Germany
          </motion.p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Reason 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Better Job Opportunities
            </h3>
            <p className="text-gray-600">
              Even basic German skills can significantly improve your job
              prospects and salary potential in Germany.
            </p>
          </motion.div>

          {/* Reason 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Easier Integration
            </h3>
            <p className="text-gray-600">
              Speaking German helps you integrate into German society, making
              daily life much easier and more enjoyable.
            </p>
          </motion.div>

          {/* Reason 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Career Advancement
            </h3>
            <p className="text-gray-600">
              German language skills can accelerate your career progression in
              both healthcare and IT sectors.
            </p>
          </motion.div>

          {/* Reason 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Better Patient Care
            </h3>
            <p className="text-gray-600">
              For healthcare professionals, speaking German allows for better
              communication with patients and colleagues.
            </p>
          </motion.div>

          {/* Reason 5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Enhanced Collaboration
            </h3>
            <p className="text-gray-600">
              IT professionals can collaborate more effectively with German
              teams when language barriers are removed.
            </p>
          </motion.div>

          {/* Reason 6 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Long-term Residency
            </h3>
            <p className="text-gray-600">
              German language proficiency is required for permanent residency
              and citizenship applications.
            </p>
          </motion.div>
        </div>
      </div>

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
              Ready to start learning German?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto"
            >
              Register today for your free German language classes and take the
              first step toward your successful career in Germany.
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
                Register Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <a
                href="https://wa.me/919819761300"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
