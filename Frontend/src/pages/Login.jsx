import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = "Login - KnowMyStatus";
  }, []);

  // Handle test mode toggle
  const handleTestModeToggle = () => {
    setTestMode(!testMode);
    if (!testMode) {
      // Enable test mode - fill credentials
      setEmail('test@kms.com');
      setPassword('Test@123');
      toast.success('Test credentials loaded!');
    } else {
      // Disable test mode - clear credentials
      setEmail('');
      setPassword('');
      toast.info('Test credentials cleared');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Welcome back!');
        navigate('/teacher/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-md">
            {/* Welcome Message */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 cabinet-grotesk">Welcome!</h1>
              <p className="text-gray-400 text-sm sm:text-base">Sign in to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm sm:text-base"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm sm:text-base"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Test User Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs sm:text-sm font-bold">T</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Test User Mode</p>
                    <p className="text-xs text-gray-400">Auto-fill demo credentials</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTestModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                    testMode ? 'bg-red-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      testMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-gray-400 text-sm sm:text-base">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-red-400 hover:text-red-300 font-medium"
                >
                  Sign up for free
                </Link>
              </p>
              <p className="text-gray-400 text-sm sm:text-base mt-2">
                Go back to{' '}
                <Link
                  to="/"
                  className="text-red-400 hover:text-red-300 font-medium"
                >
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - KnowMyStatus Text */}
        <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center">
          <div className="text-center">
            <Link to="/" className="text-4xl xl:text-6xl font-bold navbar-brand text-white tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
              KnowMyStatus<span className="navbar-red-dot">.</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
