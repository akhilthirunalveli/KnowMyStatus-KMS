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
  Clock,
  StickyNote,
  Download,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import LoadingBar from '../../components/common/LoadingBar.jsx';

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="min-h-screen bg-app-background subtle-grid cabinet-grotesk">
        <div className="pt-32 text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-4">Teacher Not Found</h2>
          <Link to="/student" className="text-[#ff3333]">Back to Teachers</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-background subtle-grid cabinet-grotesk">
      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="premium-card w-full max-w-5xl !rounded-full px-6 py-3 flex items-center justify-between relative">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight transition-opacity flex items-center cabinet-grotesk">
            KnowMyStatus<span className="text-[#ff3333] text-4xl leading-none">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-base font-medium text-white cabinet-grotesk">
            <Link to="/student" className="text-[#ff3333] transition-colors">
              Find Teacher
            </Link>
            <Link to="/student/scan" className="text-white transition-colors">
              Scan
            </Link>
          </div>

          {/* Add Dashboard/Login button container for desktop */}
          <div className="flex items-center gap-4">
            {/* This page didn't have the auth button before in the original file view, 
                   but to keep consistency with other pages and the plan, I should add it or just the menu button.
                   The original code only had the Logo and Links. 
                   Checking previous file content... It had Logo and Links.
                   I will add the mobile menu button.
               */}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-1"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-4 mx-4 p-4 premium-card bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-4 md:hidden animate-fade-in z-50">
              <Link
                to="/"
                className="text-white text-lg font-medium p-2 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/student"
                className="text-[#ff3333] text-lg font-medium p-2 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Teacher
              </Link>
              <Link
                to="/student/scan"
                className="text-white text-lg font-medium p-2 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Scan
              </Link>
              {/* 
                  Since I don't see useAuth imported in the original TeacherDetails.jsx, 
                  I should check if I need to import it to show Login/Dashboard.
                  The original file imports: properties:{id: useParams(), navigate: useNavigate(), etc..}
                  It does NOT import useAuth.
                  
                  Wait, looking at my view_file output for TeacherDetails.jsx:
                  It does NOT import useAuth.
                  
                  If I want to add "Login/Dashboard" link in mobile menu, I need to know if authenticated.
                  I should probably import useAuth first.
               */}
            </div>
          )}
        </div>
      </nav>

      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/student')}
            className="flex items-center text-gray-400 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Teachers</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="premium-card p-6 sm:p-8 bg-[#0a0a0a] border border-white/10 rounded-[1.4rem]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
                <div className="w-24 h-24 bg-gradient-to-br from-[#ff3333]/20 to-transparent rounded-full flex items-center justify-center border border-[#ff3333]/30">
                  <User className="h-10 w-10 text-[#ff3333]" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {teacher.name}
                  </h1>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-gray-400">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-[#ff3333]" />
                      <span>{teacher.subject}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-[#ff3333]" />
                      <span>{teacher.department}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              {(teacher.status || teacher.status_note) && (
                <div className="mb-8 p-6 bg-gradient-to-r from-red-900/10 to-transparent rounded-2xl border border-red-500/20">
                  <div className="flex flex-col items-center sm:items-start">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Current Status</span>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${teacher.status === 'available' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                      <span className="text-2xl font-bold text-white capitalize">
                        {teacher.status ? teacher.status.replace('_', ' ') : 'Available'}
                      </span>
                    </div>
                    {teacher.status_note && (
                      <p className="text-gray-400 italic">"{teacher.status_note}"</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 mb-1">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-xs font-bold text-gray-500 uppercase">Email</span>
                    </div>
                    <p className="text-white font-medium break-all">{teacher.email}</p>
                  </div>
                  {teacher.phone && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3 mb-1">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-xs font-bold text-gray-500 uppercase">Phone</span>
                      </div>
                      <p className="text-white font-medium">{teacher.phone}</p>
                    </div>
                  )}
                  {teacher.office && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3 mb-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-xs font-bold text-gray-500 uppercase">Office</span>
                      </div>
                      <p className="text-white font-medium">{teacher.office}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - QR */}
          <div className="lg:col-span-1">
            <div className="premium-card p-6 bg-[#0a0a0a] border border-white/10 rounded-[1.4rem] sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Digital Pass</h3>
                <QrCode className="h-5 w-5 text-[#ff3333]" />
              </div>

              {teacher.qr_code && qrCode ? (
                <div className="text-center">
                  <div className="p-4 bg-white rounded-2xl inline-block mb-6 shadow-lg shadow-black/50">
                    <img src={qrCode} alt="Teacher QR" className="w-40 h-40 object-contain" />
                  </div>
                  <p className="text-sm text-gray-400 mb-6">Scan to save {teacher.name}'s contact info.</p>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = qrCode;
                        link.download = `${teacher.name}-qr.png`;
                        link.click();
                      }}
                      className="w-full py-3 bg-[#ff3333] text-white font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    <Link
                      to={`/student/teacher/${id}/qr`}
                      className="w-full py-3 bg-white/5 text-white font-medium rounded-xl border border-white/10 flex items-center justify-center gap-2"
                    >
                      <QrCode className="h-4 w-4" />
                      View Full Screen
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-500 text-sm">QR Code not available</p>
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