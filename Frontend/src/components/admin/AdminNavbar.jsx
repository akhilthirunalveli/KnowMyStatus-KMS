import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Download, Lock, Unlock } from 'lucide-react';

const AdminNavbar = ({ 
  isLocked, 
  handleLock, 
  handleUnlock, 
  fetchTeachers, 
  exportToCSV 
}) => {
  return (
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
  );
};

export default AdminNavbar;
