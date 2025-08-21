export const API_CONFIG = {
  // Replace with your actual backend URL
  BASE_URL: 'https://your-backend-url.onrender.com',
  
  ENDPOINTS: {
    TEACHER_STATUS: '/api/teachers/status',
    QR_VERIFICATION: '/api/qr/verify',
    TEACHER_DETAILS: '/api/teachers',
  },
  
  // Development URL for testing
  DEV_URL: 'http://localhost:3000',
};

// Auto-detect environment
export const getBaseUrl = () => {
  if (__DEV__) {
    return API_CONFIG.DEV_URL;
  }
  return API_CONFIG.BASE_URL;
};
