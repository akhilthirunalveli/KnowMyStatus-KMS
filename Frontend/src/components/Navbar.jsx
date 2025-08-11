import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { 
  GraduationCap, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Settings,
  QrCode,
  Home
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="
        bg-white shadow-xl border-2
        fixed top-6 left-1/2 transform -translate-x-1/2 z-50
        rounded-full
        px-4 py-2
        flex items-center
        border-gradient
        backdrop-blur-md
      "
      style={{
        minWidth: 'auto',
        maxWidth: '98vw',
        borderImage: 'linear-gradient(90deg, #ff6b6b, #f7d716, #1dd1a1, #54a0ff, #5f27cd) 1',
        borderWidth: '2px',
        borderStyle: 'solid',
        gap: '0.5rem'
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center justify-center rounded-full p-2 hover:bg-primary-50 transition">
        <GraduationCap className="h-7 w-7 text-primary-600" />
      </Link>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-2">
        <Link 
          to="/" 
          className={`flex items-center justify-center rounded-full p-2 transition ${
            isActive('/') 
              ? 'bg-primary-100 text-primary-600 shadow'
              : 'text-gray-700 hover:bg-primary-50'
          }`}
        >
          <Home className="h-6 w-6" />
        </Link>
        <Link 
          to="/student" 
          className={`flex items-center justify-center rounded-full p-2 transition ${
            isActive('/student') 
              ? 'bg-primary-100 text-primary-600 shadow'
              : 'text-gray-700 hover:bg-primary-50'
          }`}
        >
          <User className="h-6 w-6" />
        </Link>
        {isAuthenticated ? (
          <>
            <Link 
              to="/teacher/dashboard" 
              className={`flex items-center justify-center rounded-full p-2 transition ${
                isActive('/teacher/dashboard') 
                  ? 'bg-primary-100 text-primary-600 shadow'
                  : 'text-gray-700 hover:bg-primary-50'
              }`}
            >
              <QrCode className="h-6 w-6" />
            </Link>
            <Link 
              to="/teacher/profile" 
              className={`flex items-center justify-center rounded-full p-2 transition ${
                isActive('/teacher/profile') 
                  ? 'bg-primary-100 text-primary-600 shadow'
                  : 'text-gray-700 hover:bg-primary-50'
              }`}
            >
              <Settings className="h-6 w-6" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-full p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 transition"
              title="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/teacher/login" 
              className="flex items-center justify-center rounded-full p-2 text-gray-700 hover:bg-primary-50 transition"
              title="Teacher Login"
            >
              <LogOut className="h-6 w-6 rotate-180" />
            </Link>
            <Link 
              to="/teacher/register" 
              className="flex items-center justify-center rounded-full p-2 text-gray-700 hover:bg-primary-50 transition"
              title="Register"
            >
              <Settings className="h-6 w-6" />
            </Link>
          </>
        )}
      </div>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden flex items-center justify-center rounded-full p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border-2 border-gradient px-4 py-3 flex flex-row space-x-2 z-50"
          style={{
            borderImage: 'linear-gradient(90deg, #ff6b6b, #f7d716, #1dd1a1, #54a0ff, #5f27cd) 1',
            borderWidth: '2px',
            borderStyle: 'solid',
          }}
        >
          <Link 
            to="/" 
            className={`flex items-center justify-center rounded-full p-2 transition ${
              isActive('/') 
                ? 'bg-primary-100 text-primary-600 shadow'
                : 'text-gray-700 hover:bg-primary-50'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="h-6 w-6" />
          </Link>
          <Link 
            to="/student" 
            className={`flex items-center justify-center rounded-full p-2 transition ${
              isActive('/student') 
                ? 'bg-primary-100 text-primary-600 shadow'
                : 'text-gray-700 hover:bg-primary-50'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <User className="h-6 w-6" />
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                to="/teacher/dashboard" 
                className={`flex items-center justify-center rounded-full p-2 transition ${
                  isActive('/teacher/dashboard') 
                    ? 'bg-primary-100 text-primary-600 shadow'
                    : 'text-gray-700 hover:bg-primary-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <QrCode className="h-6 w-6" />
              </Link>
              <Link 
                to="/teacher/profile" 
                className={`flex items-center justify-center rounded-full p-2 transition ${
                  isActive('/teacher/profile') 
                    ? 'bg-primary-100 text-primary-600 shadow'
                    : 'text-gray-700 hover:bg-primary-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-6 w-6" />
              </Link>
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="flex items-center justify-center rounded-full p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 transition"
                title="Logout"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/teacher/login" 
                className="flex items-center justify-center rounded-full p-2 text-gray-700 hover:bg-primary-50 transition"
                title="Teacher Login"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogOut className="h-6 w-6 rotate-180" />
              </Link>
              <Link 
                to="/teacher/register" 
                className="flex items-center justify-center rounded-full p-2 text-gray-700 hover:bg-primary-50 transition"
                title="Register"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-6 w-6" />
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;