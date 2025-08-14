import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import toast from 'react-hot-toast';
import { QrCode, Camera, ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, BookOpen, Building, Clock, StickyNote } from 'lucide-react';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = "QR Scanner - KnowMyStatus";
  }, []);

  const initializeScanner = useCallback(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;
  }, []);

  const onScanSuccess = useCallback(async (decodedText) => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    
    setLoading(true);
    try {
      let qrData;
      try {
        qrData = JSON.parse(decodedText);
        console.log('Scanned QR Data:', qrData); // Debug log
      } catch (error) {
        toast.error('Invalid QR code format');
        return;
      }

      const response = await axios.post('/api/qr/scan', { qrData });
      console.log('Backend Response:', response.data.teacher); // Debug log
      setScannedData(response.data.teacher);
      setShowScanner(false);
      toast.success('QR code scanned successfully!');
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to process QR code');
    } finally {
      setLoading(false);
    }
  }, []);

  const onScanError = useCallback((error) => {
    // Handle scan error silently - this is normal during scanning
    console.log('QR Scanner error:', error);
  }, []);

  useEffect(() => {
    if (showScanner && !scannerRef.current) {
      initializeScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [showScanner, initializeScanner]);

  const resetScanner = () => {
    setScannedData(null);
    setShowScanner(true);
  };

  if (scannedData) {
    return (
      <div className="min-h-screen bg-app-background subtle-grid">
        {/* Navbar */}
        <nav className="bg-app-background px-4 sm:px-6 lg:px-10 py-4 sm:py-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Logo/Brand */}
            <Link to="/" className="text-app-text-primary text-2xl sm:text-3xl lg:text-4xl navbar-brand cursor-pointer hover:opacity-80 transition-opacity">
              KnowMyStatus<span className="navbar-red-dot">.</span>
            </Link>
            
            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center gap-4 navbar-brand text-lg lg:text-xl text-white">
              <Link to="/" className="nav-center-link">
                Home
              </Link>
              <span className="nav-dot">•</span>
              <Link to="/student" className="nav-center-link">
                Find Teacher
              </Link>
              <span className="nav-dot">•</span>
              <Link to="/student/scan" className="nav-center-link">
                Scan
              </Link>
            </div>
            
            {/* Dashboard Button */}
            <Link 
              to="/teacher/dashboard" 
              className="dashboard-pill-btn flex items-center gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg"
            >
              <span className="navbar-brand">Dashboard</span>
              <ArrowRight size={20} className="dotted-arrow sm:w-6 sm:h-6" />
            </Link>
          </div>
        </nav>

        <div className="animate-fade-in px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => navigate('/student')}
              className="bg-transparent hover:bg-red-900 text-red-400 font-bold py-2 px-3 sm:px-4 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk flex items-center space-x-2 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Teachers</span>
            </button>
          </div>
          <div className="max-w-sm sm:max-w-md mx-auto">
          <div className="card text-center">
            <div className="mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500 border-dotted">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 cabinet-grotesk">
                {scannedData.name}
              </h2>
              <p className="text-gray-300 cabinet-grotesk text-sm sm:text-base">{scannedData.subject}</p>
            </div>

            <div className="space-y-3 sm:space-y-4 text-left">
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Subject</p>
                  <p className="font-medium text-white cabinet-grotesk text-sm sm:text-base">{scannedData.subject}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                <Building className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Department</p>
                  <p className="font-medium text-white cabinet-grotesk text-sm sm:text-base">{scannedData.department}</p>
                </div>
              </div>

              {scannedData.office && (
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Office</p>
                    <p className="font-medium text-white cabinet-grotesk text-sm sm:text-base">{scannedData.office}</p>
                  </div>
                </div>
              )}

              {/* Real-time Status */}
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                <Clock className="h-5 w-5 text-red-400" />
                <div className="w-full">
                  <p className="text-sm text-red-400 font-medium mb-1 cabinet-grotesk">Current Status</p>
                  <span className="font-medium capitalize text-white cabinet-grotesk">{scannedData.status ? scannedData.status.replace('_', ' ') : 'Available'}</span>
                  
                  {scannedData.status_note && (
                    <div className="flex items-center gap-1 text-xs text-red-300 mt-1">
                      <StickyNote className="h-4 w-4" />
                      <span className="cabinet-grotesk">Note: {scannedData.status_note}</span>
                    </div>
                  )}
                </div>
              </div>

                          {/* Expected Return Section */}
            {(scannedData.expected_return_date || scannedData.expected_return_time) && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-900/30 rounded-lg border border-blue-500">
                <h3 className="text-sm sm:text-base font-semibold text-blue-300 cabinet-grotesk mb-2 sm:mb-3">Expected Return</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scannedData.expected_return_date && (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Date</p>
                        <p className="font-medium text-white cabinet-grotesk text-sm sm:text-base">{scannedData.expected_return_date}</p>
                      </div>
                    </div>
                  )}
                  {scannedData.expected_return_time && (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Time</p>
                        <p className="font-medium text-white cabinet-grotesk text-sm sm:text-base">{scannedData.expected_return_time}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

              {scannedData.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Phone</p>
                    <a 
                      href={`tel:${scannedData.phone}`}
                      className="font-medium text-red-400 hover:text-red-300 cabinet-grotesk text-sm sm:text-base"
                    >
                      {scannedData.phone}
                    </a>
                  </div>
                </div>
              )}

              {scannedData.email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 cabinet-grotesk">Email</p>
                    <a 
                      href={`mailto:${scannedData.email}`}
                      className="font-medium text-red-400 hover:text-red-300 cabinet-grotesk text-sm sm:text-base"
                    >
                      {scannedData.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

                        <div className="mt-4 sm:mt-6 space-y-3">
              <button
                onClick={resetScanner}
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 cabinet-grotesk font-medium text-sm sm:text-base"
              >
                Scan Another QR Code
              </button>
              
              <button
                onClick={() => navigate('/student')}
                className="w-full bg-transparent hover:bg-red-900 text-red-400 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk text-sm sm:text-base"
              >
                Browse All Teachers
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-background subtle-grid">
      {/* Navbar */}
      <nav className="bg-app-background px-10 py-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="text-app-text-primary text-4xl navbar-brand cursor-pointer hover:opacity-80 transition-opacity">
            KnowMyStatus<span className="navbar-red-dot">.</span>
          </Link>
          
          {/* Center Navigation Links */}
          <div className="flex items-center gap-4 navbar-brand text-xl text-white">
            <Link to="/" className="nav-center-link">
              Home
            </Link>
            <span className="nav-dot">•</span>
            <Link to="/student" className="nav-center-link">
              Find Teacher
            </Link>
            <span className="nav-dot">•</span>
            <Link to="/student/scan" className="nav-center-link">
              Scan
            </Link>
          </div>
          
          {/* Dashboard Button */}
          <Link 
            to="/teacher/dashboard" 
            className="dashboard-pill-btn flex items-center gap-3"
          >
            <span className="navbar-brand text-lg">Dashboard</span>
            <ArrowRight size={24} className="dotted-arrow" />
          </Link>
        </div>
      </nav>

      <div className="animate-fade-in px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <div className="mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500 border-dotted">
              <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 cabinet-grotesk">
              Scan Teacher QR Code
            </h2>
            <p className="text-sm sm:text-base text-gray-300 cabinet-grotesk">
              Point your camera at a teacher's QR code to access their information
            </p>
          </div>

          {!showScanner ? (
            <div className="space-y-4">
              <div className="p-4 sm:p-6 bg-gray-800 rounded-lg border-2 border-red-500 border-dotted">
                <Camera className="h-10 w-10 sm:h-12 sm:w-12 text-red-400 mx-auto mb-4" />
                <p className="text-xs sm:text-sm text-gray-300 cabinet-grotesk">
                  Click the button below to start scanning
                </p>
              </div>
              
              <button
                onClick={() => setShowScanner(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Start Scanner</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <div className="p-4 sm:p-6 bg-gray-800 rounded-lg border-2 border-red-500 border-dotted">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                  <p className="text-xs sm:text-sm text-gray-300 cabinet-grotesk">Processing QR code...</p>
                </div>
              ) : (
                <div id="qr-reader" className="w-full border-2 border-red-500 border-dotted rounded-lg overflow-hidden"></div>
              )}
              
              <button
                onClick={() => {
                  if (scannerRef.current) {
                    scannerRef.current.clear();
                    scannerRef.current = null;
                  }
                  setShowScanner(false);
                }}
                className="w-full bg-transparent hover:bg-red-900 text-red-400 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk text-sm sm:text-base"
              >
                Cancel Scanning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default QRScanner; 