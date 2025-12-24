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
import ShareCardModal from '../../components/teacher/ShareCardModal';

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
  const [showShareModal, setShowShareModal] = useState(false);
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
      {/* Header */}
      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="premium-card w-full max-w-5xl !rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight transition-opacity flex items-center gap-0 cabinet-grotesk">
            KnowMyStatus<span className="text-[#ff3333] text-4xl leading-none">.</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-gray-300">System Online</span>
            </div>

            <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>

            <button
              onClick={handleLogout}
              className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {/* Main Content */}
      <main className="pt-32 pb-12 px-6 w-full lg:px-8 mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold font-cabinet-grotesk text-white mb-2">
            Hello, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-400 text-lg">{user?.subject} • {user?.department}</p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">

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
            <div className="premium-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold font-cabinet-grotesk text-white">Recent Activity</h2>
                <div className="p-2 rounded-full bg-white/5 border border-white/10">
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {analyticsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingBar text="Loading..." />
                </div>
              ) : analytics?.recentScans?.length > 0 ? (
                <div className="space-y-4">
                  {analytics.recentScans.slice(0, 3).map((scan, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 transition-colors">
                      <div className="p-3 bg-[#ff3333]/10 rounded-xl transition-colors">
                        <Eye className="h-5 w-5 text-[#ff3333]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white transition-colors">QR Code Scanned</p>
                        <p className="text-sm text-gray-500">
                          {new Date(scan.scanned_at).toLocaleDateString()} at{' '}
                          {new Date(scan.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
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
              onShareCard={() => setShowShareModal(true)}
            />

            {/* Profile Card */}
            <div className="premium-card p-6 sm:p-8">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ff3333] to-red-900 rounded-2xl flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-cabinet-grotesk text-white">{user?.name}</h3>
                  <p className="text-sm text-gray-400">{user?.subject}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Department</p>
                  <p className="text-white font-medium text-lg">{user?.department}</p>
                </div>
                {user?.office && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Office</p>
                    <p className="text-white font-medium text-lg">{user.office}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Current Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${status === 'available'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                      : 'bg-red-500/10 border-red-500/30 text-red-500'
                      }`}>
                      {status.replace('_', ' ')}
                    </div>
                  </div>
                  {statusNote && <p className="text-sm text-gray-400 mt-2 bg-white/5 p-3 rounded-lg border border-white/5 italic">"{statusNote}"</p>}
                </div>
              </div>
              <Link
                to="/teacher/profile"
                className="mt-8 w-full bg-white/5 text-white font-medium py-3 px-4 rounded-xl transition-colors border border-white/10 flex items-center justify-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </main>

      <ShareCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        user={user}
        qrCode={qrCode}
      />
    </div>
  );
};

export default TeacherDashboard;