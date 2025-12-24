import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ScannerHeader from '../components/scanner/ScannerHeader';
import ScannerView from '../components/scanner/ScannerView';
import ResultCard from '../components/scanner/ResultCard';
import ErrorView from '../components/scanner/ErrorView';
import ScannerLanding from '../components/scanner/ScannerLanding';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "QR Scanner - KnowMyStatus";
  }, []);

  const handleScanSuccess = async (data) => {
    if (loading) return;

    try {
      console.log("Raw Scanned Data:", data); // Debugging

      let qrPayload = {};

      // 1. Try JSON Parse
      try {
        qrPayload = JSON.parse(data);
      } catch (e) {
        // 2. Check if it's a URL
        if (typeof data === 'string' && (data.startsWith('http') || data.includes('knowmystatus'))) {
          try {
            // Attempt to extract ID from URL path (assuming /teacher/:id)
            // Remove trailing slash if present
            const cleanData = data.endsWith('/') ? data.slice(0, -1) : data;
            const parts = cleanData.split('/');
            const potentialId = parts[parts.length - 1];

            if (potentialId) {
              qrPayload = { teacherId: potentialId };
            } else {
              qrPayload = { teacherId: data };
            }
          } catch (urlErr) {
            qrPayload = { teacherId: data };
          }
        } else {
          // 3. Fallback to raw data as ID
          qrPayload = { teacherId: data };
        }
      }

      console.log("Processed Payload:", qrPayload);

      setLoading(true);
      const response = await axios.post('/api/qr/scan', { qrData: qrPayload });

      if (response.data?.teacher) {
        setScannedData(response.data.teacher);
        setIsScanning(false);
        toast.success('Found teacher!');
        // Audio feedback
        const audio = new Audio('/success.mp3'); // Optional if you have it, or ignore
        audio.play().catch(() => { });
      } else {
        toast.error('Teacher not found');
        setError('Teacher not found in database');
      }
    } catch (err) {
      console.error("Scan processing error:", err);
      // More descriptive error
      const msg = err.response?.data?.message || 'Invalid QR Code';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScannedData(null);
    setError(null);
    setIsScanning(true);
  };

  const handleCancel = () => {
    setIsScanning(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] cabinet-grotesk overflow-hidden relative selection:bg-red-500/30">

      {/* Show header only when scanning or viewing results, otherwise Landing has its own specific header/layout */}
      {/* Show header only when viewing results. During scanning, ScannerView handles the UI. */}
      {scannedData && (
        <ScannerHeader
          title={scannedData ? "Teacher Found" : "QR Scanner"}
          subtitle={scannedData ? "View status details below" : "Point camera at a teacher's QR code"}
        />
      )}

      <main className={`h-screen flex flex-col items-center justify-center ${isScanning || scannedData ? 'md:pt-24 md:pb-12 md:px-4' : 'p-4'}`}>

        {error ? (
          <div className="pt-20 w-full flex justify-center">
            <ErrorView error={error} onRetry={() => setError(null)} />
          </div>
        ) : scannedData ? (
          <ResultCard scannedData={scannedData} onReset={handleReset} />
        ) : isScanning ? (
          <div className="w-full h-full md:h-auto md:w-full md:flex-1 flex flex-col items-center justify-center">
            <ScannerView
              onScanSuccess={handleScanSuccess}
              onError={(err) => setError(err)}
              loading={loading}
              onCancel={handleCancel}
            />
            <div className="mt-8 text-center opacity-40">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white">Powered by KnowMyStatus</p>
            </div>
          </div>
        ) : (
          <ScannerLanding onStartScan={() => setIsScanning(true)} />
        )}

      </main>
    </div>
  );
};

export default QRScanner;
