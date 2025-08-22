import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentPage from './pages/StudentPage';
import TeacherProfile from './pages/TeacherProfile';
import QRScanner from './pages/QRScanner';
import TeacherDetails from './pages/TeacherDetails';
import TeacherQR from './pages/TeacherQR';
import AdminDashboard from './pages/AdminDashboard';
import LoadingBar from './components/LoadingBar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
  return <LoadingBar />;
  }
  
  return isAuthenticated ? children : <Navigate to="/teacher/login" />;
};

// Redirect authenticated users away from auth pages
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
  return <LoadingBar />;
  }
  
  return isAuthenticated ? <Navigate to="/teacher/dashboard" /> : children;
};

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
  return <LoadingBar />;
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#000000'}}>
      <main>
        <Routes>
          <Route 
            path="/" 
            element={<Home />}
          />
          <Route 
            path="/login" 
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            } 
          />
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/profile" 
            element={
              <ProtectedRoute>
                <TeacherProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/student/scan" element={<QRScanner />} />
          <Route path="/student/teacher/:id" element={<TeacherDetails />} />
          <Route path="/student/teacher/:id/qr" element={<TeacherQR />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 