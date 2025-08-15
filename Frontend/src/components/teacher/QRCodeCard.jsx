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
    <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/30 backdrop-blur-lg rounded-2xl border border-purple-700/30 p-4 sm:p-6">
      <h2 className="text-lg sm:text-lg font-semibold text-white mb-4 sm:mb-6">Your QR Code</h2>
      {qrCode ? (
        <div className="text-center">
          <div className="bg-black/30 p-2 rounded-xl inline-block mb-4 border-2 border-dashed border-purple-500/50 font-cabinet-grotesk">
            <img 
              src={qrCode.qrCodeUrl} 
              alt="Teacher QR Code"
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
            />
          </div>
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={downloadQRCode}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </button>
            <button
              onClick={copyQRData}
              className="w-full border border-purple-500/50 hover:bg-purple-900/30 text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy QR Data
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black/30 rounded-xl flex items-center justify-center mx-auto mb-4">
            <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
          </div>
          <h3 className="font-medium text-white mb-2 text-sm sm:text-base">No QR Code Generated</h3>
          <p className="text-xs sm:text-sm text-gray-400 mb-4">Generate your personal QR code to share with students.</p>
          <button
            onClick={generateQRCode}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4" />
                Generate QR Code
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeCard;
