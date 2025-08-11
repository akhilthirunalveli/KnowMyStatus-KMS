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
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const TeacherQR = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <LoadingSpinner text="Loading QR code..." />;
  }

  if (!teacher || !qrCode) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">QR Code Not Found</h2>
        <p className="text-gray-600 mb-6">The QR code for this teacher is not available.</p>
        <Link to="/student" className="btn-primary">
          Back to Teachers
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(`/student/teacher/${id}`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Details</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          QR Code for {teacher.name}
        </h1>
        <p className="text-gray-600">
          Scan this QR code to access contact information
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Teacher Info Card */}
        <div className="card mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {teacher.name}
              </h2>
              <div className="flex items-center text-gray-600 mb-1">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{teacher.subject}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Building className="h-4 w-4 mr-2" />
                <span>{teacher.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="card text-center">
          <div className="mb-6">
            <img 
              src={qrCode} 
              alt={`QR Code for ${teacher.name}`}
              className="w-80 h-80 mx-auto border border-gray-200 rounded-lg shadow-lg"
            />
          </div>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Point your phone's camera at this QR code to quickly access {teacher.name}'s contact information and office details.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="btn-outline flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download QR Code</span>
            </button>
            
            <button
              onClick={handleShare}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-medium text-xs">1</span>
              </div>
              <p>Open your phone's camera app or any QR code scanner</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-medium text-xs">2</span>
              </div>
              <p>Point the camera at this QR code</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-medium text-xs">3</span>
              </div>
              <p>Tap the notification to view {teacher.name}'s contact information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherQR; 