import React from 'react';
import { Users, Mail, Phone, Building, BookOpen, MapPin, User, Clock } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const TeacherTable = ({
  teachers,
  loading,
  filteredTeachers,
  formatDate
}) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-white/10 border-t-[#ff3333] animate-spin"></div>
        </div>
        <p className="text-gray-400 font-medium animate-pulse">Loading teachers...</p>
      </div>
    );
  }

  if (filteredTeachers.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
          <Users className="h-10 w-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 cabinet-grotesk">No teachers found</h3>
        <p className="text-gray-400 max-w-sm mx-auto">
          We couldn't find any teachers matching your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[30%] pl-8">Teacher Profile</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[20%]">Contact Info</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[20%]">Department</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%]">Status</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%]">Join Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTeachers.map((teacher, index) => (
              <tr key={teacher.id || index} className="group transition-colors">
                <td className="px-6 py-5 pl-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 mr-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#ff3333]/20 to-transparent border border-[#ff3333]/30 flex items-center justify-center">
                        <User className="h-6 w-6 text-[#ff3333]" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white cabinet-grotesk mb-0.5">{teacher.name}</div>
                      <div className="text-xs text-gray-500 font-medium bg-white/5 px-2 py-0.5 rounded inline-block border border-white/5">
                        {teacher.subject || 'No Subject'}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Mail className="h-3.5 w-3.5 text-gray-500" />
                      <span className="truncate max-w-[180px]">{teacher.email}</span>
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone className="h-3.5 w-3.5 text-gray-500" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Building className="h-3.5 w-3.5 text-gray-500" />
                      <span className="truncate max-w-[180px]">{teacher.department || 'N/A'}</span>
                    </div>
                    {teacher.office && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        <span>{teacher.office}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex flex-col items-start gap-2">
                    <StatusBadge status={teacher.status} />
                    {teacher.status_note && (
                      <span className="text-xs text-gray-500 italic truncate max-w-[150px]">
                        "{teacher.status_note}"
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4 text-gray-600" />
                    {formatDate(teacher.created_at)}
                  </div>
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
