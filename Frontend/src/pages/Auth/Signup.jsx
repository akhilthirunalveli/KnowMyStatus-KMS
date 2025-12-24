import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Building, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
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
    <div className="h-screen w-full bg-black cabinet-grotesk overflow-hidden flex flex-col relative">

      {/* Absolute Navbar */}
      {/* Absolute Navbar */}
      <nav className="absolute top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="premium-card pointer-events-auto w-full max-w-5xl !rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:opacity-80 transition-opacity flex items-center cabinet-grotesk">
            KnowMyStatus<span className="text-[#ff3333] text-4xl leading-none">.</span>
          </Link>

          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-white hover:text-gray-300 transition-colors cabinet-grotesk">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full">

        {/* Left Side: Form */}
        <div className="bg-[#050505] border-r border-white/10 relative z-10 h-full overflow-y-auto custom-scrollbar">
          {/* Scrollable container for form content if it overflows */}
          <div className="w-full max-w-2xl mx-auto min-h-full flex flex-col justify-start px-8 sm:px-12 pt-28 pb-8">

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-0 top-3 text-gray-600 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-[#ff3333] transition-colors outline-none placeholder-gray-700 rounded-none text-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-0 top-3 text-gray-600 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 py-3 pl-8 text-white focus:border-[#ff3333] transition-colors outline-none placeholder-gray-700 rounded-none text-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white uppercase tracking-wider">Subject</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-0 top-3 text-gray-600 group-focus-within:text-white transition-colors" size={16} />
                    <input
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/10 py-3 pl-7 text-white focus:border-[#ff3333] transition-colors outline-none placeholder-gray-700 rounded-none text-xs sm:text-sm"
                      placeholder="Maths"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white uppercase tracking-wider">Dept</label>
                  <div className="relative group">
                    <Building className="absolute left-0 top-3 text-gray-600 group-focus-within:text-white transition-colors" size={16} />
                    <input
                      name="department"
                      type="text"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/10 py-3 pl-7 text-white focus:border-[#ff3333] transition-colors outline-none placeholder-gray-700 rounded-none text-xs sm:text-sm"
                      placeholder="Sci"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white uppercase tracking-wider">Office</label>
                  <input
                    name="office"
                    type="text"
                    value={formData.office}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-[#ff3333] transition-colors outline-none placeholder-gray-700 rounded-none text-xs sm:text-sm"
                    placeholder="204"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white uppercase tracking-wider">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-0 top-3 text-gray-600 group-focus-within:text-white transition-colors" size={18} />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/10 py-3 pl-8 pr-8 text-white focus:border-[#ff3333] transition-colors outline-none placeholder-gray-700 rounded-none text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-3 text-gray-600 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white uppercase tracking-wider">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-0 top-3 text-gray-600 group-focus-within:text-white transition-colors" size={18} />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/10 py-3 pl-8 pr-8 text-white focus:border-[#ff3333] transition-colors outline-none placeholder-gray-700 rounded-none text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-3 text-gray-600 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-bold py-4 hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {loading ? 'Processing...' : 'Create Account'}
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center pb-4">
              <Link to="/login" className="text-sm text-gray-500 hover:text-white transition-colors">
                Already have an account? <span className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all">Sign in</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Visual/Branding */}
        <div className="hidden lg:flex bg-[#0a0a0a] flex-col justify-center items-center p-12 relative overflow-hidden">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />

          <div className="text-center relative z-10 p-12 max-w-lg">
            <h2 className="text-[120px] font-bold text-[#111] leading-none select-none tracking-tighter opacity-80">JOIN</h2>
            <div className="h-px w-24 bg-[#ff3333] mx-auto my-10" />
            <h3 className="text-2xl font-bold text-white mb-4">Start Your Journey</h3>
            <p className="text-gray-500 text-lg leading-relaxed">
              Connect with your sudents in a whole new way. Simple, fast, and efficient status management.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
