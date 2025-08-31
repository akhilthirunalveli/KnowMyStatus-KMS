import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  BarChart3,
  Users,
  Eye,
  Calendar,
  Settings,
  RefreshCw,
  LogOut,
  ArrowUpRight,
  User,
  Activity
} from 'lucide-react';
import LoadingBar from '../../components/common/LoadingBar';

// Import custom components
import StatusUpdateCard from '../../components/teacher/StatusUpdateCard';
import QRCodeCard from '../../components/teacher/QRCodeCard';
import AnalyticsCards from '../../components/teacher/AnalyticsCards';

// Import utilities
import { getStatusColor } from '../../utils/uiUtils';

const TeacherDashboard = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  // Set page title
  useEffect(() => {
    document.title = "Teacher Dashboard - KnowMyStatus";
  }, []);
  
  // All state variables
  const [qrCode, setQrCode] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(user?.status || 'available');
  const [statusNote, setStatusNote] = useState(user?.status_note || '');
  const [statusUntilDate, setStatusUntilDate] = useState(
    user?.status_until 
      ? new Date(user.status_until).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  const [statusUntilTime, setStatusUntilTime] = useState(
    user?.status_until 
      ? new Date(user.status_until).toTimeString().slice(0, 5)
      : new Date().toTimeString().slice(0, 5)
  );
  const [statusLoading, setStatusLoading] = useState(false);

  // Initialize state when user data changes
  useEffect(() => {
    fetchQRCode();
    fetchAnalytics();
    setStatus(user?.status || 'available');
    setStatusNote(user?.status_note || '');
    setStatusUntilDate(
      user?.status_until 
        ? new Date(user.status_until).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0]
    );
    setStatusUntilTime(
      user?.status_until 
        ? new Date(user.status_until).toTimeString().slice(0, 5)
        : new Date().toTimeString().slice(0, 5)
    );
  }, [user]);

  // Logout handler
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // API Functions
  const fetchQRCode = async () => {
    try {
      const response = await axios.get('/api/qr/my-qr');
      setQrCode(response.data);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await axios.get('/api/teachers/analytics/me');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/qr/generate');
      setQrCode(response.data);
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCode?.qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCode.qrCodeUrl;
      link.download = `teacher-qr-${user?.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyQRData = () => {
    if (qrCode?.qrData) {
      navigator.clipboard.writeText(JSON.stringify(qrCode.qrData, null, 2));
      setCopied(true);
      toast.success('QR data copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setStatusLoading(true);
    
    // Combine date and time if both are provided
    let statusUntilDateTime = null;
    if (statusUntilDate && statusUntilTime) {
      statusUntilDateTime = new Date(`${statusUntilDate}T${statusUntilTime}`).toISOString();
    } else if (statusUntilDate) {
      statusUntilDateTime = new Date(`${statusUntilDate}T00:00`).toISOString();
    }
    
    const profileData = {
      status,
      status_note: statusNote,
      status_until: statusUntilDateTime,
    };
    const result = await updateProfile(profileData);
    setStatusLoading(false);
    if (result.success) {
      toast.success('Status updated!');
    }
  };

  // Stats configuration
  const stats = [
    {
      title: 'Total Scans',
      value: analytics?.totalScans || 0,
      icon: <Eye className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Today\'s Scans',
      value: analytics?.todayScans || 0,
      icon: <Calendar className="h-5 w-5 " />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Weekly Scans',
      value: analytics?.weeklyScans || 0,
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-black cabinet-grotesk">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-lg px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            {/* Brand */}
            <Link to="/" className="text-white text-xl sm:text-2xl navbar-brand font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
              KnowMyStatus<span className="navbar-red-dot">.</span>
            </Link>
            {/* Welcome Message */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Welcome, {user?.name?.split(' ')[0] || 'Teacher'}
              </h1>
              <p className="text-gray-400 text-sm">{user?.subject} • {user?.department}</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 sm:gap-8">
            <button
              onClick={handleLogout}
              className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-3 sm:px-4 rounded-full border-dashed border-2 border-red-500 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Left Column */}
          <div className="xl:col-span-8 space-y-4 sm:space-y-6">
            
            {/* Status Update Card */}
            <StatusUpdateCard 
              status={status}
              setStatus={setStatus}
              statusNote={statusNote}
              setStatusNote={setStatusNote}
              statusUntilDate={statusUntilDate}
              setStatusUntilDate={setStatusUntilDate}
              statusUntilTime={statusUntilTime}
              setStatusUntilTime={setStatusUntilTime}
              statusLoading={statusLoading}
              handleStatusUpdate={handleStatusUpdate}
              getStatusColor={getStatusColor}
            />

            {/* Analytics Cards */}
            <AnalyticsCards stats={stats} />

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/30 backdrop-blur-lg rounded-2xl border border-blue-700/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
              
              {analyticsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingBar text="Loading..." />
                </div>
              ) : analytics?.recentScans?.length > 0 ? (
                <div className="space-y-4">
                  {analytics.recentScans.slice(0, 3).map((scan, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-gray-700">
                      <div className="p-2 bg-blue-800/50 rounded-lg">
                        <Eye className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">QR Code Scanned</p>
                        <p className="text-sm text-gray-400">
                          {new Date(scan.scanned_at).toLocaleDateString()} at{' '}
                          {new Date(scan.scanned_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-4 space-y-4 sm:space-y-6">
          {/* QR Code Card */}
          <QRCodeCard 
            qrCode={qrCode}
            loading={loading}
            generateQRCode={generateQRCode}
            downloadQRCode={downloadQRCode}
            copyQRData={copyQRData}
            copied={copied}
          />

            {/* Profile Card */}
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/30 backdrop-blur-lg rounded-2xl border border-green-700/30 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                  <p className="text-sm text-gray-400">{user?.subject}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Department</p>
                  <p className="text-white font-medium">{user?.department}</p>
                </div>
                {user?.office && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Office</p>
                    <p className="text-white font-medium">{user.office}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${getStatusColor(status)}`}>
                      {status.replace('_', ' ')}
                    </div>
                  </div>
                  {statusNote && <p className="text-xs text-gray-400 mt-1">{statusNote}</p>}
                </div>
              </div>
              <Link
                to="/teacher/profile"
                className="mt-6 w-full bg-green-800/50 hover:bg-green-700/50 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;