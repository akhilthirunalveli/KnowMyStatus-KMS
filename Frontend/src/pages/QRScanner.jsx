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
      // Parse data if it's JSONString, else use as raw ID
      let qrPayload = {};
      try {
        qrPayload = JSON.parse(data);
      } catch (e) {
        qrPayload = { teacherId: data };
      }

      setLoading(true);
      const response = await axios.post('/api/qr/scan', { qrData: qrPayload });

      if (response.data?.teacher) {
        setScannedData(response.data.teacher);
        setIsScanning(false);
        toast.success('Found teacher!');
      } else {
        toast.error('Teacher not found');
      }
    } catch (err) {
      console.error("Scan processing error:", err);
      toast.error('Invalid QR Code');
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
