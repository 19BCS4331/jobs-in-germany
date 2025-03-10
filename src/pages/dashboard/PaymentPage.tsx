import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Book, CheckCircle } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  level: string;
  duration: string;
  price: number;
  description: string;
}

const PaymentPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const courses: Course[] = [
    {
      id: 'a1-intensive',
      name: 'A1 Intensive Course',
      level: 'A1',
      duration: '2 months',
      price: 299,
      description: 'Intensive German course for beginners. Learn basic communication skills.'
    },
    {
      id: 'a2-regular',
      name: 'A2 Regular Course',
      level: 'A2',
      duration: '3 months',
      price: 399,
      description: 'Build upon your basic German skills with more advanced vocabulary and grammar.'
    },
    {
      id: 'b1-intensive',
      name: 'B1 Intensive Course',
      level: 'B1',
      duration: '3 months',
      price: 499,
      description: 'Comprehensive course to achieve intermediate German proficiency.'
    },
  ];

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handlePayment = async () => {
    // TODO: Implement payment processing
    console.log('Processing payment for:', selectedCourse);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">German Language Courses</h1>
        <p className="text-gray-600 mt-1">Select a course and proceed with payment</p>
      </div>

      {/* Course Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ scale: 1.01, y: -1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer border-2 ${
              selectedCourse?.id === course.id ? 'border-indigo-600' : 'border-transparent'
            }`}
            onClick={() => handleCourseSelect(course)}
          >
            <div className="flex items-center justify-between mb-4">
              <Book className="w-6 h-6 text-indigo-600" />
              {selectedCourse?.id === course.id && (
                <CheckCircle className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>Level: {course.level}</p>
              <p>Duration: {course.duration}</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">{course.description}</p>
            <p className="mt-4 text-xl font-semibold text-gray-900">€{course.price}</p>
          </motion.div>
        ))}
      </div>

      {/* Payment Form */}
      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Details</h2>
          <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Holder Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10"
                    placeholder="1234 5678 9012 3456"
                  />
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="123"
                />
              </div>
            </div>

            <div className="mt-8">
              <div className="rounded-md bg-gray-50 p-4">
                <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                <div className="mt-4 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{selectedCourse.name}</p>
                    <p className="text-xs text-gray-500">{selectedCourse.duration} course</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">€{selectedCourse.price}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Pay €{selectedCourse.price}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PaymentPage;
