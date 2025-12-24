import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import jsQR from 'jsqr';
import { toast } from 'react-hot-toast';

const ScannerView = ({ onScanSuccess, onError, loading, onCancel }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const scanIntervalRef = useRef(null);

    const [scanning, setScanning] = useState(false);
    const [currentCamera, setCurrentCamera] = useState('environment'); // 'environment' or 'user'
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

    // QR Detection Logic
    const detectQRCode = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        try {
            const qrResult = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (qrResult) {
                onScanSuccess(qrResult.data);
            }
        } catch (e) {
            // fast ignore
        }
    }, [onScanSuccess]);

    // Start Camera
    const startCamera = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setHasMultipleCameras(videoDevices.length > 1);

            let preferredDeviceId = null;
            // Simplified camera selection logic
            if (currentCamera === 'environment') {
                const backCam = videoDevices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
                if (backCam) preferredDeviceId = backCam.deviceId;
            }

            const constraints = {
                video: {
                    facingMode: preferredDeviceId ? undefined : { ideal: currentCamera },
                    deviceId: preferredDeviceId ? { exact: preferredDeviceId } : undefined,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().catch(e => console.error("Play error", e));
                    setScanning(true);

                    scanIntervalRef.current = setInterval(() => {
                        if (videoRef.current && videoRef.current.videoWidth > 0 && !loading) {
                            detectQRCode();
                        }
                    }, 150);
                };
            }

        } catch (err) {
            console.error("Camera start error:", err);
            onError(err.name);
        }
    }, [currentCamera, detectQRCode, onError, loading]);

    // Stop Camera
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

    const switchCamera = () => {
        stopCamera();
        setCurrentCamera(prev => prev === 'environment' ? 'user' : 'environment');
    };

    // Lifecycle
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);


    return (
        <div className="w-full max-w-sm mx-auto relative rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-2xl aspect-[9/16] sm:aspect-[3/4]">

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-10 h-10 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-white font-medium text-sm">Verifying...</p>
                </div>
            )}

            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scanning Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border border-white/20 rounded-3xl relative overflow-hidden">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#ff3333] rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#ff3333] rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#ff3333] rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#ff3333] rounded-br-xl"></div>

                    {/* Scan Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff3333] to-transparent animate-scan shadow-[0_0_15px_rgba(255,51,51,0.5)]"></div>

                    {/* Pulse */}
                    <div className="absolute inset-0 bg-[#ff3333]/5 animate-pulse"></div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-0 w-full flex justify-center gap-6 z-30 px-6">
                <button
                    onClick={onCancel}
                    className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95"
                    aria-label="Cancel"
                >
                    <span className="text-xs font-bold">CANCEL</span>
                </button>

                {hasMultipleCameras && (
                    <button
                        onClick={switchCamera}
                        className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95"
                    >
                        <RotateCcw className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Status Text */}
            <div className="absolute top-8 left-0 w-full text-center z-30">
                <span className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80">
                    Align QR code within frame
                </span>
            </div>

        </div>
    );
};

export default ScannerView;
