import React, { useState } from 'react';
import { Mail, Copy, User, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import '../index.css';

const TeacherAuth = () => {
  const [tab, setTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    subject: '',
    department: '',
    phone: '',
    office: ''
  });
  const [copied, setCopied] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCopy = (val) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', {
        email: loginEmail,
        password: loginPassword
      });
      setSuccess('Login successful!');
      localStorage.setItem('token', res.data.token);
      // Optionally redirect or update app state here
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match'); setLoading(false); return;
    }
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.subject || !registerData.department) {
      setError('Please fill all required fields'); setLoading(false); return;
    }
    try {
      const res = await axios.post('/api/auth/register', {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        subject: registerData.subject,
        department: registerData.department,
        phone: registerData.phone,
        office: registerData.office
      });
      setSuccess('Registration successful!');
      localStorage.setItem('token', res.data.token);
      // Optionally redirect or update app state here
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg-stars min-h-screen w-full flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-2xl shadow-2xl border border-gray-800 p-8 flex flex-col items-center relative bg-black/95 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl font-bold cabinet-grotesk text-white tracking-tight">
            KnowMyStatus<span className="navbar-red-dot">.</span>
          </span>
        </div>
        {/* Segmented Tabs */}
        <div className="w-full mb-6">
          <div className="segmented-control">
            <button type="button" data-active={tab==='login'} onClick={() => setTab('login')}>
              Login
            </button>
            <button type="button" data-active={tab==='register'} onClick={() => setTab('register')}>
              Register
            </button>
            <span
              className="segmented-indicator"
              style={{ transform: tab === 'login' ? 'translateX(0%)' : 'translateX(100%)' }}
            />
          </div>
        </div>
        {/* Error/Success Messages */}
        {error && (
          <div className="w-full mb-3 text-sm alert error">
            {error}
          </div>
        )}
        {success && (
          <div className="w-full mb-3 text-sm alert success">
            {success}
          </div>
        )}
        {/* Login Form */}
        {tab === 'login' && (
          <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="field">
              <div className="input-icon">
                <Mail size={18} />
              </div>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder=" "
                className="ui-input"
                autoComplete="email"
              />
              <label htmlFor="login-email" className="ui-label">Email</label>
              <button type="button" onClick={() => handleCopy(loginEmail)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition">
                <Copy size={18} />
              </button>
              {copied && <span className="absolute -bottom-5 right-0 text-xs text-green-400">Copied!</span>}
            </div>
            <div className="field">
              <div className="input-icon">
                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
              <input
                id="login-password"
                type={showLoginPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder=" "
                className="ui-input"
                autoComplete="current-password"
              />
              <label htmlFor="login-password" className="ui-label">Password</label>
              <button type="button" onClick={() => setShowLoginPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition">
                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button disabled={loading} className="btn-red mt-1">{loading ? 'Logging in…' : 'Login'}</button>
          </form>
        )}
        {/* Register Form */}
        {tab === 'register' && (
          <form className="w-full flex flex-col gap-5" onSubmit={handleRegister}>
            <div className="field">
              <div className="input-icon">
                <User size={18} />
              </div>
              <input
                id="register-name"
                type="text"
                value={registerData.name}
                onChange={e => setRegisterData(d => ({...d, name: e.target.value}))}
                placeholder=" "
                className="ui-input"
                autoComplete="name"
              />
              <label htmlFor="register-name" className="ui-label">Full Name</label>
            </div>
            <div className="field">
              <div className="input-icon">
                <Mail size={18} />
              </div>
              <input
                id="register-email"
                type="email"
                value={registerData.email}
                onChange={e => setRegisterData(d => ({...d, email: e.target.value}))}
                placeholder=" "
                className="ui-input"
                autoComplete="email"
              />
              <label htmlFor="register-email" className="ui-label">Email</label>
              <button type="button" onClick={() => handleCopy(registerData.email)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition">
                <Copy size={18} />
              </button>
            </div>
            <div className="field">
              <div className="input-icon">
                {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
              <input
                id="register-password"
                type={showRegisterPassword ? 'text' : 'password'}
                value={registerData.password}
                onChange={e => setRegisterData(d => ({...d, password: e.target.value}))}
                placeholder=" "
                className="ui-input"
                autoComplete="new-password"
              />
              <label htmlFor="register-password" className="ui-label">Password</label>
              <button type="button" onClick={() => setShowRegisterPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition">
                {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="field">
              <div className="input-icon">
                {showRegisterConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
              <input
                id="register-confirm"
                type={showRegisterConfirm ? 'text' : 'password'}
                value={registerData.confirmPassword}
                onChange={e => setRegisterData(d => ({...d, confirmPassword: e.target.value}))}
                placeholder=" "
                className="ui-input"
                autoComplete="new-password"
              />
              <label htmlFor="register-confirm" className="ui-label">Confirm Password</label>
              <button type="button" onClick={() => setShowRegisterConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition">
                {showRegisterConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="field">
              <input
                id="register-subject"
                type="text"
                value={registerData.subject}
                onChange={e => setRegisterData(d => ({...d, subject: e.target.value}))}
                placeholder=" "
                className="ui-input"
              />
              <label htmlFor="register-subject" className="ui-label">Subject *</label>
            </div>
            <div className="field">
              <input
                id="register-department"
                type="text"
                value={registerData.department}
                onChange={e => setRegisterData(d => ({...d, department: e.target.value}))}
                placeholder=" "
                className="ui-input"
              />
              <label htmlFor="register-department" className="ui-label">Department *</label>
            </div>
            <div className="field">
              <input
                id="register-phone"
                type="text"
                value={registerData.phone}
                onChange={e => setRegisterData(d => ({...d, phone: e.target.value}))}
                placeholder=" "
                className="ui-input"
              />
              <label htmlFor="register-phone" className="ui-label">Phone</label>
            </div>
            <div className="field">
              <input
                id="register-office"
                type="text"
                value={registerData.office}
                onChange={e => setRegisterData(d => ({...d, office: e.target.value}))}
                placeholder=" "
                className="ui-input"
              />
              <label htmlFor="register-office" className="ui-label">Office</label>
            </div>
            <button disabled={loading} className="btn-red mt-1">{loading ? 'Registering…' : 'Register'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeacherAuth;