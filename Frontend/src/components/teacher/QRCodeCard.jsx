import React from 'react';
import {
  QrCode,
  Download,
  Copy,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

const QRCodeCard = ({
  qrCode,
  loading,
  generateQRCode,
  downloadQRCode,
  copyQRData,
  copied
}) => {
  return (
    <div className="premium-card p-6 sm:p-8 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-cabinet-grotesk text-white">Digital Pass</h2>
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
      </div>

      {qrCode ? (
        <div className="w-full">
          <div className="relative group mx-auto w-full max-w-[240px] aspect-square flex items-center justify-center bg-white rounded-2xl mb-8 overflow-hidden shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
            <img
              src={qrCode.qrCodeUrl}
              alt="Teacher QR Code"
              className="w-48 h-48 object-contain relative z-10"
            />
            {/* Corner acccents */}
            <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-black"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-black"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-black"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-black"></div>
          </div>

          <div className="space-y-3">
            <button
              onClick={downloadQRCode}
              className="w-full bg-[#ff3333] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_4px_15px_rgba(255,51,51,0.3)] flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Save to Device
            </button>
            <button
              onClick={copyQRData}
              className="w-full bg-transparent border border-white/10 text-gray-300 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Data
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 w-full border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
          <QrCode className="h-10 w-10 text-gray-600 mx-auto mb-4" />
          <h3 className="font-bold text-white mb-2">No Pass Generated</h3>
          <p className="text-sm text-gray-500 mb-6 px-4">Create your digital ID to allow students to scan your status.</p>
          <button
            onClick={generateQRCode}
            disabled={loading}
            className="bg-white text-black font-bold py-2 px-6 rounded-full transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Wait...
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4" />
                Generate
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeCard;
