import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Compass, Terminal, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = "Login - KnowMyStatus";
  }, []);

  // Handle test mode toggle
  const handleTestMode = () => {
    setEmail('test@kms.com');
    setPassword('test2@123');
    toast.success('Test credentials loaded!');
  };

  // Handle explore mode
  const handleExploreMode = async () => {
    setLoading(true);
    try {
      const result = await login('test@kms.com', 'test2@123');
      if (result.success) {
        toast.success('Welcome to KnowMyStatus!');
        navigate('/teacher/dashboard');
      } else {
        toast.error('Failed to start explore mode.');
      }
    } catch (error) {
      toast.error('Failed to start explore mode.');
    } finally {
      setLoading(false);
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
    <div className="h-screen w-full bg-black cabinet-grotesk overflow-hidden flex flex-col relative">

      {/* Absolute Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight flex items-center gap-1 cabinet-grotesk">
            KnowMyStatus<span className="text-[#ff3333]">.</span>
          </Link>
        </div>
        <div className="pointer-events-auto">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full">

        {/* Left Side: Form */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-32 bg-[#050505] border-r border-white/10 relative z-10 h-full overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome Back</h1>
              <p className="text-gray-400">Sign in to manage student status updates.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-0 top-3.5 text-gray-600 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-3.5 pl-8 text-white focus:border-[#ff3333] transition-colors outline-none placeholder-gray-700 rounded-none text-sm"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                  <button type="button" onClick={handleTestMode} className="text-[10px] text-[#ff3333] hover:text-[#ff6666] flex items-center gap-1 font-medium transition-colors">
                    <Terminal size={10} />
                    FILL TEST DATA
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-0 top-3.5 text-gray-600 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-3.5 pl-8 pr-8 text-white focus:border-[#ff3333] transition-colors outline-none placeholder-gray-700 rounded-none text-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-3.5 text-gray-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-bold py-4 hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {loading ? 'Processing...' : 'Sign In'}
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>

                <button
                  type="button"
                  onClick={handleExploreMode}
                  disabled={loading}
                  className="w-full bg-transparent border border-white/10 text-white font-medium py-4 hover:bg-white/5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  <Compass size={16} />
                  Explore as Guest
                </button>
              </div>
            </form>

            <div className="mt-10 text-center">
              <Link to="/signup" className="text-sm text-gray-500 hover:text-white transition-colors">
                New here? <span className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all">Create an account</span>
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
            <h2 className="text-[120px] font-bold text-[#111] leading-none select-none tracking-tighter opacity-80">LOGIN</h2>
            <div className="h-px w-24 bg-[#ff3333] mx-auto my-10" />
            <h3 className="text-2xl font-bold text-white mb-4">Faculty Portal</h3>
            <p className="text-gray-500 text-lg leading-relaxed">
              Streamline your workflow. Manage student statuses, attendance, and notifications from one central dashboard.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
