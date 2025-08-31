import React from 'react';
import { Users, Mail, Phone, Building, BookOpen, MapPin, User } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const TeacherTable = ({ 
  teachers, 
  loading, 
  filteredTeachers, 
  formatDate 
}) => {
  const clearAllFilters = () => {
    // This would need to be passed as a prop or handled by parent
    console.log('Clear filters called');
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg rounded-2xl border-2 border-dashed border-gray-600/50 overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="w-full flex justify-center items-center">
            <div className="w-48"><div className="kms-loading-bar h-2"></div></div>
            <span className="ml-3 text-red-500 text-sm font-medium tracking-wide">Loading teachers...</span>
          </div>
        </div>
      </div>
    );
  }

  if (filteredTeachers.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-lg rounded-2xl border-2 border-dashed border-gray-600/50 overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-600/50 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-400 mb-2 cabinet-grotesk">No teachers found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-red-600/20 border border-dashed border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black backdrop-blur-lg rounded-2xl border-2 border-dashed border-gray-600/50 overflow-hidden">
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
                    <StatusBadge status={teacher.status} />
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
    </div>
  );
};

export default TeacherTable;
