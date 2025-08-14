import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Building, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    subject: '',
    department: '',
    office: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = "Sign Up - KnowMyStatus";
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/teacher/dashboard');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Left Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Welcome Message */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-1 cabinet-grotesk">Create Account</h1>
              <p className="text-gray-400 text-sm">Join us to get started</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2.5 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-3 py-2.5 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Subject and Department Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-gray-300 mb-1">
                    Subject
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-3 py-2.5 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm"
                      placeholder="Mathematics"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-xs font-medium text-gray-300 mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      value={formData.department}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-3 py-2.5 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm"
                      placeholder="Science"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Office Field */}
              <div>
                <label htmlFor="office" className="block text-xs font-medium text-gray-300 mb-1">
                  Office (Optional)
                </label>
                <input
                  id="office"
                  name="office"
                  type="text"
                  value={formData.office}
                  onChange={handleChange}
                  className="block w-full px-3 py-2.5 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm"
                  placeholder="Room 204"
                />
              </div>

              {/* Password Fields Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-9 py-2.5 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-9 py-2.5 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm"
                      placeholder="Confirm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-red-400 hover:text-red-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>        {/* Right Side - KnowMyStatus Text */}
        <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center">
          <div className="text-center">
            <Link to="/" className="text-6xl font-bold navbar-brand text-white tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
              KnowMyStatus<span className="navbar-red-dot">.</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
