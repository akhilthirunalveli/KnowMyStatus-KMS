import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filteredTeachers,
  teachers,
  exportToCSV
}) => {
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('created_at');
    setSortOrder('desc');
  };

  return (
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
              onClick={clearAllFilters}
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
  );
};

export default SearchFilters;
