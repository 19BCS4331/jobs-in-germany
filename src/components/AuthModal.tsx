import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { signIn, signUp, AuthError } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'signin' | 'signup';
type UserType = 'job_seeker' | 'employer';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('job_seeker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { user } = await signUp(email, password, userType);
        setSuccess('Account created successfully!');
        toast.success('Account created!', {
          duration: 4000,
          position: 'bottom-right',
          style: {
            background: '#4F46E5',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
          },
        });
        
        // Wait for user to be available
        if (user) {
          onClose();
          // Redirect based on user type
          if (userType === 'employer') {
            navigate('/company/new');
          } else {
            navigate('/profile');
          }
        }
      } else {
        const { user } = await signIn(email, password);
        toast.success('Welcome back!', {
          duration: 3000,
          position: 'bottom-right',
          icon: '👋',
          style: {
            background: '#4F46E5',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
          },
        });
        if (user) {
          onClose();
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'signin' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {mode === 'signin'
                ? 'Sign in to your account to continue'
                : 'Sign up to start your journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  I am a...
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('job_seeker')}
                    className={`flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium ${
                      userType === 'job_seeker'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('employer')}
                    className={`flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium ${
                      userType === 'employer'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Employer
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error.message}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === 'signin' ? (
              <p className="text-gray-500">
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-gray-500">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}