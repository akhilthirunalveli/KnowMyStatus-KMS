import React from 'react';
import { Search, Filter, X } from 'lucide-react';

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
    <div className="premium-card p-1 bg-gradient-to-br from-white/10 to-transparent border-0 mb-6">
      <div className="bg-black/90 p-5 sm:p-6 rounded-[1.4rem]">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <Filter className="h-5 w-5 text-[#ff3333]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white cabinet-grotesk">Search & Filter</h3>
              <p className="text-sm text-gray-400">Find and organize staff data</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              {filteredTeachers.length} / {teachers.length} Active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, email, subject, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#ff3333] text-white placeholder-gray-500 text-sm transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sort Dropdown (Simplified for UI) */}
          <div className="md:col-span-4 lg:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full py-3.5 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#ff3333] transition-colors appearance-none cursor-pointer"
            >
              <option value="all" className="bg-black text-white">All Statuses</option>
              <option value="available" className="bg-black text-white">Available</option>
              <option value="not_available" className="bg-black text-white">Not Available</option>
              <option value="on_leave" className="bg-black text-white">On Leave</option>
              <option value="lunch" className="bg-black text-white">Lunch</option>
              <option value="in_meeting" className="bg-black text-white">In Meeting</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || filterStatus !== 'all' || sortBy !== 'created_at' || sortOrder !== 'desc') && (
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Active filters:</span>
            {searchTerm && (
              <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium border border-blue-500/20 flex items-center gap-2">
                "{searchTerm}"
                <button onClick={() => setSearchTerm('')}><X className="h-3 w-3" /></button>
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-xs font-medium border border-green-500/20 flex items-center gap-2">
                Status: {filterStatus.replace('_', ' ')}
                <button onClick={() => setFilterStatus('all')}><X className="h-3 w-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-400 hover:text-white underline ml-auto transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
