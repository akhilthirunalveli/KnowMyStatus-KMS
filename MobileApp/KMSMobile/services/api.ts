import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl, API_CONFIG } from '../config/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export interface TeacherStatus {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'busy' | 'meeting' | 'offline';
  lastUpdated: string;
  room?: string;
  department?: string;
}

export interface QRVerificationResponse {
  success: boolean;
  teacher: TeacherStatus;
  message?: string;
}

export const apiService = {
  // Verify QR code and get teacher status
  verifyQRCode: async (qrData: string): Promise<QRVerificationResponse> => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.QR_VERIFICATION, {
        qrCode: qrData,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to verify QR code'
      );
    }
  },

  // Get teacher status by ID
  getTeacherStatus: async (teacherId: string): Promise<TeacherStatus> => {
    try {
      const response = await api.get(
        `${API_CONFIG.ENDPOINTS.TEACHER_STATUS}/${teacherId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get teacher status'
      );
    }
  },

  // Get all teachers (for admin view)
  getAllTeachers: async (): Promise<TeacherStatus[]> => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.TEACHER_DETAILS);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get teachers'
      );
    }
  },

  // Update base URL (for switching between dev/prod)
  updateBaseUrl: (url: string) => {
    api.defaults.baseURL = url;
  },
};

export default api;
