import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Activity tracking to keep session alive
  useEffect(() => {
    if (token && user) {
      const updateActivity = () => {
        localStorage.setItem('lastActivity', new Date().toISOString());
      };

      // Track user activity
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, updateActivity);
      });

      // Set initial activity
      updateActivity();

      // Cleanup event listeners
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, updateActivity);
        });
      };
    }
  }, [token, user]);

  // Check session validity periodically
  useEffect(() => {
    if (!token || !user) return;

    const checkSession = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity) {
        const lastActivityTime = new Date(lastActivity);
        const now = new Date();
        const timeDiff = now - lastActivityTime;
        
        // Auto-logout after 24 hours of inactivity
        if (timeDiff > 24 * 60 * 60 * 1000) {
          toast.error('Session expired due to inactivity');
          logout();
        }
      }
    };

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [token, user]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/profile');
          setUser(response.data.teacher);
          // Update last seen timestamp
          localStorage.setItem('lastSeen', new Date().toISOString());
          localStorage.setItem('lastActivity', new Date().toISOString());
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { teacher, token: newToken } = response.data;
      
      setUser(teacher);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('lastSeen', new Date().toISOString());
      localStorage.setItem('lastActivity', new Date().toISOString());
      localStorage.setItem('userType', 'teacher');
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { teacher, token: newToken } = response.data;
      
      setUser(teacher);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('lastSeen', new Date().toISOString());
      localStorage.setItem('lastActivity', new Date().toISOString());
      localStorage.setItem('userType', 'teacher');
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('lastSeen');
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('userType');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      setUser(response.data.teacher);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Profile update failed');
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 