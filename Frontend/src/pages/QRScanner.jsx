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
      } catch (error) {
        toast.error('Invalid QR code format');
        return;
      }

      const response = await axios.post('/api/qr/scan', { qrData });
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

        <div className="animate-fade-in px-10 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/student')}
          className="bg-transparent hover:bg-red-900 text-red-400 font-bold py-2 px-4 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Teachers</span>
        </button>
      </div>        <div className="max-w-md mx-auto">
          <div className="card text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500 border-dotted">
                <User className="h-10 w-10 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 cabinet-grotesk">
                {scannedData.name}
              </h2>
              <p className="text-gray-300 cabinet-grotesk">{scannedData.subject}</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                <BookOpen className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400 cabinet-grotesk">Subject</p>
                  <p className="font-medium text-white cabinet-grotesk">{scannedData.subject}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                <Building className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400 cabinet-grotesk">Department</p>
                  <p className="font-medium text-white cabinet-grotesk">{scannedData.department}</p>
                </div>
              </div>

              {scannedData.office && (
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                  <MapPin className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-sm text-gray-400 cabinet-grotesk">Office</p>
                    <p className="font-medium text-white cabinet-grotesk">{scannedData.office}</p>
                  </div>
                </div>
              )}

              {/* Real-time Status */}
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                <Clock className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-sm text-red-400 font-medium mb-1 cabinet-grotesk">Current Status</p>
                  <span className="font-medium capitalize text-white cabinet-grotesk">{scannedData.status ? scannedData.status.replace('_', ' ') : 'Available'}</span>
                  {scannedData.status_note && (
                    <div className="flex items-center gap-1 text-xs text-red-300 mt-1">
                      <StickyNote className="h-4 w-4" />
                      <span className="cabinet-grotesk">Note: {scannedData.status_note}</span>
                    </div>
                  )}
                  {scannedData.status_until && (
                    <div className="text-xs text-red-300 mt-1 cabinet-grotesk">
                      Until: {new Date(scannedData.status_until).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {scannedData.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                  <Phone className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-sm text-gray-400 cabinet-grotesk">Phone</p>
                    <a 
                      href={`tel:${scannedData.phone}`}
                      className="font-medium text-red-400 hover:text-red-300 cabinet-grotesk"
                    >
                      {scannedData.phone}
                    </a>
                  </div>
                </div>
              )}

              {scannedData.email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg border border-red-500 border-dotted">
                  <Mail className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-sm text-gray-400 cabinet-grotesk">Email</p>
                    <a 
                      href={`mailto:${scannedData.email}`}
                      className="font-medium text-red-400 hover:text-red-300 cabinet-grotesk"
                    >
                      {scannedData.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={resetScanner}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk flex items-center justify-center space-x-2"
              >
                <QrCode className="h-5 w-5" />
                <span>Scan Another QR Code</span>
              </button>
              
              <button
                onClick={() => navigate('/student')}
                className="w-full bg-transparent hover:bg-red-900 text-red-400 font-bold py-3 px-6 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk"
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

      <div className="animate-fade-in px-10 py-6">
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500 border-dotted">
              <QrCode className="h-10 w-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 cabinet-grotesk">
              Scan Teacher QR Code
            </h2>
            <p className="text-gray-300 cabinet-grotesk">
              Point your camera at a teacher's QR code to access their information
            </p>
          </div>

          {!showScanner ? (
            <div className="space-y-4">
              <div className="p-6 bg-gray-800 rounded-lg border-2 border-red-500 border-dotted">
                <Camera className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-sm text-gray-300 cabinet-grotesk">
                  Click the button below to start scanning
                </p>
              </div>
              
              <button
                onClick={() => setShowScanner(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk flex items-center justify-center space-x-2"
              >
                <Camera className="h-5 w-5" />
                <span>Start Scanner</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <div className="p-6 bg-gray-800 rounded-lg border-2 border-red-500 border-dotted">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-300 cabinet-grotesk">Processing QR code...</p>
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
                className="w-full bg-transparent hover:bg-red-900 text-red-400 font-bold py-3 px-6 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk"
              >
                Cancel Scanning
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-red-500 border-dotted">
            <h3 className="text-sm font-medium text-white mb-2 cabinet-grotesk">How to use:</h3>
            <ul className="text-sm text-gray-300 space-y-1 cabinet-grotesk">
              <li>• Ask the teacher for their QR code</li>
              <li>• Point your camera at the QR code</li>
              <li>• Wait for the scan to complete</li>
              <li>• View the teacher's contact information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default QRScanner; 