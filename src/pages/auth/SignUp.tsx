import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, AuthError } from "../../lib/auth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Briefcase, User, ArrowLeft, Check,Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";

type UserType = "job_seeker" | "employer";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { profile } = useAuth();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>("job_seeker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase || !hasLowerCase) {
      return "Password must contain both uppercase and lowercase letters";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError({ message: passwordError } as AuthError);
      return;
    }

    if (password !== confirmPassword) {
      setError({ message: "Passwords do not match" } as AuthError);
      return;
    }

    setLoading(true);

    try {
      // Show a toast that we're creating the account
      const loadingToast = toast.loading("Creating your account...", {
        position: "bottom-right",
      });

      // Prevent automatic redirection by storing a flag in localStorage
      localStorage.setItem("preventRedirect", "true");

      // Sign up the user and create profile
      const { user } = await signUp(email, password, userType);

      // Check if user exists before proceeding
      if (!user) {
        toast.dismiss(loadingToast);
        toast.error("Failed to create account", {
          duration: 4000,
          position: "bottom-right",
        });
        setLoading(false);
        return;
      }

      // Verify that the profile was created successfully by checking it directly
      let profileCreated = false;
      let profileData = null;
      let retryCount = 0;
      const maxRetries = 10; // Increase max retries
      const retryDelay = 1500; // Longer delay between retries (1.5 seconds)

      while (!profileCreated && retryCount < maxRetries) {
        try {
          console.log(`Attempt ${retryCount + 1}: Checking for profile...`);
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (data && !error) {
            profileCreated = true;
            profileData = data;
            console.log("Profile found:", data);
          } else {
            console.log("Profile not found yet, retrying...");
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            retryCount++;
          }
        } catch (err) {
          console.error("Error checking profile:", err);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          retryCount++;
        }
      }

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      if (profileCreated && profileData) {
        toast.success("Account created successfully!", {
          duration: 4000,
          position: "bottom-right",
          style: {
            background: "#4F46E5",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
          },
        });

        // Clear the prevention flag
        localStorage.removeItem("preventRedirect");

        // Force a complete page reload with the destination in the URL
        window.location.href =
          userType === "employer" ? "/company/new" : "/dashboard";
      } else {
        // If profile creation failed or timed out
        toast.error(
          "Account created but profile setup is incomplete. Please try signing in.",
          {
            duration: 6000,
            position: "bottom-right",
          }
        );
        // Don't redirect - stay on signup page
        localStorage.removeItem("preventRedirect");
      }
    } catch (err) {
      localStorage.removeItem("preventRedirect");
      setError(err as AuthError);
      toast.error(err instanceof Error ? err.message : "An error occurred", {
        duration: 4000,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form section */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>

            <Link
              to="/signin"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sign in
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-xl p-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Create account
              </h2>
              <p className="mt-2 text-gray-600">Join our community today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType("job_seeker")}
                    className={`relative flex items-center justify-center px-4 py-3 border ${
                      userType === "job_seeker"
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } rounded-lg transition-colors duration-200`}
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span className="font-medium">Job Seeker</span>
                    {userType === "job_seeker" && (
                      <motion.div
                        className="absolute -inset-px border-2 border-indigo-600 rounded-lg"
                        layoutId="activeUserType"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("employer")}
                    className={`relative flex items-center justify-center px-4 py-3 border ${
                      userType === "employer"
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    } rounded-lg transition-colors duration-200`}
                  >
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span className="font-medium">Employer</span>
                    {userType === "employer" && (
                      <motion.div
                        className="absolute -inset-px border-2 border-indigo-600 rounded-lg"
                        layoutId="activeUserType"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {error.message}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Right side - Image/Brand section */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-700 text-white p-8 flex-col justify-between relative overflow-hidden">
        {/* Background image with low opacity */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://kummuni.com/storage/2025/01/map-of-germany-2024-12-02-09-14-51-utc.webp"
            alt="Berlin cityscape"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-indigo-900 opacity-90 z-10"></div>

        <div className="relative z-30">
          <Link to="/" className="text-white text-2xl font-bold">
            Jobs in Germany
          </Link>
          <h1 className="mt-12 text-4xl font-bold">Start Your Journey</h1>
          <p className="mt-4 text-indigo-100 max-w-sm">
            Create an account to access job opportunities in Germany and take
            the next step in your career.
          </p>
        </div>

        <div className="relative z-30 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Why join us?</h3>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-indigo-500/30 p-1 rounded-full">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="text-indigo-100">
                Access to thousands of jobs in Germany
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-indigo-500/30 p-1 rounded-full">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="text-indigo-100">
                Personalized job recommendations
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-indigo-500/30 p-1 rounded-full">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="text-indigo-100">
                Guidance on relocation and work permits
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 bg-indigo-500/30 p-1 rounded-full">
                <Check className="h-5 w-5 text-white" />
              </div>
              <p className="text-indigo-100">
                Connect with top employers in Germany
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-30 text-sm text-indigo-200">
          © {new Date().getFullYear()} Jobs in Germany. All rights reserved.
        </div>
      </div>
    </div>
  );
}
