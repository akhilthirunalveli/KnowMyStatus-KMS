import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Save
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const TeacherDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [qrCode, setQrCode] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(user?.status || 'available');
  const [statusNote, setStatusNote] = useState(user?.status_note || '');
  const [statusUntil, setStatusUntil] = useState(user?.status_until ? user.status_until.slice(0, 16) : '');
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchQRCode();
    fetchAnalytics();
    setStatus(user?.status || 'available');
    setStatusNote(user?.status_note || '');
    setStatusUntil(user?.status_until ? user.status_until.slice(0, 16) : '');
  }, [user]);

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
    const profileData = {
      status,
      status_note: statusNote,
      status_until: statusUntil ? new Date(statusUntil).toISOString() : null,
    };
    const result = await updateProfile(profileData);
    setStatusLoading(false);
    if (result.success) {
      toast.success('Status updated!');
    }
  };

  const stats = [
    {
      title: 'Total Scans',
      value: analytics?.totalScans || 0,
      icon: <Eye className="h-6 w-6" />,
      color: 'text-app-accent',
      bgColor: 'bg-app-surface'
    },
    {
      title: 'Today\'s Scans',
      value: analytics?.todayScans || 0,
      icon: <Calendar className="h-6 w-6" />,
      color: 'text-app-success',
      bgColor: 'bg-app-surface'
    },
    {
      title: 'Weekly Scans',
      value: analytics?.weeklyScans || 0,
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'text-app-accent-dark',
      bgColor: 'bg-app-surface'
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-text-primary mb-2">
          Teacher Dashboard
        </h1>
        <p className="text-app-text-secondary">
          Welcome back, {user?.name}! Manage your QR code and view analytics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-app-text-muted">{stat.title}</p>
                <p className="text-2xl font-bold text-app-text-primary">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-app-text-primary">Your QR Code</h2>
            <button
              onClick={fetchAnalytics}
              disabled={analyticsLoading}
              className="p-2 text-app-text-muted hover:text-app-accent transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${analyticsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {qrCode ? (
            <div className="text-center">
              <div className="bg-app-surface p-4 rounded-lg border-2 border-app-border inline-block mb-4">
                <img 
                  src={`http://localhost:5000${qrCode.qrCodeUrl}`} 
                  alt="Teacher QR Code"
                  className="w-48 h-48"
                />
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={downloadQRCode}
                  className="btn-primary flex items-center justify-center space-x-2 w-full"
                >
                  <Download className="h-5 w-5" />
                  <span>Download QR Code</span>
                </button>
                
                <button
                  onClick={copyQRData}
                  className="btn-outline flex items-center justify-center space-x-2 w-full"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      <span>Copy QR Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <QrCode className="h-16 w-16 text-app-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-app-text-primary mb-2">
                No QR Code Generated
              </h3>
              <p className="text-app-text-secondary mb-6">
                Generate your personal QR code to share with students.
              </p>
              <button
                onClick={generateQRCode}
                disabled={loading}
                className="btn-primary flex items-center justify-center space-x-2 mx-auto"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="h-5 w-5" />
                    <span>Generate QR Code</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Current Status Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-app-text-primary">Current Status</h3>
              <Clock className="h-5 w-5 text-app-text-muted" />
            </div>
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-app-text-secondary mb-1">Status</label>
                <select
                  className="input-field"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="not_available">Not Available</option>
                  <option value="on_leave">On Leave</option>
                  <option value="lunch">Lunch</option>
                  <option value="in_meeting">In Meeting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-app-text-secondary mb-1 flex items-center gap-1">
                  <StickyNote className="h-4 w-4 text-app-text-muted" /> Note (optional)
                </label>
                <input
                  className="input-field"
                  type="text"
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  placeholder="Add a note (e.g. 'Back at 2pm')"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-app-text-secondary mb-1">Expected Return (optional)</label>
                <input
                  className="input-field"
                  type="datetime-local"
                  value={statusUntil}
                  onChange={e => setStatusUntil(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center space-x-2"
                disabled={statusLoading}
              >
                {statusLoading ? <LoadingSpinner size="small" /> : <Save className="h-4 w-4" />}
                <span>{statusLoading ? 'Updating...' : 'Update Status'}</span>
              </button>
            </form>
            {/* Display current status */}
            <div className="mt-4 p-3 bg-app-surface rounded-lg">
              <p className="text-sm text-app-text-muted mb-1">Current:</p>
              <div className="flex flex-col gap-1">
                <span className="font-medium capitalize">{status.replace('_', ' ')}</span>
                {statusNote && <span className="text-xs text-app-text-muted">Note: {statusNote}</span>}
                {statusUntil && <span className="text-xs text-app-text-muted">Until: {new Date(statusUntil).toLocaleString()}</span>}
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-app-text-primary">Profile</h3>
              <Settings className="h-5 w-5 text-app-text-muted" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-app-text-muted">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-app-text-muted">Subject</p>
                <p className="font-medium">{user?.subject}</p>
              </div>
              <div>
                <p className="text-sm text-app-text-muted">Department</p>
                <p className="font-medium">{user?.department}</p>
              </div>
              {user?.office && (
                <div>
                  <p className="text-sm text-app-text-muted">Office</p>
                  <p className="font-medium">{user.office}</p>
                </div>
              )}
            </div>
            <Link 
              to="/teacher/profile" 
              className="btn-outline w-full mt-4 flex items-center justify-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-app-text-primary mb-4">Recent Activity</h3>
            {analyticsLoading ? (
              <LoadingSpinner size="small" text="Loading..." />
            ) : analytics?.recentScans?.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentScans.slice(0, 5).map((scan, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-app-surface rounded-lg">
                    <div className="p-2 bg-app-accent-light rounded-full">
                      <Eye className="h-4 w-4 text-app-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-app-text-primary">QR Code Scanned</p>
                      <p className="text-xs text-app-text-muted">
                        {new Date(scan.scanned_at).toLocaleDateString()} at{' '}
                        {new Date(scan.scanned_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-8 w-8 text-app-text-muted mx-auto mb-2" />
                <p className="text-app-text-muted text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 