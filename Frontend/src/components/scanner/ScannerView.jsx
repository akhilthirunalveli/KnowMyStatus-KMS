import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RotateCcw, X, Zap, ScanLine } from 'lucide-react';
import jsQR from 'jsqr';
import { toast } from 'react-hot-toast';

const ScannerView = ({ onScanSuccess, onError, loading, onCancel }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const scanIntervalRef = useRef(null);

    const [currentCameraId, setCurrentCameraId] = useState(null);
    const [cameras, setCameras] = useState([]);

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
                // Haptic feedback pattern
                if (navigator.vibrate) navigator.vibrate(50);
                onScanSuccess(qrResult.data);
            }
        } catch (e) {
            // fast ignore
        }
    }, [onScanSuccess]);

    // Start Camera
    const startCamera = useCallback(async (deviceId = null) => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setCameras(videoDevices);

            const constraints = {
                video: {
                    // If a specific deviceId is requested (user switched), use it.
                    // Otherwise, if no deviceId is current, default to 'environment' (OS picks best back cam).
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                    facingMode: deviceId ? undefined : { ideal: 'environment' },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    // Advanced constraints for better focus if supported
                    focusMode: 'continuous',
                },
                audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                // Update current camera ID from the active stream track to validation
                const track = stream.getVideoTracks()[0];
                const settings = track.getSettings();
                if (settings.deviceId) {
                    setCurrentCameraId(settings.deviceId);
                }

                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().catch(e => console.error("Play error", e));
                    setScanning(true);

                    scanIntervalRef.current = setInterval(() => {
                        if (videoRef.current && videoRef.current.videoWidth > 0 && !loading) {
                            detectQRCode();
                        }
                    }, 100);
                };
            }

        } catch (err) {
            console.error("Camera start error:", err);
            onError(err.name);
        }
    }, [detectQRCode, onError, loading]);

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
        if (cameras.length < 2) return;

        stopCamera();

        // Find current index
        const currentIndex = cameras.findIndex(c => c.deviceId === currentCameraId);
        // Next index (wrap around)
        const nextIndex = (currentIndex + 1) % cameras.length;
        const nextDevice = cameras[nextIndex];

        startCamera(nextDevice.deviceId);
    };

    // Lifecycle
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);


    return (
        <div className="w-full h-full md:max-w-md md:h-[80vh] md:aspect-[9/16] md:rounded-[40px] relative overflow-hidden bg-black md:border-[8px] md:border-[#1a1a1a] md:shadow-2xl md:mx-auto ring-1 ring-white/10 group">

            {/* Future-chic Vignette & Grain */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
            <div className="absolute inset-0 pointer-events-none z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

            {/* Video Feed */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover scale-105" // slight zoom to fill
                playsInline
                muted
                autoPlay
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-[#ff3333]/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#ff3333] rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-white font-bold text-lg mt-6 cabinet-grotesk tracking-wide">VERIFYING</p>
                </div>
            )}

            {/* Tech Overlay UI */}
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-8">

                {/* Top Status HUD */}
                <div className="flex justify-center pt-8 md:pt-4">
                    <div className="px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center gap-3 shadow-lg shadow-black/20">
                        <div className="w-2 h-2 rounded-full bg-[#ff3333] animate-pulse shadow-[0_0_10px_#ff3333]"></div>
                        <span className="text-xs font-bold text-white tracking-widest cabinet-grotesk uppercase">System Active</span>
                    </div>
                </div>

                {/* Central Scanning Reticle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-80 sm:h-80">
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-[3px] border-l-[3px] border-white/80 rounded-tl-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-[3px] border-r-[3px] border-white/80 rounded-tr-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[3px] border-l-[3px] border-white/80 rounded-bl-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[3px] border-r-[3px] border-white/80 rounded-br-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>

                    {/* Animated Scalar Ring */}
                    <div className="absolute inset-4 border border-white/20 rounded-2xl animate-pulse"></div>

                    {/* Laser Scan Line */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#ff3333] to-transparent animate-scan shadow-[0_0_25px_#ff3333] z-10"></div>

                    {/* Grid Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30"></div>
                </div>

                {/* Bottom Controls HUD */}
                <div className="mb-4 pointer-events-auto flex items-center justify-center gap-8">
                    <button
                        onClick={onCancel}
                        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-[#ff3333] transition-all duration-300"
                    >
                        <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Center Scan Cluster */}
                    <div className="relative flex items-center justify-center w-20 h-20">
                        <div className="absolute inset-0 rounded-full border-4 border-white/20 p-1 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                            <div className="w-full h-full border-2 border-dashed border-white/40 rounded-full"></div>
                        </div>

                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulse z-10">
                            <ScanLine className="text-black w-8 h-8" />
                        </div>
                    </div>

                    {cameras.length > 1 && (
                        <button
                            onClick={switchCamera}
                            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all duration-300"
                        >
                            <RotateCcw className="w-6 h-6 text-white group-hover:-rotate-180 transition-transform duration-500" />
                        </button>
                    )}
                </div>
            </div>

            {/* Helper Text */}
            <div className="absolute bottom-36 left-0 right-0 text-center z-20 pointer-events-none">
                <p className="text-white/80 font-medium tracking-wide text-sm drop-shadow-md cabinet-grotesk">
                    Align code within frame
                </p>
            </div>
        </div>
    );
};

export default ScannerView;
