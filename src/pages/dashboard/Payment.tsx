import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

const Payment: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStatus('idle');
    setErrorMessage('');

    try {
      // TODO: Implement payment gateway integration
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated payment
      setPaymentStatus('success');
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
      setErrorMessage('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="text-center mb-8">
            <CreditCard className="mx-auto h-12 w-12 text-primary-600" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Premium Access</h2>
            <p className="mt-2 text-gray-600">Get unlimited access to job listings and premium features</p>
          </div>

          <div className="mb-8">
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary-900 mb-4">Premium Package Includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-primary-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Unlimited job applications</span>
                </li>
                <li className="flex items-center text-primary-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Priority application processing</span>
                </li>
                <li className="flex items-center text-primary-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Resume review by experts</span>
                </li>
                <li className="flex items-center text-primary-700">
                  <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>Early access to new job listings</span>
                </li>
              </ul>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cvc"
                      placeholder="123"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center text-sm text-gray-500">
                <Lock className="h-4 w-4 mr-1" />
                <span>Secure payment</span>
              </div>
              <span className="font-medium text-lg text-gray-900">€49.99</span>
            </div>

            {errorMessage && (
              <motion.div
                className="flex items-center space-x-2 text-red-600 bg-red-50/60 backdrop-blur-[2px] p-3 rounded-lg text-sm"
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <AlertCircle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isProcessing}
              className={`w-full flex items-center justify-center space-x-2 px-6 py-3 text-white rounded-lg transition-colors ${
                isProcessing ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-600'
              }`}
              whileHover={!isProcessing ? { scale: 1.01 } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {isProcessing ? (
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
                  <span className="text-white/90">Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Now</span>
                </>
              )}
            </motion.button>

            {paymentStatus === 'success' && (
              <motion.div
                className="flex items-center space-x-2 text-green-600 bg-green-50/60 backdrop-blur-[2px] p-3 rounded-lg text-sm"
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Payment successful! Redirecting to your dashboard...</span>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
