import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  History,
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  Download,
  Activity,
  ChevronDown,
  ChevronUp,
  Info,
  LogOut
} from 'lucide-react';
import LoadingBar from '../../components/common/LoadingBar';

const StatusHistory = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [expandedSection, setExpandedSection] = useState('overview');

  // Set page title
  useEffect(() => {
    document.title = "Status History - KnowMyStatus";
  }, []);

  // Fetch history and analytics
  useEffect(() => {
    fetchStatusHistory();
    fetchStatusAnalytics();
  }, [days]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const fetchStatusHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/status-history/my-history?days=${days}`);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching status history:', error);
      toast.error('Failed to load status history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await axios.get(`/api/status-history/analytics/me?days=${days}`);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching status analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const exportHistory = async () => {
    try {
      const response = await axios.get(`/api/status-history/export/${user.id}?days=${days}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `status-history-${user.name}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Status history exported successfully!');
    } catch (error) {
      console.error('Error exporting history:', error);
      toast.error('Failed to export history');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      not_available: 'bg-red-500/20 text-red-400 border-red-500/30',
      on_leave: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      lunch: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      in_meeting: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      busy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const formatStatus = (status) => {
    return status ? status.replace('_', ' ').toUpperCase() : 'UNKNOWN';
  };

  const StatCard = ({ title, value, icon, subtitle, loading }) => (
    <div className="premium-card p-6">
      <div className="flex items-start justify-between mb-4">
        <span className="p-2 rounded-lg bg-white/5 text-gray-400">
          {icon}
        </span>
      </div>
      <div>
        {loading ? (
          <div className="h-8 w-16 bg-white/10 rounded animate-pulse"></div>
        ) : (
          <h3 className="text-3xl font-bold font-cabinet-grotesk text-white">{value}</h3>
        )}
        <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-wide">{title}</p>
        {subtitle && <p className="text-gray-600 text-xs mt-2">{subtitle}</p>}
      </div>
    </div>
  );

  const SectionHeader = ({ title, icon, sectionId }) => (
    <button
      onClick={() => setExpandedSection(expandedSection === sectionId ? null : sectionId)}
      className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="p-2 rounded-lg bg-[#ff3333]/10 text-[#ff3333]">
          {icon}
        </span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      {expandedSection === sectionId ? (
        <ChevronUp className="h-5 w-5 text-gray-400" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-black cabinet-grotesk">
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
      <main className="pt-32 pb-12 px-6 w-full lg:px-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Link
              to="/teacher/dashboard"
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold font-cabinet-grotesk text-white mb-2">
                Status <span className="text-[#ff3333]">History</span>
              </h1>
              <p className="text-gray-400">Track your availability patterns and insights</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="bg-white/5 border border-white/10 text-white py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:border-[#ff3333]/50"
            >
              <option value={7} className="bg-black">Last 7 days</option>
              <option value={30} className="bg-black">Last 30 days</option>
              <option value={90} className="bg-black">Last 90 days</option>
            </select>

            <button
              onClick={exportHistory}
              className="bg-white/5 border border-white/10 text-white font-medium py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 text-sm hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Changes"
            value={analytics?.totalChanges || 0}
            icon={<Activity className="h-5 w-5" />}
            subtitle={`Over last ${days} days`}
            loading={analyticsLoading}
          />
          <StatCard
            title="Most Common"
            value={analytics?.mostCommonStatus ? formatStatus(analytics.mostCommonStatus) : 'N/A'}
            icon={<BarChart3 className="h-5 w-5" />}
            subtitle="Most frequent status"
            loading={analyticsLoading}
          />
          <StatCard
            title="Most Active Day"
            value={analytics?.mostActiveDay || 'N/A'}
            icon={<Calendar className="h-5 w-5" />}
            subtitle="Day with most changes"
            loading={analyticsLoading}
          />
          <StatCard
            title="Peak Hour"
            value={analytics?.peakHour || 'N/A'}
            icon={<Clock className="h-5 w-5" />}
            subtitle="Most active time slot"
            loading={analyticsLoading}
          />
        </div>

        {/* Expandable Sections */}
        <div className="space-y-4">
          {/* Overview Section */}
          <div className="space-y-4">
            <SectionHeader
              title="Status Overview"
              icon={<Info className="h-5 w-5" />}
              sectionId="overview"
            />
            {expandedSection === 'overview' && (
              <div className="premium-card p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Changes by Status */}
                <div>
                  <h4 className="text-white font-bold mb-4">Status Change Frequency</h4>
                  {analyticsLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 bg-white/10 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : analytics?.changesByStatus && Object.keys(analytics.changesByStatus).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(analytics.changesByStatus)
                        .sort(([,a], [,b]) => b - a)
                        .map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(status)}`}>
                                {formatStatus(status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#ff3333] rounded-full"
                                  style={{ width: `${(count / analytics.totalChanges) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-white font-medium w-8 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No data available</p>
                  )}
                </div>

                {/* Daily Pattern */}
                <div>
                  <h4 className="text-white font-bold mb-4">Activity by Day of Week</h4>
                  {analyticsLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-8 bg-white/10 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : analytics?.dailyPattern && Object.keys(analytics.dailyPattern).length > 0 ? (
                    <div className="space-y-3">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                        const count = analytics.dailyPattern[day] || 0;
                        const maxCount = Math.max(...Object.values(analytics.dailyPattern));
                        return (
                          <div key={day} className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm w-24">{day}</span>
                            <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                              {count > 0 && (
                                <div
                                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#ff3333]/50 to-[#ff3333] rounded-lg transition-all"
                                  style={{ width: `${(count / (maxCount || 1)) * 100}%` }}
                                ></div>
                              )}
                              <span className="absolute inset-0 flex items-center px-3 text-sm text-white">
                                {count > 0 ? count : ''}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No data available</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hourly Pattern Section */}
          <div className="space-y-4">
            <SectionHeader
              title="Hourly Activity Pattern"
              icon={<Clock className="h-5 w-5" />}
              sectionId="hourly"
            />
            {expandedSection === 'hourly' && (
              <div className="premium-card p-6">
                {analyticsLoading ? (
                  <div className="h-32 bg-white/10 rounded animate-pulse"></div>
                ) : analytics?.hourlyPattern && Object.keys(analytics.hourlyPattern).length > 0 ? (
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                    {Array.from({ length: 24 }, (_, i) => {
                      const count = analytics.hourlyPattern[i] || 0;
                      const maxCount = Math.max(...Object.values(analytics.hourlyPattern));
                      const height = count > 0 ? Math.max(20, (count / maxCount) * 100) : 4;

                      return (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div
                            className="w-full bg-[#ff3333]/30 rounded-t transition-all hover:bg-[#ff3333]/50 relative group cursor-pointer"
                            style={{ height: `${height}px` }}
                          >
                            {count > 0 && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/20 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {count} changes
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-500">{i}:00</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No hourly data available</p>
                )}
                <p className="text-gray-500 text-xs mt-4 text-center">
                  Shows when you most frequently update your status throughout the day
                </p>
              </div>
            )}
          </div>

          {/* Recent History Section */}
          <div className="space-y-4">
            <SectionHeader
              title="Recent Status Changes"
              icon={<History className="h-5 w-5" />}
              sectionId="history"
            />
            {expandedSection === 'history' && (
              <div className="premium-card p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-16 bg-white/10 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                ) : history.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((record, index) => (
                      <div
                        key={record.id || index}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(record.previous_status)}`}>
                            {record.previous_status ? formatStatus(record.previous_status) : 'N/A'}
                          </span>
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(record.new_status)}`}>
                            {formatStatus(record.new_status)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          {record.status_note && (
                            <p className="text-gray-400 text-sm truncate">"{record.status_note}"</p>
                          )}
                          <p className="text-gray-500 text-xs">
                            {new Date(record.changed_at).toLocaleDateString()} at{' '}
                            {new Date(record.changed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <span className="text-xs text-gray-600 hidden sm:block">
                          by {record.changed_by}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No status changes recorded yet</p>
                    <p className="text-gray-600 text-sm mt-2">
                      Changes will appear here when you update your status
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Insights Card */}
        <div className="mt-8 premium-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[#ff3333]/10">
              <TrendingUp className="h-5 w-5 text-[#ff3333]" />
            </div>
            <h3 className="text-lg font-bold text-white">Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <p className="text-gray-400">
                <span className="text-white font-medium">Average Changes Per Day:</span>{' '}
                {analytics?.averageChangesPerDay || '0.00'}
              </p>
              <p className="text-gray-400">
                <span className="text-white font-medium">Most Active Time:</span>{' '}
                {analytics?.peakHour || 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">
                <span className="text-white font-medium">Preferred Status:</span>{' '}
                {analytics?.mostCommonStatus ? formatStatus(analytics.mostCommonStatus) : 'N/A'}
              </p>
              <p className="text-gray-400">
                <span className="text-white font-medium">Tracking Period:</span>{' '}
                Last {days} days
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatusHistory;
