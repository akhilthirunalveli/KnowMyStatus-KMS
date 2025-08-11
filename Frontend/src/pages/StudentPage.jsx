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
  Eye
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';  

const StudentPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  const fetchTeachers = async () => {
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
      fetchTeachers();
      return;
    }

    setLoading(true);
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
    
    try {
      if (department) {
        const response = await axios.get(`/api/students/department/${encodeURIComponent(department)}`);
        setTeachers(response.data.teachers);
      } else {
        fetchTeachers();
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
    fetchTeachers();
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
    <div className="animate-fade-in bg-app-background min-h-screen text-app-text-primary px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-text-primary mb-2">
          Find Teachers
        </h1>
        <p className="text-app-text-secondary">
          Browse and search for teachers. Scan their QR codes to access contact information.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-app-text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search teachers by name, subject, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-10 pr-4 bg-app-surface text-app-text-light border-app-border placeholder-app-placeholder"
              />
              <button
                onClick={handleSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-app-text-muted hover:text-app-accent"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center space-x-2 px-4 text-app-text-primary border-app-border hover:bg-app-surface"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-app-border">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-app-text-secondary mb-2">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => handleDepartmentFilter(e.target.value)}
                  className="input-field bg-app-surface text-app-text-light border-app-border"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={clearFilters}
                className="btn-secondary text-app-text-primary border-app-border hover:bg-app-surface"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Teachers ({filteredTeachers.length})
          </h2>
          <Link 
            to="/student/scan" 
            className="btn-primary flex items-center space-x-2 bg-white text-black hover:bg-gray-200"
          >
            <QrCode className="h-5 w-5" />
            <span>Scan QR Code</span>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading teachers..." />
        ) : filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="card-hover bg-gray-900/70 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-gray-300 mb-2">{teacher.subject}</p>
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
                      <div className="w-16 h-16 bg-black/60 border border-gray-700 rounded-lg flex items-center justify-center">
                        <QrCode className="h-6 w-6 text-primary-400" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/student/teacher/${teacher.id}`}
                    className="btn-outline flex-1 flex items-center justify-center space-x-2 text-sm text-white border-gray-700 hover:bg-gray-800"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </Link>
                  
                  {teacher.qr_code && (
                    <Link
                      to={`/student/teacher/${teacher.id}/qr`}
                      className="btn-primary flex items-center justify-center space-x-2 text-sm px-4 bg-white text-black hover:bg-gray-200"
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
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No teachers found
            </h3>
            <p className="text-gray-300 mb-4">
              {searchQuery || selectedDepartment 
                ? 'Try adjusting your search or filters.' 
                : 'No teachers are currently available.'
              }
            </p>
            {(searchQuery || selectedDepartment) && (
              <button
                onClick={clearFilters}
                className="btn-primary bg-white text-black hover:bg-gray-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center bg-gray-900/70 border border-gray-700">
          <div className="flex justify-center mb-2">
            <Users className="h-8 w-8 text-primary-400" />
          </div>
          <div className="text-2xl font-bold text-white">{teachers.length}</div>
          <div className="text-gray-300">Total Teachers</div>
        </div>
        <div className="card text-center bg-gray-900/70 border border-gray-700">
          <div className="flex justify-center mb-2">
            <BookOpen className="h-8 w-8 text-primary-400" />
          </div>
          <div className="text-2xl font-bold text-white">{departments.length}</div>
          <div className="text-gray-300">Departments</div>
        </div>
        <div className="card text-center bg-gray-900/70 border border-gray-700">
          <div className="flex justify-center mb-2">
            <QrCode className="h-8 w-8 text-primary-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {teachers.filter(t => t.qr_code).length}
          </div>
          <div className="text-gray-300">QR Codes Available</div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage; 