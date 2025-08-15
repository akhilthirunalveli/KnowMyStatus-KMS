import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  Mail, 
  Phone, 
  Building, 
  BookOpen, 
  MapPin, 
  Clock, 
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  User,
  Lock,
  Unlock,
  Home
} from 'lucide-react';

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLocked, setIsLocked] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState(['', '', '']);
  const [currentPasswordIndex, setCurrentPasswordIndex] = useState(0);

  const ADMIN_PASSWORD = ['K', 'M', 'S'];

  // Set page title
  useEffect(() => {
    document.title = "Admin Dashboard - KnowMyStatus";
  }, []);

  // Keyboard shortcut listener for 'S' key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === 's' && !showPasswordModal) {
        e.preventDefault();
        if (isLocked) {
          handleUnlock();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLocked, showPasswordModal]);

  // Focus management for password modal
  useEffect(() => {
    if (showPasswordModal) {
      // Focus the current password input when modal opens
      setTimeout(() => {
        const currentInput = document.querySelector(`input[data-index="${currentPasswordIndex}"]`);
        if (currentInput) {
          currentInput.focus();
          currentInput.select();
        }
      }, 100);
    }
  }, [showPasswordModal, currentPasswordIndex]);

  const handleLock = () => {
    setIsLocked(true);
    toast.success('Admin dashboard locked');
  };

  const handleUnlock = () => {
    setShowPasswordModal(true);
    setPassword(['', '', '']);
    setCurrentPasswordIndex(0);
  };

  const handlePasswordInput = (index, value) => {
    if (value.length > 1) return; // Only allow single character
    
    const newPassword = [...password];
    newPassword[index] = value.toUpperCase();
    setPassword(newPassword);

    // Auto move to next input
    if (value && index < 2) {
      const nextIndex = index + 1;
      setCurrentPasswordIndex(nextIndex);
      setTimeout(() => {
        const nextInput = document.querySelector(`input[data-index="${nextIndex}"]`);
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }, 50);
    }

    // Check if password is complete and correct
    if (index === 2 && value) {
      setTimeout(() => {
        checkPassword(newPassword);
      }, 100);
    }
  };

  const checkPassword = (pwd) => {
    console.log('Checking password:', pwd);
    console.log('Expected password:', ADMIN_PASSWORD);
    
    const isCorrect = pwd.every((char, index) => {
      const match = char === ADMIN_PASSWORD[index];
      console.log(`Position ${index}: '${char}' === '${ADMIN_PASSWORD[index]}' = ${match}`);
      return match;
    });
    
    console.log('Password correct:', isCorrect);
    
    if (isCorrect) {
      setIsLocked(false);
      setShowPasswordModal(false);
      setPassword(['', '', '']);
      setCurrentPasswordIndex(0);
      toast.success('Admin dashboard unlocked');
    } else {
      toast.error('Incorrect password. Expected: K-M-S');
      setPassword(['', '', '']);
      setCurrentPasswordIndex(0);
      // Focus first input after reset
      setTimeout(() => {
        const firstInput = document.querySelector(`input[data-index="0"]`);
        if (firstInput) {
          firstInput.focus();
          firstInput.select();
        }
      }, 100);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPassword(['', '', '']);
    setCurrentPasswordIndex(0);
  };

  // Fetch all teachers
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/teachers');
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teacher data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Filter and sort teachers
  const filteredTeachers = teachers
    .filter(teacher => {
      const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.department?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || teacher.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      available: 'bg-green-500/20 text-green-400 border-green-500/30',
      not_available: 'bg-red-500/20 text-red-400 border-red-500/30',
      on_leave: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      lunch: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      in_meeting: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[status] || statusColors.available}`}>
        {status ? status.replace('_', ' ').toUpperCase() : 'AVAILABLE'}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Subject', 'Department', 'Phone', 'Office', 'Status', 'Registered'];
    const csvContent = [
      headers.join(','),
      ...filteredTeachers.map(teacher => [
        teacher.name,
        teacher.email,
        teacher.subject || '',
        teacher.department || '',
        teacher.phone || '',
        teacher.office || '',
        teacher.status || 'available',
        formatDate(teacher.created_at)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teachers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-black/80 backdrop-blur-lg border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Brand Logo */}
            <Link to="/" className="text-white text-xl sm:text-2xl navbar-brand font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity cabinet-grotesk">
              KnowMyStatus<span className="navbar-red-dot">.</span>
            </Link>
            {/* Page Title */}
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white cabinet-grotesk">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">Manage all teacher registrations and data</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={isLocked ? handleUnlock : handleLock}
              className={`flex items-center gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full border-2 border-dashed transition-all duration-300 bg-transparent backdrop-blur-sm text-sm sm:text-base ${
                isLocked 
                  ? 'text-red-300 hover:text-red-200 hover:bg-red-600/20 border-red-500 hover:border-red-400'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/20 border-gray-500 hover:border-gray-400'
              }`}
            >
              {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              <span className="hidden sm:inline">{isLocked ? 'Locked' : 'Lock'}</span>
            </button>
            <button
              onClick={fetchTeachers}
              className="flex items-center gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-300 hover:text-white hover:bg-blue-600/20 rounded-full border-2 border-dashed border-gray-500 hover:border-blue-400 transition-all duration-300 bg-transparent backdrop-blur-sm text-sm sm:text-base"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-300 hover:text-white hover:bg-green-600/20 rounded-full border-2 border-dashed border-gray-500 hover:border-green-400 transition-all duration-300 bg-transparent backdrop-blur-sm text-sm sm:text-base"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Lock Overlay */}
        {isLocked && !showPasswordModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center px-4">
            <div className="text-center">
              <Lock className="h-16 w-16 sm:h-20 sm:w-20 text-red-400 mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 cabinet-grotesk">Admin Dashboard Locked</h2>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/"
                  className="flex items-center justify-center w-12 h-12 bg-black hover:bg-gray-600 text-white rounded-lg transition-colors"
                  title="Go to Home"
                >
                  <Home className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleUnlock}
                  className="px-6 sm:px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                >
                  Enter Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10000] flex items-center justify-center">
            <div className="bg-black rounded-xl p-8 max-w-md w-full mx-4 relative">
              <div className="text-center mb-6">
                <Unlock className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white cabinet-grotesk">Enter Admin Password</h3>
                <p className="text-gray-400 text-sm mt-2">Enter the 3-character password</p>
              </div>
              
              <div className="flex justify-center gap-4 mb-6">
                {[0, 1, 2].map((index) => (
                  <input
                    key={index}
                    data-index={index}
                    type="text"
                    maxLength="1"
                    value={password[index]}
                    onChange={(e) => handlePasswordInput(index, e.target.value)}
                    onKeyDown={(e) => {
                      // Handle backspace to go to previous input
                      if (e.key === 'Backspace' && !password[index] && index > 0) {
                        setCurrentPasswordIndex(index - 1);
                        const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
                        if (prevInput) {
                          prevInput.focus();
                          prevInput.select();
                        }
                      }
                      // Handle Enter key to submit
                      if (e.key === 'Enter' && password.every(char => char !== '')) {
                        checkPassword(password);
                      }
                    }}
                    className="w-16 h-16 text-center text-2xl font-bold bg-black border border-gray-900 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase transition-all duration-200"
                    autoFocus={index === currentPasswordIndex}
                    ref={index === currentPasswordIndex ? (el) => el && el.focus() : null}
                  />
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={closePasswordModal}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Check if all inputs are filled
                    if (password.every(char => char !== '')) {
                      checkPassword(password);
                    } else {
                      toast.error('Please enter all 3 characters');
                      // Focus on first empty input
                      const firstEmptyIndex = password.findIndex(char => char === '');
                      if (firstEmptyIndex !== -1) {
                        setCurrentPasswordIndex(firstEmptyIndex);
                        const input = document.querySelector(`input[data-index="${firstEmptyIndex}"]`);
                        if (input) input.focus();
                      }
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
          {/* Enhanced Filters and Search Section */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg rounded-2xl border-2 border-dashed border-gray-600/50 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 bg-blue-900/50 rounded-lg border border-dashed border-blue-600/50">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white cabinet-grotesk">Search & Filter</h3>
                <p className="text-xs sm:text-sm text-gray-400">Find and organize teacher data</p>
              </div>
              <div className="ml-auto text-xs sm:text-sm text-gray-500">
                {filteredTeachers.length} / {teachers.length} teachers
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Search className="h-4 w-4 text-white" />
                Search Teachers
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, subject, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-black/50 border-2 border-dashed border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-white placeholder-gray-400 text-sm sm:text-base transition-all duration-300 hover:border-gray-500/70"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Filter by Status
                </label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border-2 border-dashed border-gray-600/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 text-white text-xs sm:text-sm transition-all duration-300 hover:border-gray-500/70 appearance-none cursor-pointer"
                  >
                    <option value="all">🌟 All Status</option>
                    <option value="available">✅ Available</option>
                    <option value="not_available">❌ Not Available</option>
                    <option value="on_leave">🏖️ On Leave</option>
                    <option value="lunch">🍽️ Lunch</option>
                    <option value="in_meeting">🤝 In Meeting</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Sort by Field
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border-2 border-dashed border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 text-white text-xs sm:text-sm transition-all duration-300 hover:border-gray-500/70 appearance-none cursor-pointer"
                  >
                    <option value="created_at">📅 Registration Date</option>
                    <option value="name">👤 Name</option>
                    <option value="email">📧 Email</option>
                    <option value="department">🏢 Department</option>
                    <option value="subject">📚 Subject</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Sort Order
                </label>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/50 border-2 border-dashed border-gray-600/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300 text-white text-xs sm:text-sm flex items-center justify-center gap-2 hover:border-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400"
                >
                  {sortOrder === 'asc' ? (
                    <>
                      <span>🔼 Ascending</span>
                    </>
                  ) : (
                    <>
                      <span>🔽 Descending</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Quick Actions
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                      setSortBy('created_at');
                      setSortOrder('desc');
                    }}
                    className="flex-1 px-2 sm:px-3 py-2 sm:py-3 bg-black/50 border-2 border-dashed border-gray-600/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300 text-white text-xs flex items-center justify-center hover:border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-400"
                    title="Clear all filters"
                  >
                    🔄
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="flex-1 px-2 sm:px-3 py-2 sm:py-3 bg-black/50 border-2 border-dashed border-gray-600/50 rounded-lg hover:bg-gray-800/50 transition-all duration-300 text-white text-xs flex items-center justify-center hover:border-green-400 focus:ring-2 focus:ring-green-500 focus:border-green-400"
                    title="Export to CSV"
                  >
                    📥
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || filterStatus !== 'all' || sortBy !== 'created_at' || sortOrder !== 'desc') && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-600/50">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-400">Active filters:</span>
                  {searchTerm && (
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs border border-dashed border-blue-600/50">
                      Search: {searchTerm}
                    </span>
                  )}
                  {filterStatus !== 'all' && (
                    <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded-full text-xs border border-dashed border-green-600/50">
                      Status: {filterStatus.replace('_', ' ')}
                    </span>
                  )}
                  {(sortBy !== 'created_at' || sortOrder !== 'desc') && (
                    <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs border border-dashed border-purple-600/50">
                      Sort: {sortBy} ({sortOrder})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Data Table */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg rounded-2xl border-2 border-dashed border-gray-600/50 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-dashed border-gray-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-900/50 rounded-lg border border-dashed border-purple-600/50">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white cabinet-grotesk">Teacher Directory</h3>
                    <p className="text-xs sm:text-sm text-gray-400">Manage all registered teachers</p>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  {filteredTeachers.length} teachers found
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 border-dashed"></div>
                <span className="ml-3 text-gray-400 text-sm">Loading teachers...</span>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-600/50 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-400 mb-2 cabinet-grotesk">No teachers found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                      setSortBy('created_at');
                      setSortOrder('desc');
                    }}
                    className="mt-4 px-4 py-2 bg-red-600/20 border border-dashed border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                <thead className="bg-black/30 border-b border-dashed border-gray-600/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/4">Teacher</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/5 hidden sm:table-cell">Contact</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/5 hidden md:table-cell">Academic</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/6 hidden lg:table-cell">Location</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/6">Status</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/6 hidden lg:table-cell">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-gray-700/50">
                  {filteredTeachers.map((teacher, index) => (
                    <tr key={teacher.id || index} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-dashed border-gray-600/50 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                              <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                            </div>
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <div className="text-xs sm:text-sm font-medium text-white cabinet-grotesk">{teacher.name}</div>
                            <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">{teacher.email}</div>
                            <div className="text-xs text-gray-400 sm:hidden">{teacher.email?.split('@')[0]}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-xs sm:text-sm text-gray-300">
                          {teacher.phone && (
                            <div className="flex items-center gap-2 mb-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{teacher.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="truncate max-w-[150px] sm:max-w-[200px]">{teacher.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-xs sm:text-sm text-gray-300">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            <span>{teacher.subject || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            <span>{teacher.department || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-xs sm:text-sm text-gray-300">
                          {teacher.office ? (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                              <span>{teacher.office}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">Not specified</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          {getStatusBadge(teacher.status)}
                          {teacher.status_note && (
                            <div className="text-xs text-gray-500 mt-2 truncate max-w-[100px] sm:max-w-[120px]">
                              {teacher.status_note}
                            </div>
                          )}
                          {/* Mobile-only additional info */}
                          <div className="mt-2 sm:hidden text-xs text-gray-400 space-y-1">
                            {teacher.subject && <div>📚 {teacher.subject}</div>}
                            {teacher.department && <div>🏢 {teacher.department}</div>}
                            {teacher.office && <div>📍 {teacher.office}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300 hidden lg:table-cell">
                        {formatDate(teacher.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-lg rounded-xl border-2 border-dashed border-gray-600/30 text-center">
          <div className="flex items-center justify-center gap-4 text-gray-400 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Showing {filteredTeachers.length} of {teachers.length} teachers</span>
            </div>
            {(searchTerm || filterStatus !== 'all') && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-yellow-400">Filtered results</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
