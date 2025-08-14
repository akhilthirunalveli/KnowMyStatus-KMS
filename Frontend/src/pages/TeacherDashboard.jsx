import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  QrCode,
  Download,
  BarChart3,
  Users,
  Eye,
  Calendar,
  Settings,
  RefreshCw,
  Copy,
  CheckCircle,
  Clock,
  StickyNote,
  Save,
  LogOut,
  ArrowUpRight,
  TrendingUp,
  User,
  Activity
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

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
      link.href = `http://localhost:5000${qrCode.qrCodeUrl}`;
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

  // Helper function for status colors
  const getStatusColor = (currentStatus) => {
    switch(currentStatus) {
      case 'available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'not_available': return 'bg-red-100 text-red-800 border-red-200';
      case 'on_leave': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lunch': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_meeting': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      icon: <Calendar className="h-5 w-5" />,
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
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-gray-300 hover:text-white hover:bg-red-600/20 rounded-full border-2 border-dashed border-gray-500 hover:border-red-400 transition-all duration-300 bg-transparent backdrop-blur-sm text-sm sm:text-base"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
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
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/30 backdrop-blur-lg rounded-2xl border border-red-700/30 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-0">
                  <div className="p-2 bg-red-800/50 rounded-lg">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-lg font-semibold text-white">Status Update</h2>
                    <p className="text-sm text-gray-400">Update your availability status</p>
                  </div>
                </div>
                
                {/* Current Status Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                  {status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <form onSubmit={handleStatusUpdate} className="space-y-4 sm:space-y-6">
                {/* Status Selection Pills */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Status</label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setStatus('available')}
                      className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        status === 'available' 
                          ? 'bg-emerald-600 text-white border-emerald-500' 
                          : 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-800/40'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('not_available')}
                      className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        status === 'not_available' 
                          ? 'bg-red-600 text-white border-red-500' 
                          : 'bg-red-900/30 text-red-400 border border-red-700/50 hover:bg-red-800/40'
                      }`}
                    >
                      Not Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('on_leave')}
                      className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        status === 'on_leave' 
                          ? 'bg-orange-600 text-white border-orange-500' 
                          : 'bg-orange-900/30 text-orange-400 border border-orange-700/50 hover:bg-orange-800/40'
                      }`}
                    >
                      On Leave
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('lunch')}
                      className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        status === 'lunch' 
                          ? 'bg-blue-600 text-white border-blue-500' 
                          : 'bg-blue-900/30 text-blue-400 border border-blue-700/50 hover:bg-blue-800/40'
                      }`}
                    >
                      Lunch
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('in_meeting')}
                      className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        status === 'in_meeting' 
                          ? 'bg-purple-600 text-white border-purple-500' 
                          : 'bg-purple-900/30 text-purple-400 border border-purple-700/50 hover:bg-purple-800/40'
                      }`}
                    >
                      In Meeting
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Note (optional)</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/50 text-white placeholder-gray-400 text-sm"
                      type="text"
                      value={statusNote}
                      onChange={e => setStatusNote(e.target.value)}
                      placeholder="Add a note"
                      maxLength={100}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expected Return Date</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/50 text-white text-sm"
                      type="date"
                      value={statusUntilDate}
                      onChange={e => setStatusUntilDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expected Return Time</label>
                    <input
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-black/50 text-white text-sm"
                      type="time"
                      value={statusUntilTime}
                      onChange={e => setStatusUntilTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                    disabled={statusLoading}
                  >
                    {statusLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {statusLoading ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </form>

              {/* Current Status Display */}
              {(statusNote || statusUntilDate || statusUntilTime) && (
                <div className="mt-4 p-3 bg-black/30 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Current Status Details:</p>
                  <div className="flex flex-col gap-1">
                    {statusNote && <span className="text-xs text-gray-300">Note: {statusNote}</span>}
                    {(statusUntilDate || statusUntilTime) && (
                      <span className="text-xs text-gray-300">
                        Until: {statusUntilDate && new Date(statusUntilDate).toLocaleDateString()}
                        {statusUntilDate && statusUntilTime && ' at '}
                        {statusUntilTime && new Date(`2000-01-01T${statusUntilTime}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${stat.changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-1`}>
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/30 backdrop-blur-lg rounded-2xl border border-blue-700/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </div>
              
              {analyticsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="small" text="Loading..." />
                </div>
              ) : analytics?.recentScans?.length > 0 ? (
                <div className="space-y-4">
                  {analytics.recentScans.slice(0, 5).map((scan, index) => (
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
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/30 backdrop-blur-lg rounded-2xl border border-purple-700/30 p-4 sm:p-6">
            <h2 className="text-lg sm:text-lg font-semibold text-white mb-4 sm:mb-6">Your QR Code</h2>
            {qrCode ? (
              <div className="text-center">
                <div className="bg-black/30 p-2 rounded-xl inline-block mb-4 border-2 border-dashed border-purple-500/50 font-cabinet-grotesk">
                  <img 
                    src={qrCode?.qrCodeUrl?.startsWith('http') ? qrCode.qrCodeUrl : `http://localhost:5000${qrCode.qrCodeUrl}`} 
                    alt="Teacher QR Code"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={downloadQRCode}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Download className="h-4 w-4" />
                    Download QR Code
                  </button>
                  <button
                    onClick={copyQRData}
                    className="w-full border border-purple-500/50 hover:bg-purple-900/30 text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy QR Data
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                </div>
                <h3 className="font-medium text-white mb-2 text-sm sm:text-base">No QR Code Generated</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-4">Generate your personal QR code to share with students.</p>
                <button
                  onClick={generateQRCode}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4" />
                      Generate QR Code
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

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