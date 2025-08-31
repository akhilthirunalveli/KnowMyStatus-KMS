import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  QrCode, 
  Download,
  Share2,
  User,
  BookOpen,
  Building
} from 'lucide-react';
import LoadingBar from '../../components/common/LoadingBar.jsx';

const TeacherQR = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set page title
  useEffect(() => {
    document.title = "Teacher QR Code - KnowMyStatus";
  }, []);

  useEffect(() => {
    fetchTeacherAndQR();
  }, [id]);

  const fetchTeacherAndQR = async () => {
    try {
      // Fetch teacher details
      const teacherResponse = await axios.get(`/api/students/teacher/${id}`);
      setTeacher(teacherResponse.data.teacher);
      
      // Fetch QR code
      const qrResponse = await axios.get(`/api/students/teacher/${id}/qr`, {
        responseType: 'blob'
      });
      const blob = new Blob([qrResponse.data], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setQrCode(url);
    } catch (error) {
      console.error('Error fetching teacher QR:', error);
      toast.error('Failed to load QR code');
      navigate('/student');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `${teacher?.name || 'teacher'}-qr-code.png`;
      link.click();
      toast.success('QR Code downloaded successfully!');
    }
  };

  const handleShare = async () => {
    if (navigator.share && teacher) {
      try {
        await navigator.share({
          title: `${teacher.name} - Teacher Contact`,
          text: `Contact information for ${teacher.name} (${teacher.subject}, ${teacher.department})`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy link');
      }
    }
  };

  if (loading) {
  return <LoadingBar text="Loading QR code..." />;
  }

  if (!teacher || !qrCode) {
    return (
      <div className="min-h-screen bg-black subtle-grid">
        <nav className="bg-black px-4 sm:px-6 lg:px-10 py-4 sm:py-6 relative z-10">
          <Link to="/" className="text-app-text-primary text-2xl sm:text-3xl lg:text-4xl navbar-brand cursor-pointer hover:opacity-80 transition-opacity">
            KnowMyStatus<span className="navbar-red-dot">.</span>
          </Link>
        </nav>
        <div className="text-center py-12 px-4">
          <QrCode className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4 cabinet-grotesk">QR Code Not Found</h2>
          <p className="text-gray-400 mb-6 cabinet-grotesk">The QR code for this teacher is not available.</p>
          <Link to="/student" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors cabinet-grotesk">
            Back to Teachers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black subtle-grid">
      {/* Navbar */}
      <nav className="bg-black px-4 sm:px-6 lg:px-10 py-4 sm:py-6 relative z-10">
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
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(`/student/teacher/${id}`)}
            className="bg-transparent hover:bg-red-900 text-red-400 font-bold py-2 px-3 sm:px-4 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk flex items-center space-x-2 text-sm sm:text-base mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Details</span>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 cabinet-grotesk">
            QR Code for {teacher.name}
          </h1>
          <p className="text-gray-400 cabinet-grotesk">
            Scan this QR code to access contact information instantly
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Teacher Info Card */}
          <div className="card mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-900 rounded-full flex items-center justify-center border-2 border-red-500 border-dotted">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 cabinet-grotesk">
                  {teacher.name}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="flex items-center justify-center sm:justify-start text-gray-300">
                    <BookOpen className="h-4 w-4 mr-2 text-red-400" />
                    <span className="cabinet-grotesk">{teacher.subject}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start text-gray-300">
                    <Building className="h-4 w-4 mr-2 text-red-400" />
                    <span className="cabinet-grotesk">{teacher.department}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* QR Code Display */}
            <div className="card text-center">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 cabinet-grotesk flex items-center justify-center">
                  <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 mr-3" />
                  QR Code
                </h3>
                
                <div className="p-4 sm:p-6 bg-white rounded-xl mx-auto inline-block border-2 border-red-500 border-dotted mb-4">
                  <img 
                    src={qrCode} 
                    alt={`QR Code for ${teacher.name}`}
                    className="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72"
                  />
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-gray-400 mb-6 cabinet-grotesk">
                Point your phone's camera at this QR code to quickly access {teacher.name}'s contact information.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  className="w-full bg-transparent hover:bg-red-900 text-red-400 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download QR Code</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors cabinet-grotesk flex items-center justify-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share QR Code</span>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="card">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 cabinet-grotesk flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                How to Use
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-red-500 border-dotted">
                    <span className="text-red-400 font-bold text-sm cabinet-grotesk">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 cabinet-grotesk">Open Camera</h4>
                    <p className="text-sm sm:text-base text-gray-400 cabinet-grotesk">Open your phone's camera app or any QR code scanner application</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-red-500 border-dotted">
                    <span className="text-red-400 font-bold text-sm cabinet-grotesk">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 cabinet-grotesk">Point & Scan</h4>
                    <p className="text-sm sm:text-base text-gray-400 cabinet-grotesk">Point your camera directly at this QR code until it's recognized</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-red-500 border-dotted">
                    <span className="text-red-400 font-bold text-sm cabinet-grotesk">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 cabinet-grotesk">Access Info</h4>
                    <p className="text-sm sm:text-base text-gray-400 cabinet-grotesk">Tap the notification to view {teacher.name}'s contact information and status</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500">
                <p className="text-sm text-blue-300 cabinet-grotesk">
                  💡 <strong>Tip:</strong> Save this QR code to your photos for quick access anytime!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherQR; 