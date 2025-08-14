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
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <LoadingSpinner text="Loading teacher details..." />;
  }

  if (!teacher) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Teacher Not Found</h2>
        <p className="text-gray-600 mb-6">The teacher you're looking for doesn't exist or has been removed.</p>
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
            onClick={() => navigate('/student')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Teachers</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {teacher.name}
        </h1>
        <p className="text-gray-600">
          Teacher Information and Contact Details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-start space-x-6 mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
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

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <Mail className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{teacher.email}</p>
                  </div>
                </div>

                {teacher.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <Phone className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{teacher.phone}</p>
                    </div>
                  </div>
                )}

                {teacher.office && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <MapPin className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Office Location</p>
                      <p className="font-medium text-gray-900">{teacher.office}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
            
            {teacher.qr_code ? (
              <div className="text-center">
                {qrCode ? (
                  <div className="mb-4">
                    <img 
                      src={qrCode} 
                      alt={`QR Code for ${teacher.name}`}
                      className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code to quickly access {teacher.name}'s contact information
                </p>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (qrCode) {
                        const link = document.createElement('a');
                        link.href = qrCode;
                        link.download = `${teacher.name}-qr-code.png`;
                        link.click();
                      }
                    }}
                    className="w-full btn-outline text-sm"
                    disabled={!qrCode}
                  >
                    Download QR Code
                  </button>
                  
                  <Link
                    to={`/student/teacher/${teacher.id}/qr`}
                    className="w-full btn-primary text-sm flex items-center justify-center space-x-2"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>View Full QR</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  No QR code available for this teacher
                </p>
                <p className="text-sm text-gray-500">
                  QR codes are generated when teachers complete their profile setup
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails; 