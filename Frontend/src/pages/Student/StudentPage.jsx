import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  QrCode,
  MapPin,
  Users,
  BookOpen,
  Eye,
  Home
} from 'lucide-react';
import LoadingBar from '../../components/common/LoadingBar.jsx';
import { useAuth } from "../../contexts/AuthContext";
import { ArrowRight } from "lucide-react";

const StudentPage = () => {
  const { isAuthenticated } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Find Teachers - KnowMyStatus";
  }, []);

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  const fetchTeachers = async () => {
    setHasSearched(true);
    try {
      const response = await axios.get('/api/students/teachers');
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/students/departments');
      setDepartments(response.data.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);

    if (!searchQuery.trim()) {
      await fetchTeachers(); // Reuse fetchTeachers to get all
      return;
    }

    try {
      const response = await axios.get(`/api/students/search/${encodeURIComponent(searchQuery)}`);
      setTeachers(response.data.teachers);
    } catch (error) {
      console.error('Error searching teachers:', error);
      toast.error('Failed to search teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentFilter = async (department) => {
    setSelectedDepartment(department);
    setLoading(true);
    setHasSearched(true);

    try {
      if (department) {
        const response = await axios.get(`/api/students/department/${encodeURIComponent(department)}`);
        setTeachers(response.data.teachers);
      } else {
        setTeachers([]);
        setHasSearched(false);
      }
    } catch (error) {
      console.error('Error filtering by department:', error);
      toast.error('Failed to filter teachers');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    setTeachers([]);
    setHasSearched(false);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = searchQuery === '' ||
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = selectedDepartment === '' || teacher.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-app-background subtle-grid cabinet-grotesk">
      {/* Navbar */}
      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="premium-card w-full max-w-5xl !rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight transition-opacity flex items-center cabinet-grotesk">
            KnowMyStatus<span className="text-[#ff3333] text-4xl leading-none">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-base font-medium text-white cabinet-grotesk">
            <Link to="/" className="text-white transition-colors">
              Home
            </Link>
            <Link to="/student" className="text-[#ff3333] transition-colors">
              Find Teacher
            </Link>
            <Link to="/student/scan" className="text-white transition-colors">
              Scan
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/teacher/dashboard"
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
              >
                Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-[#ff3333] text-white px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 cabinet-grotesk"
              >
                Login
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-8 sm:mb-12 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
            Find <span className="text-[#ff3333]">Teachers</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Search for faculty members, view their status, or scan QR codes for instant access to contact information.
          </p>
        </div>

        <div className="space-y-6">

          {/* Search and Filters Section */}
          <div className="premium-card p-1 bg-gradient-to-br from-white/10 to-transparent border-0">
            <div className="bg-black/90 p-4 sm:p-6 rounded-[1.4rem]">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500 group-focus-within:text-[#ff3333] transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, subject, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#ff3333] focus:border-transparent text-white placeholder-gray-500 text-base transition-all"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute inset-y-0 right-2 px-3 flex items-center bg-[#ff3333] text-white my-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Search
                  </button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 rounded-xl border font-medium transition-all flex items-center justify-center gap-2 ${showFilters
                      ? 'bg-[#ff3333]/10 border-[#ff3333] text-[#ff3333]'
                      : 'bg-white/5 border-white/10 text-gray-300'
                      }`}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </button>

                  {showFilters && (
                    <div className="flex-1 flex flex-col sm:flex-row gap-3 animate-fade-in">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                        </div>
                        <select
                          value={selectedDepartment}
                          onChange={(e) => handleDepartmentFilter(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#ff3333] focus:border-transparent text-white appearance-none cursor-pointer"
                        >
                          <option value="">All Departments</option>
                          {departments.map((dept, index) => (
                            <option key={index} value={dept} className="bg-gray-900 text-white">{dept}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={clearFilters}
                        className="px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl transition-colors whitespace-nowrap"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-white/10 border-t-[#ff3333] animate-spin"></div>
                </div>
                <p className="text-gray-400 animate-pulse">Searching profiles...</p>
              </div>
            ) : filteredTeachers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="relative bg-[#0a0a0a] rounded-2xl p-6 border border-white/10 transition-all duration-300">

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-[#ff3333] transition-colors">
                          {teacher.name}
                        </h3>
                        <p className="text-[#ff3333] font-medium text-sm mb-3 truncate">{teacher.subject}</p>

                        <div className="space-y-1.5">
                          <div className="flex items-center text-sm text-gray-400">
                            <BookOpen className="h-3.5 w-3.5 mr-2 text-gray-500" />
                            <span className="truncate">{teacher.department}</span>
                          </div>
                          {teacher.office && (
                            <div className="flex items-center text-sm text-gray-400">
                              <MapPin className="h-3.5 w-3.5 mr-2 text-gray-500" />
                              <span className="truncate">{teacher.office}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {teacher.qr_code && (
                        <div className="w-12 h-12 bg-white rounded-lg p-1 shrink-0 opacity-80 transition-opacity">
                          <div className="w-full h-full bg-gray-900 rounded flex items-center justify-center">
                            <QrCode className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                      <Link
                        to={`/student/teacher/${teacher.id}`}
                        className="flex-1 bg-white/5 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm border border-white/10"
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </Link>

                      {teacher.qr_code && (
                        <Link
                          to={`/student/teacher/${teacher.id}/qr`}
                          className="bg-[#ff3333]/10 text-[#ff3333] font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm border border-[#ff3333]/20"
                        >
                          <QrCode className="h-4 w-4" />
                          View QR
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 premium-card bg-white/5">
                <Users className="h-16 w-16 text-gray-600 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-white mb-2">
                  No teachers found
                </h3>
                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                  We couldn't find any teachers matching your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-white text-black font-bold rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentPage;