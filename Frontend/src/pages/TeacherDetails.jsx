import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  QrCode, 
  MapPin, 
  Mail, 
  Phone, 
  BookOpen, 
  Building,
  User,
  Calendar,
  Clock,
  StickyNote,
  Download
} from 'lucide-react';
import LoadingBar from '../components/LoadingBar.jsx';

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState(null);

  // Set page title
  useEffect(() => {
    document.title = "Teacher Details - KnowMyStatus";
  }, []);

  useEffect(() => {
    fetchTeacherDetails();
  }, [id]);

  const fetchTeacherDetails = async () => {
    try {
      const response = await axios.get(`/api/students/teacher/${id}`);
      setTeacher(response.data.teacher);
      
      // If QR code exists, fetch it
      if (response.data.teacher.qr_code) {
        fetchQRCode();
      }
    } catch (error) {
      console.error('Error fetching teacher details:', error);
      toast.error('Failed to load teacher details');
      navigate('/student');
    } finally {
      setLoading(false);
    }
  };

  const fetchQRCode = async () => {
    try {
      const response = await axios.get(`/api/students/teacher/${id}/qr`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setQrCode(url);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  if (loading) {
  return <LoadingBar text="Loading teacher details..." />;
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-app-background subtle-grid">
        <nav className="bg-app-background px-4 sm:px-6 lg:px-10 py-4 sm:py-6 relative z-10">
          <Link to="/" className="text-app-text-primary text-2xl sm:text-3xl lg:text-4xl navbar-brand cursor-pointer hover:opacity-80 transition-opacity">
            KnowMyStatus<span className="navbar-red-dot">.</span>
          </Link>
        </nav>
        <div className="text-center py-12 px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 cabinet-grotesk">Teacher Not Found</h2>
          <p className="text-sm sm:text-base text-gray-400 mb-6 cabinet-grotesk">The teacher you're looking for doesn't exist or has been removed.</p>
          <Link to="/student" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors cabinet-grotesk">
            Back to Teachers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-background subtle-grid">
      {/* Navbar */}
      <nav className="bg-app-background px-4 sm:px-6 lg:px-10 py-4 sm:py-6 relative z-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-app-text-primary text-2xl sm:text-3xl lg:text-4xl navbar-brand cursor-pointer hover:opacity-80 transition-opacity">
            KnowMyStatus<span className="navbar-red-dot">.</span>
          </Link>
          
          <div className="flex items-center gap-3 lg:gap-4 navbar-brand text-lg lg:text-xl text-white">
            <Link to="/student" className="nav-center-link">
              Find Teacher
            </Link>
            <span className="nav-dot">•</span>
            <Link to="/student/scan" className="nav-center-link">
              Scan
            </Link>
          </div>
        </div>
      </nav>

      <div className="animate-fade-in px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
        {/* Header with Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/student')}
            className="bg-transparent hover:bg-red-900 text-red-400 font-bold py-2 px-3 sm:px-4 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk flex items-center space-x-2 text-sm sm:text-base mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Teachers</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Main Teacher Information */}
          <div className="lg:col-span-2">
            <div className="card">
              {/* Teacher Profile Header */}
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-red-500 border-dotted">
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 cabinet-grotesk">
                    {teacher.name}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="flex items-center text-gray-300 text-sm sm:text-base">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-400" />
                      <span className="cabinet-grotesk">{teacher.subject}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm sm:text-base">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-400" />
                      <span className="cabinet-grotesk">{teacher.department}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status Section */}
              {(teacher.status || teacher.status_note) && (
                <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-red-900/50 to-red-800/30 rounded-xl border-2 border-red-500 shadow-lg shadow-red-500/20">
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
                      <h3 className="text-lg sm:text-xl font-bold text-red-300 cabinet-grotesk">Current Status</h3>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center px-4 py-2 bg-black/40 rounded-full border border-red-400 mb-3">
                      <span className="text-xl sm:text-2xl font-bold text-white cabinet-grotesk capitalize">
                        {teacher.status ? teacher.status.replace('_', ' ') : 'Available'}
                      </span>
                    </div>
                    
                    {teacher.status_note && (
                      <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-red-200">
                        <StickyNote className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="cabinet-grotesk italic">{teacher.status_note}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 cabinet-grotesk flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Email</p>
                      <a 
                        href={`mailto:${teacher.email}`}
                        className="font-medium text-red-400 hover:text-red-300 text-sm sm:text-base truncate block cabinet-grotesk"
                      >
                        {teacher.email}
                      </a>
                    </div>
                  </div>

                  {teacher.phone && (
                    <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Phone</p>
                        <a 
                          href={`tel:${teacher.phone}`}
                          className="font-medium text-red-400 hover:text-red-300 text-sm sm:text-base cabinet-grotesk"
                        >
                          {teacher.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {teacher.office && (
                    <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Office Location</p>
                        <p className="font-medium text-white text-sm sm:text-base cabinet-grotesk">{teacher.office}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Member Since</p>
                      <p className="font-medium text-white text-sm sm:text-base cabinet-grotesk">
                        {new Date(teacher.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 cabinet-grotesk flex items-center">
                <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 mr-3" />
                QR Code
              </h3>
              
              {teacher.qr_code ? (
                <div className="text-center">
                  {qrCode ? (
                    <div className="mb-4 sm:mb-6">
                      <div className="p-4 bg-white rounded-xl mx-auto inline-block border-2 border-red-500 border-dotted">
                        <img 
                          src={qrCode} 
                          alt={`QR Code for ${teacher.name}`}
                          className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto bg-gray-800 rounded-xl flex items-center justify-center mb-4 sm:mb-6 border-2 border-red-500 border-dotted">
                      <QrCode className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-red-400" />
                    </div>
                  )}
                  
                  <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 px-2 cabinet-grotesk">
                    Scan this QR code to quickly access {teacher.name}'s contact information
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (qrCode) {
                          const link = document.createElement('a');
                          link.href = qrCode;
                          link.download = `${teacher.name}-qr-code.png`;
                          link.click();
                          toast.success('QR Code downloaded successfully!');
                        }
                      }}
                      className="w-full bg-transparent hover:bg-red-900 text-red-400 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk flex items-center justify-center space-x-2 text-xs sm:text-sm"
                      disabled={!qrCode}
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Download QR Code</span>
                    </button>
                    
                    <Link
                      to={`/student/teacher/${teacher.id}/qr`}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors cabinet-grotesk flex items-center justify-center space-x-2 text-xs sm:text-sm"
                    >
                      <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>View Full QR</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-red-500 border-dotted">
                    <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white mb-2 cabinet-grotesk">
                    No QR Code Available
                  </h4>
                  <p className="text-sm sm:text-base text-gray-400 mb-4 px-2 cabinet-grotesk">
                    QR code will be generated when teacher completes profile setup
                  </p>
                  <div className="p-3 bg-yellow-900/30 rounded-lg border border-yellow-500">
                    <p className="text-xs sm:text-sm text-yellow-300 cabinet-grotesk">
                      Contact the teacher directly using the information provided
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails; 