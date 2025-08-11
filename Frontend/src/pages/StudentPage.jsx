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
import LoadingSpinner from '../components/LoadingSpinner.jsx';  

const StudentPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
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
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setLoading(true);
    setHasSearched(true);
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
    <div className="min-h-screen bg-black cabinet-grotesk">
      {/* Header */}
      <header className="bg-black px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Brand */}
            <div className="text-white text-2xl navbar-brand font-bold tracking-tight">
              KnowMyStatus<span className="navbar-red-dot">.</span>
            </div>
            {/* Welcome Message */}
            <div>
              <h1 className="text-2xl font-bold text-white">
                Find Teachers
              </h1>
              <p className="text-gray-400 text-sm">Browse and search for teachers. Scan their QR codes to access contact information.</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="bg-black hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-full border-dashed border border-gray-400 transition-colors flex items-center gap-2"
            >
              <Home className="h-6 w-4" />
            </Link>
            <Link 
              to="/student/scan" 
              className="bg-black hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full border-dashed border border-red-400 transition-colors flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              <span>Scan QR Code</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="w-full space-y-6">

          {/* Search and Filters */}
          <div className="border-dashed border border-gray-800 rounded-2xl p-6" style={{backgroundColor: '#0E0E0E'}}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search teachers by name, subject, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 border-dashed border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    style={{backgroundColor: '#0E0E0E'}}
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="border-dashed border border-gray-600 hover:bg-gray-900 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-dashed border-gray-700">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Department
                    </label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => handleDepartmentFilter(e.target.value)}
                      className="w-full px-3 py-2 border-dashed border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      style={{backgroundColor: '#0E0E0E'}}
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={clearFilters}
                    className="hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors border-dashed border border-gray-600"
                    style={{backgroundColor: '#0E0E0E'}}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="border-dashed border border-gray-800 rounded-2xl p-6" style={{backgroundColor: '#0E0E0E'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Teachers ({filteredTeachers.length})
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Searching teachers..." />
              </div>
            ) : !hasSearched ? (
              <div className="text-center py-16">
                <div className="mb-6">
                  <Search className="h-20 w-20 text-gray-500 mx-auto mb-4" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  Search for Teachers
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Enter a teacher's name, subject, or department to find their contact information and QR code.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => document.querySelector('input[type="text"]').focus()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="h-5 w-5" />
                    Start Searching
                  </button>
                  <Link 
                    to="/student/scan" 
                    className="border-dashed border border-gray-600 hover:bg-gray-900 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    style={{backgroundColor: '#0E0E0E'}}
                  >
                    <QrCode className="h-5 w-5" />
                    Scan QR Code
                  </Link>
                </div>
              </div>
            ) : filteredTeachers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="border-dashed border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-all duration-200" style={{backgroundColor: '#0E0E0E'}}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {teacher.name}
                        </h3>
                        <p className="text-sm text-blue-400 mb-2 font-medium">{teacher.subject}</p>
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {teacher.department}
                        </div>
                        {teacher.office && (
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            {teacher.office}
                          </div>
                        )}
                      </div>
                      
                      {teacher.qr_code && (
                        <div className="ml-4">
                          <div className="w-16 h-16 border-dashed border border-gray-600 rounded-lg flex items-center justify-center" style={{backgroundColor: '#0E0E0E'}}>
                            <QrCode className="h-6 w-6 text-blue-400" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/student/teacher/${teacher.id}`}
                        className="flex-1 border-dashed border border-gray-600 hover:bg-gray-900 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                      
                      {teacher.qr_code && (
                        <Link
                          to={`/student/teacher/${teacher.id}/qr`}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <QrCode className="h-4 w-4" />
                          <span>QR</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No teachers found
                </h3>
                <p className="text-gray-400 mb-4">
                  {searchQuery || selectedDepartment 
                    ? 'Try adjusting your search or filters.' 
                    : 'No teachers are currently available.'
                  }
                </p>
                {(searchQuery || selectedDepartment) && (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentPage; 