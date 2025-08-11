import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import toast from 'react-hot-toast';
import { QrCode, Camera, ArrowLeft, User, Mail, Phone, MapPin, BookOpen, Building, Clock, StickyNote } from 'lucide-react';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

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
      <div className="animate-fade-in">
        <div className="mb-6">
          <button
            onClick={() => navigate('/student')}
            className="btn-outline flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Teachers</span>
          </button>
        </div>

        <div className="max-w-md mx-auto">
          <div className="card text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-app-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-app-accent" />
              </div>
              <h2 className="text-2xl font-bold text-app-text-primary mb-2">
                {scannedData.name}
              </h2>
              <p className="text-app-text-secondary">{scannedData.subject}</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3 p-3 bg-app-surface rounded-lg">
                <BookOpen className="h-5 w-5 text-app-text-muted" />
                <div>
                  <p className="text-sm text-app-text-muted">Subject</p>
                  <p className="font-medium">{scannedData.subject}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-app-surface rounded-lg">
                <Building className="h-5 w-5 text-app-text-muted" />
                <div>
                  <p className="text-sm text-app-text-muted">Department</p>
                  <p className="font-medium">{scannedData.department}</p>
                </div>
              </div>

              {scannedData.office && (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Office</p>
                    <p className="font-medium">{scannedData.office}</p>
                  </div>
                </div>
              )}

              {/* Real-time Status */}
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-1">Current Status</p>
                  <span className="font-medium capitalize">{scannedData.status ? scannedData.status.replace('_', ' ') : 'Available'}</span>
                  {scannedData.status_note && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                      <StickyNote className="h-4 w-4" />
                      <span>Note: {scannedData.status_note}</span>
                    </div>
                  )}
                  {scannedData.status_until && (
                    <div className="text-xs text-blue-600 mt-1">
                      Until: {new Date(scannedData.status_until).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {scannedData.phone && (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a 
                      href={`tel:${scannedData.phone}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {scannedData.phone}
                    </a>
                  </div>
                </div>
              )}

              {scannedData.email && (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a 
                      href={`mailto:${scannedData.email}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
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
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <QrCode className="h-5 w-5" />
                <span>Scan Another QR Code</span>
              </button>
              
              <button
                onClick={() => navigate('/student')}
                className="btn-outline w-full"
              >
                Browse All Teachers
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button
          onClick={() => navigate('/student')}
          className="btn-outline flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Teachers</span>
        </button>
      </div>

      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-10 w-10 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Scan Teacher QR Code
            </h2>
            <p className="text-gray-600">
              Point your camera at a teacher's QR code to access their information
            </p>
          </div>

          {!showScanner ? (
            <div className="space-y-4">
              <div className="p-6 bg-white rounded-lg">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  Click the button below to start scanning
                </p>
              </div>
              
              <button
                onClick={() => setShowScanner(true)}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Camera className="h-5 w-5" />
                <span>Start Scanner</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <div className="p-6 bg-white rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Processing QR code...</p>
                </div>
              ) : (
                <div id="qr-reader" className="w-full"></div>
              )}
              
              <button
                onClick={() => {
                  if (scannerRef.current) {
                    scannerRef.current.clear();
                    scannerRef.current = null;
                  }
                  setShowScanner(false);
                }}
                className="btn-secondary w-full"
              >
                Cancel Scanning
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">How to use:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ask the teacher for their QR code</li>
              <li>• Point your camera at the QR code</li>
              <li>• Wait for the scan to complete</li>
              <li>• View the teacher's contact information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner; 