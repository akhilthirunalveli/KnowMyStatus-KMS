import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsQR from 'jsqr';
import { QrCode, Camera, ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, BookOpen, Building, Clock, StickyNote, Calendar, Home, RotateCcw } from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext";

const QRScanner = () => {
  const { isAuthenticated } = useAuth();
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
      <div className="min-h-screen bg-app-background subtle-grid cabinet-grotesk">
        {/* Navbar */}
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
          <div className="premium-card w-full max-w-5xl !rounded-full px-6 py-3 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight transition-opacity flex items-center cabinet-grotesk">
              KnowMyStatus<span className="text-[#ff3333] text-4xl leading-none">.</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-base font-medium text-white cabinet-grotesk">
              <Link to="/" className="text-white transition-colors">
                Home
              </Link>
              <Link to="/student" className="text-white transition-colors">
                Find Teacher
              </Link>
              <Link to="/student/scan" className="text-[#ff3333] transition-colors">
                Scan
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/teacher/dashboard"
                  className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
                >
                  Dashboard
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-[#ff3333] text-white px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 cabinet-grotesk"
                >
                  Login
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md">
            <div className="premium-card p-1 bg-gradient-to-br from-white/10 to-transparent border-0">
              <div className="bg-black/90 p-4 sm:p-8 rounded-[1.4rem]">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-[#ff3333]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ff3333]/30">
                      <User className="h-10 w-10 text-[#ff3333]" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 cabinet-grotesk tracking-tight">
                      {scannedData.name}
                    </h2>
                    <p className="text-gray-400 cabinet-grotesk text-lg">{scannedData.subject}</p>
                  </div>

                  {/* HIGHLIGHTED CURRENT STATUS SECTION */}
                  <div className="mb-8 p-6 bg-gradient-to-br from-[#ff3333]/20 to-black/50 rounded-2xl border border-[#ff3333]/30 backdrop-blur-sm">
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-[#ff3333]" />
                        <h3 className="text-lg font-bold text-white cabinet-grotesk">Current Status</h3>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="inline-flex items-center justify-center px-6 py-2 bg-black/60 rounded-full border border-[#ff3333]/30 mb-3 backdrop-blur-md">
                        <span className="text-2xl font-bold text-white cabinet-grotesk capitalize">
                          {scannedData.status ? scannedData.status.replace('_', ' ') : 'Available'}
                        </span>
                      </div>

                      {scannedData.status_note && (
                        <div className="flex items-center justify-center gap-2 text-base text-gray-300 mt-2">
                          <StickyNote className="h-4 w-4 opacity-70" />
                          <span className="cabinet-grotesk italic">"{scannedData.status_note}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expected Return Section */}
                  {(scannedData.expected_return_date || scannedData.expected_return_time) && (
                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Expected Return
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {scannedData.expected_return_date && (
                          <div className="bg-black/40 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Date</p>
                            <p className="font-medium text-white">{scannedData.expected_return_date}</p>
                          </div>
                        )}
                        {scannedData.expected_return_time && (
                          <div className="bg-black/40 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Time</p>
                            <p className="font-medium text-white">{scannedData.expected_return_time}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/5 transition-colors">
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Subject</p>
                        <p className="font-medium text-white">{scannedData.subject}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/5 transition-colors">
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Department</p>
                        <p className="font-medium text-white">{scannedData.department}</p>
                      </div>
                    </div>

                    {scannedData.office && (
                      <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/5 transition-colors">
                        <div className="p-2 bg-gray-900 rounded-lg">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Office</p>
                          <p className="font-medium text-white">{scannedData.office}</p>
                        </div>
                      </div>
                    )}

                    {scannedData.phone && (
                      <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/5 transition-colors">
                        <div className="p-2 bg-gray-900 rounded-lg">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Phone</p>
                          <a href={`tel:${scannedData.phone}`} className="font-medium text-white transition-colors truncate block">
                            {scannedData.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {scannedData.email && (
                      <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/5 transition-colors">
                        <div className="p-2 bg-gray-900 rounded-lg">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Email</p>
                          <a href={`mailto:${scannedData.email}`} className="font-medium text-white transition-colors truncate block">
                            {scannedData.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 space-y-3">
                    <button
                      onClick={resetScanner}
                      className="w-full px-6 py-3.5 bg-[#ff3333] text-white rounded-xl transition-all font-bold text-base shadow-lg shadow-red-500/20"
                    >
                      Scan Another Code
                    </button>

                    <button
                      onClick={() => navigate('/student')}
                      className="w-full px-6 py-3.5 bg-white/5 text-gray-300 rounded-xl transition-all font-medium border border-white/10"
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
    <div className="min-h-screen bg-app-background subtle-grid cabinet-grotesk">
      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="premium-card w-full max-w-5xl !rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight transition-opacity flex items-center cabinet-grotesk">
            KnowMyStatus<span className="text-[#ff3333] text-4xl leading-none">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-base font-medium text-white cabinet-grotesk">
            <Link to="/" className="text-white transition-colors">
              Home
            </Link>
            <Link to="/student" className="text-white transition-colors">
              Find Teacher
            </Link>
            <Link to="/student/scan" className="text-[#ff3333] transition-colors">
              Scan
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/teacher/dashboard"
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
              >
                Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-[#ff3333] text-white px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 cabinet-grotesk"
              >
                Login
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md space-y-8">

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Scan <span className="text-[#ff3333]">QR Code</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Point your camera at a teacher's QR code to instantly access their status.
            </p>
          </div>

          <div className="premium-card p-1 bg-gradient-to-br from-white/10 to-transparent border-0">
            <div className="bg-black/90 p-4 sm:p-6 rounded-[1.4rem]">
              {!showScanner ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-[#ff3333]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#ff3333]/20">
                    <QrCode className="h-10 w-10 text-[#ff3333]" />
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                      <p className="text-sm text-red-400 cabinet-grotesk">
                        {error}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setShowScanner(true)}
                    className="w-full px-6 py-4 bg-[#ff3333] text-white rounded-xl transition-all font-bold text-lg shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Start Scanner</span>
                  </button>

                  <p className="mt-4 text-sm text-gray-500">
                    Requires camera permission
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 border-4 border-[#ff3333]/30 border-t-[#ff3333] rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400">Processing QR code...</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4] border border-white/10">
                      {/* Video Element */}
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                      {/* Hidden canvas for QR processing */}
                      <canvas ref={canvasRef} className="hidden" />

                      {/* Scanning overlay with animation */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-64 h-64 border border-[#ff3333]/30 rounded-lg">
                          {/* Corner brackets */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff3333]"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#ff3333]"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#ff3333]"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff3333]"></div>

                          {/* Scanning line animation */}
                          <div className="absolute inset-0 overflow-hidden opacity-50">
                            <div className="w-full h-[2px] bg-[#ff3333] shadow-[0_0_20px_rgba(255,51,51,0.5)] animate-scan top-1/2"></div>
                          </div>
                        </div>
                      </div>

                      {/* Camera controls */}
                      <div className="absolute top-4 right-4 z-10">
                        {availableCameras.length > 1 && (
                          <button
                            onClick={switchCamera}
                            className="bg-black/50 backdrop-blur-md text-white p-2.5 rounded-full transition-colors"
                            title="Switch Camera"
                          >
                            <RotateCcw className="h-5 w-5" />
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
                    className="w-full px-4 py-3 bg-white/5 text-gray-300 rounded-xl transition-all font-medium border border-white/10"
                  >
                    Cancel Scanning
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QRScanner;