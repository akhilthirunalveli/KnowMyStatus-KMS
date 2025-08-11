/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lime-bright': '#FFD900',
        // App Color System
        'app-background': '#000000',
        'app-surface': '#111111',
        'app-overlay': 'rgba(0, 0, 0, 0.8)',
        
        // Text Colors
        'app-text-primary': '#ffffff',
        'app-text-secondary': '#cccccc',
        'app-text-muted': '#999999',
        'app-text-light': '#ffffff',
        
        // Button Colors
        'app-button-primary': '#EBAC00',
        'app-button-primary-hover': '#d49a00',
        'app-button-primary-text': '#000000',
        'app-button-secondary': '#333333',
        'app-button-secondary-hover': '#555555',
        'app-button-secondary-text': '#ffffff',
        
        // Input Colors
        'app-input': '#000000',
        'app-input-text': '#ffffff',
        'app-placeholder': '#888888',
        'app-border': '#333333',
        
        // Card Colors
        'app-card': '#000000',
        'app-card-text': '#ffffff',
        'app-card-border': '#333333',
        
        // Navigation Colors
        'app-nav-text': '#666666',
        'app-nav-hover': '#333333',
        'app-nav-active-bg': '#333333',
        'app-nav-active-text': '#ffffff',
        
        // Accent Colors
        'app-accent': '#3b82f6',
        'app-accent-light': '#eff6ff',
        'app-accent-dark': '#1e40af',
        
        // Status Colors
        'app-status-available': '#22c55e',
        'app-status-busy': '#ef4444',
        'app-status-away': '#f59e0b',
        
        // State Colors
        'app-success': '#22c55e',
        'app-error': '#ef4444',
        'app-warning': '#f59e0b',
        'app-info': '#3b82f6',
        
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 