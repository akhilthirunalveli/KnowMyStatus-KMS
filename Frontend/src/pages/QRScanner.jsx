import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsQR from 'jsqr';
import { QrCode, Camera, ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, BookOpen, Building, Clock, StickyNote, Calendar, Home, RotateCcw } from 'lucide-react';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [currentCamera, setCurrentCamera] = useState('environment'); // 'environment' or 'user'
  const [availableCameras, setAvailableCameras] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const navigate = useNavigate();

  // Set page title and get available cameras
  useEffect(() => {
    document.title = "QR Scanner - KnowMyStatus";
    
    // Get available cameras on component mount
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
      } catch (error) {
        console.error('Error getting cameras:', error);
      }
    };
    
    getCameras();
  }, []);

  // Real QR Code detection using jsQR library
  const detectQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data for QR detection
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Use jsQR to detect QR codes
    const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    
    if (qrResult) {
      console.log('QR Code detected!', qrResult.data);
      
      try {
        // Try to parse as JSON first
        const qrData = JSON.parse(qrResult.data);
        handleQRScan(qrData);
      } catch (error) {
        // If not JSON, treat as plain text (teacher ID)
        handleQRScan({ teacherId: qrResult.data });
      }
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      // Try to get available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      
      // Prefer back camera on mobile devices
      let preferredDeviceId = null;
      
      if (currentCamera === 'environment') {
        for (const device of videoDevices) {
          if (device.label.toLowerCase().includes('back') || 
              device.label.toLowerCase().includes('rear') ||
              device.label.toLowerCase().includes('environment')) {
            preferredDeviceId = device.deviceId;
            break;
          }
        }
      } else {
        for (const device of videoDevices) {
          if (device.label.toLowerCase().includes('front') || 
              device.label.toLowerCase().includes('user') ||
              device.label.toLowerCase().includes('selfie')) {
            preferredDeviceId = device.deviceId;
            break;
          }
        }
      }
      
      const constraints = {
        video: {
          facingMode: preferredDeviceId ? undefined : { ideal: currentCamera },
          deviceId: preferredDeviceId ? { exact: preferredDeviceId } : undefined,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setScanning(true);
          
          // Start scanning for QR codes with higher frequency
          scanIntervalRef.current = setInterval(() => {
            if (videoRef.current && videoRef.current.videoWidth > 0) {
              detectQRCode();
            }
          }, 100); // Check every 100ms for better responsiveness
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      let errorMessage = 'Failed to access camera. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use.';
      } else {
        errorMessage += 'Please check camera permissions and try again.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [detectQRCode, currentCamera]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setScanning(false);
  }, []);

  // Handle QR code scan results
  const handleQRScan = useCallback(async (qrData) => {
    if (loading) return; // Prevent multiple simultaneous scans
    
    setLoading(true);
    stopCamera();
    
    try {
      console.log('Processing QR Data:', qrData);
      
      // Make API call to backend
      const response = await axios.post('/api/qr/scan', { qrData });
      console.log('Backend Response:', response.data);
      
      if (response.data && response.data.teacher) {
        setScannedData(response.data.teacher);
        setShowScanner(false);
        toast.success('QR code scanned successfully!');
      } else {
        toast.error('Teacher information not found');
        setShowScanner(false);
      }
    } catch (error) {
      console.error('Scan processing error:', error);
      toast.error('Failed to process QR code. Please try again.');
      // Restart camera for another attempt
      setTimeout(() => {
        setShowScanner(true);
      }, 1000);
    } finally {
      setLoading(false);
    }
  }, [loading, stopCamera]);

  useEffect(() => {
    if (showScanner) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [showScanner, startCamera, stopCamera]);

  const resetScanner = () => {
    setScannedData(null);
    setError(null);
    setShowScanner(true);
  };

  const switchCamera = () => {
    stopCamera();
    setCurrentCamera(prev => prev === 'environment' ? 'user' : 'environment');
    setTimeout(() => {
      if (showScanner) {
        startCamera();
      }
    }, 100);
  };

  if (scannedData) {
    return (
      <div className="min-h-screen bg-black cabinet-grotesk">
        {/* Header */}
        <header className="bg-black px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
              {/* Brand */}
              <Link to="/" className="text-white text-xl sm:text-2xl navbar-brand font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
                KnowMyStatus<span className="navbar-red-dot">.</span>
              </Link>
              {/* Welcome Message */}
              <div className="flex-1 sm:flex-initial">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Teacher Information
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">Teacher details and current status from QR scan.</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
              <Link 
                to="/" 
                className="bg-black hover:bg-gray-700 text-white font-medium py-2 px-3 sm:px-4 rounded-full border-dashed border border-gray-400 transition-colors flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Home</span>
              </Link>
              <Link 
                to="/student" 
                className="bg-black hover:bg-blue-700 text-white font-medium py-2 px-3 sm:px-4 rounded-full border-dashed border border-blue-400 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Browse Teachers</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6">
          <div className="w-full space-y-4 sm:space-y-6">
            <div className="max-w-sm sm:max-w-md mx-auto">
              <div className="border-dashed border border-gray-800 rounded-2xl p-4 sm:p-6" style={{backgroundColor: '#0E0E0E'}}>
                <div className="text-center">
            <div className="mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500 border-dotted">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 cabinet-grotesk">
                {scannedData.name}
              </h2>
              <p className="text-gray-300 cabinet-grotesk text-sm sm:text-base">{scannedData.subject}</p>
            </div>

            {/* HIGHLIGHTED CURRENT STATUS SECTION */}
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
                    {scannedData.status ? scannedData.status.replace('_', ' ') : 'Available'}
                  </span>
                </div>
                
                {scannedData.status_note && (
                  <div className="flex items-center justify-center gap-2 text-sm sm:text-base text-red-200">
                    <StickyNote className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="cabinet-grotesk italic">{scannedData.status_note}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expected Return Section */}
            {(scannedData.expected_return_date || scannedData.expected_return_time) && (
              <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-blue-900/40 to-blue-800/20 rounded-lg border border-blue-500 shadow-md">
                <h3 className="text-base sm:text-lg font-semibold text-blue-300 cabinet-grotesk mb-3 text-center flex items-center justify-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Expected Return</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scannedData.expected_return_date && (
                    <div className="flex items-center justify-center space-x-2 bg-black/30 rounded-lg p-2">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      <div className="text-center">
                        <p className="text-xs text-gray-400 cabinet-grotesk">Date</p>
                        <p className="font-medium text-white cabinet-grotesk text-sm sm:text-base">{scannedData.expected_return_date}</p>
                      </div>
                    </div>
                  )}
                  {scannedData.expected_return_time && (
                    <div className="flex items-center justify-center space-x-2 bg-black/30 rounded-lg p-2">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                      <div className="text-center">
                        <p className="text-xs text-gray-400 cabinet-grotesk">Time</p>
                        <p className="font-medium text-white cabinet-grotesk text-sm sm:text-base">{scannedData.expected_return_time}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black cabinet-grotesk">
      {/* Header */}
      <header className="bg-black px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
            {/* Brand */}
            <Link to="/" className="text-white text-xl sm:text-2xl navbar-brand font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
              KnowMyStatus<span className="navbar-red-dot">.</span>
            </Link>
            {/* Welcome Message */}
            <div className="flex-1 sm:flex-initial">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                QR Scanner
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm">Scan teacher QR codes to access their contact information and current status.</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            <Link 
              to="/" 
              className="bg-black hover:bg-gray-700 text-white font-medium py-2 px-3 sm:px-4 rounded-full border-dashed border border-gray-400 transition-colors flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Home</span>
            </Link>
            <Link 
              to="/student" 
              className="bg-black hover:bg-blue-700 text-white font-medium py-2 px-3 sm:px-4 rounded-full border-dashed border border-blue-400 transition-colors flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Browse Teachers</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="w-full space-y-4 sm:space-y-6">
          <div className="max-w-sm sm:max-w-md mx-auto">
            <div className="border-dashed border border-gray-800 rounded-2xl p-4 sm:p-6" style={{backgroundColor: '#0E0E0E'}}>
              <div className="text-center">
                <div className="mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500 border-dotted">
                    <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-red-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 cabinet-grotesk">
                    Scan Teacher QR Code
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 cabinet-grotesk px-4">
                    Point your camera at a teacher's QR code to access their information
                  </p>
                </div>

          {!showScanner ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="p-4 sm:p-6 bg-gray-800 rounded-lg border-2 border-red-500 border-dotted">
                <Camera className="h-10 w-10 sm:h-12 sm:w-12 text-red-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm text-gray-300 cabinet-grotesk px-2">
                  Click the button below to start scanning
                </p>
              </div>
              
              {error && (
                <div className="p-4 bg-red-900/50 rounded-lg border border-red-500">
                  <p className="text-xs sm:text-sm text-red-300 text-center cabinet-grotesk">
                    {error}
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setShowScanner(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg border-2 border-red-500 border-dotted transition-colors cabinet-grotesk flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Start Scanner</span>
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-transparent hover:bg-gray-700 text-gray-300 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg border-2 border-gray-500 border-dotted transition-colors cabinet-grotesk flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Go to Home</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="p-4 sm:p-6 bg-gray-800 rounded-lg border-2 border-red-500 border-dotted">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                  <p className="text-xs sm:text-sm text-gray-300 cabinet-grotesk">Processing QR code...</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    className="w-full h-64 sm:h-80 object-cover border-2 border-red-500 border-dotted rounded-lg bg-black"
                    autoPlay
                    playsInline
                    muted
                  />
                  {/* Hidden canvas for QR processing */}
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanning overlay with animation */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                      {/* Corner brackets */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500"></div>
                      
                      {/* Scanning line animation */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="w-full h-1 bg-red-500 animate-scan"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Camera info indicator */}
                  <div className="absolute top-2 left-2">
                    <div className="bg-black/75 px-2 py-1 rounded border border-red-500 text-xs text-white">
                      📹 {currentCamera === 'environment' ? 'Back Camera' : 'Front Camera'}
                    </div>
                  </div>
                  
                  {/* Scanning status */}
                  {scanning && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/75 px-3 py-2 rounded-full border border-red-500">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-white text-xs font-medium">Scanning for QR codes...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Camera controls */}
                  <div className="absolute top-2 right-2 space-y-1">
                    {/* Camera switch button */}
                    {availableCameras.length > 1 && (
                      <button
                        onClick={switchCamera}
                        className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-medium flex items-center justify-center space-x-1"
                        title="Switch Camera"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Switch</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  stopCamera();
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
      </main>
    </div>
  );
};

export default QRScanner; 