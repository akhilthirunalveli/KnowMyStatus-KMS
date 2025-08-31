import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Home, 
  Lock, 
  Unlock, 
  Download,
  Shield,
  Users,
  LogOut
} from 'lucide-react';

// Import custom components
import SearchFilters from '../../components/admin/SearchFilters';
import TeacherTable from '../../components/admin/TeacherTable';
import { PasswordModal, LockOverlay } from '../../components/admin/SecurityModals';
import StatusBadge from '../../components/common/StatusBadge';

// Import utilities
import { formatDate } from '../../utils/uiUtils';

const AdminDashboard = () => {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    // Clear any session data if needed
    localStorage.removeItem('authToken'); // Remove if using localStorage
    sessionStorage.clear(); // Clear session storage
    toast.success('Logged out successfully');
    navigate('/'); // Navigate to home page
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
    <div className="min-h-screen bg-black cabinet-grotesk">
      {/* Header */}
      <header className="bg-black px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
            {/* Brand */}
            <Link to="/" className="text-white text-xl sm:text-2xl navbar-brand font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
              KnowMyStatus<span className="navbar-red-dot">.</span>
            </Link>
            {/* Welcome Message */}
            <div className="flex-1 sm:flex-initial">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">Manage teachers, monitor status updates, and export data.</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            <Link 
              to="/" 
              className="bg-black hover:bg-gray-700 text-white font-medium py-2 px-3 sm:px-4 rounded-full border-dashed border border-gray-400 transition-colors flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Home</span>
            </Link>
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 sm:px-4 rounded-full border-dashed border border-green-400 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Export CSV</span>
            </button>
            <button
              onClick={isLocked ? handleUnlock : handleLock}
              className={`font-medium py-2 px-3 sm:px-4 rounded-full border-dashed border transition-colors flex items-center gap-2 text-xs sm:text-sm ${
                isLocked 
                  ? 'bg-red-600 hover:bg-red-700 text-white border-red-400' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-400'
              }`}
            >
              {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              <span>{isLocked ? 'Unlock' : 'Lock'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-3 sm:px-4 rounded-full border-dashed border border-red-500 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="w-full space-y-4 sm:space-y-6">
          {/* Lock Overlay */}
          <LockOverlay isLocked={isLocked && !showPasswordModal} handleUnlock={handleUnlock} />

          {/* Password Modal */}
          <PasswordModal 
            showPasswordModal={showPasswordModal}
            password={password}
            currentPasswordIndex={currentPasswordIndex}
            handlePasswordInput={handlePasswordInput}
            closePasswordModal={closePasswordModal}
            checkPassword={checkPassword}
          />

          {/* Search & Filter Section */}
          <SearchFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filteredTeachers={filteredTeachers}
          teachers={teachers}
          exportToCSV={exportToCSV}
        />

        {/* Teacher Table */}
        <TeacherTable 
          teachers={teachers}
          loading={loading}
          filteredTeachers={filteredTeachers}
          formatDate={formatDate}
        />

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
      </main>
    </div>
  );
};

export default AdminDashboard;
