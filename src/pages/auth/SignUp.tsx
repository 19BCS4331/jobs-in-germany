import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, AuthError } from '../../lib/auth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Briefcase, User } from 'lucide-react';

type UserType = 'job_seeker' | 'employer';

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('job_seeker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError({ message: 'Passwords do not match' } as AuthError);
      return;
    }

    setLoading(true);

    try {
      const { user } = await signUp(email, password, userType);
      toast.success('Account created successfully!', {
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: '#4F46E5',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
        },
      });
      
      if (user) {
        // Redirect based on user type
        if (userType === 'employer') {
          navigate('/company/new');
        } else {
          navigate('/profile');
        }
      }
    } catch (err) {
      setError(err as AuthError);
      toast.error(err instanceof Error ? err.message : 'An error occurred', {
        duration: 4000,
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md mt-8 px-4 sm:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="flex justify-center mb-6">
          <img
            className="h-10 sm:h-12 w-auto"
            src="/logo.png"
            alt="Jobs in Germany"
          />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Or{' '}
          <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
          </Link>
        </p>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-10 shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                I am a...
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('job_seeker')}
                  className={`relative flex items-center justify-center px-4 py-3 border ${
                    userType === 'job_seeker'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } rounded-lg transition-colors duration-200`}
                >
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">Job Seeker</span>
                  {userType === 'job_seeker' && (
                    <motion.div
                      className="absolute -inset-px border-2 border-indigo-600 rounded-lg"
                      layoutId="activeUserType"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('employer')}
                  className={`relative flex items-center justify-center px-4 py-3 border ${
                    userType === 'employer'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } rounded-lg transition-colors duration-200`}
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span className="font-medium">Employer</span>
                  {userType === 'employer' && (
                    <motion.div
                      className="absolute -inset-px border-2 border-indigo-600 rounded-lg"
                      layoutId="activeUserType"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 sm:p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error.message}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 sm:py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="sr-only">Sign up with Google</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.467c-2.624,0-4.747-2.124-4.747-4.747s2.124-4.747,4.747-4.747c1.112,0,2.134,0.391,2.934,1.037l1.905-1.905C17.366,5.59,15.217,4.738,12.91,4.738c-4.406,0-7.975,3.569-7.975,7.975s3.569,7.975,7.975,7.975c6.127,0,9.539-4.839,8.853-10.995h-7.309C12.69,10.903,12.545,11.496,12.545,12.151z" />
                  </svg>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="sr-only">Sign up with LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.68 1.68 0 0 0-1.68 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
