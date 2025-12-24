import React, { useRef, useState } from 'react';
import { X, Download, Share2, User } from 'lucide-react';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const ShareCardModal = ({ isOpen, onClose, user, qrCode }) => {
    const cardRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    if (!isOpen) return null;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setDownloading(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#000000',
                scale: 2, // Higher resolution
                useCORS: true,
                logging: false,
                width: 320, // Enforce capture width
                height: 480 // Enforce capture height
            });

            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = `KnowMyStatus-${user.name.split(' ')[0]}-Card.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Card downloaded successfully!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to generate card image');
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = async () => {
        if (!cardRef.current) return;
        setDownloading(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#000000',
                scale: 2,
                useCORS: true,
                width: 320,
                height: 480
            });

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    toast.error('Failed to generate image blob');
                    return;
                }

                const file = new File([blob], 'share-card.png', { type: 'image/png' });

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'KnowMyStatus Card',
                            text: `Check my status on KnowMyStatus!`,
                        });
                        toast.success('Shared successfully!');
                    } catch (shareError) {
                        console.log('Share cancelled or failed', shareError);
                    }
                } else {
                    try {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        toast.success('Image copied to clipboard!');
                    } catch (clipError) {
                        console.error('Clipboard write failed', clipError);
                        handleDownload();
                    }
                }
            }, 'image/png');

        } catch (error) {
            console.error('Share generation error:', error);
            toast.error('Failed to prepare sharing');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                    <h3 className="text-white font-bold cabinet-grotesk text-lg">Share Card</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col items-center">
                    {/* The Card to Capture */}
                    <div
                        ref={cardRef}
                        className="w-[320px] h-[480px] relative overflow-hidden flex flex-col items-center justify-between p-8 border border-white/5 mx-auto shadow-2xl"
                    >
                        {/* Logo */}
                        <div className="w-full flex justify-center items-center gap-1 mt-2">
                            <span className="text-2xl font-bold text-white tracking-tight cabinet-grotesk">
                                KnowMyStatus
                            </span>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col items-center justify-center w-full space-y-6">

                            {/* User Info */}
                            <div className="text-center w-full space-y-2">
                                <h2 className="text-3xl font-bold text-white cabinet-grotesk tracking-tight leading-none px-2">
                                    {user?.name}
                                </h2>
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-[#ff3333] font-bold tracking-[0.2em] text-[10px] uppercase opacity-90">{user?.subject}</p>
                                    <div className="w-0.5 h-0.5 rounded-full bg-white/30"></div>
                                    <p className="text-gray-400 font-medium text-xs tracking-wide">{user?.department}</p>
                                </div>
                            </div>

                            {/* QR Code */}
                            <div className="relative group">
                                <div className="absolute -inset-4 rounded-full opacity-10 blur-xl"></div>
                                <div className="bg-white p-3 rounded-2xl relative shadow-2xl">
                                    {qrCode?.qrCodeUrl ? (
                                        <img src={qrCode.qrCodeUrl} alt="QR Code" className="w-40 h-40 object-contain" />
                                    ) : (
                                        <div className="w-40 h-40 bg-gray-50 flex items-center justify-center text-gray-400 text-xs text-center p-4">Code<br />Unavailable</div>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-500 text-[10px] cabinet-grotesk max-w-[200px] text-center">
                                Scan to check {user?.name.split(' ')[0]}'s availability status.
                            </p>

                        </div>

                        {/* Footer */}
                        <div className="w-full text-center pb-2">
                            <p className="text-[9px] text-gray-700 font-mono tracking-[0.2em] uppercase">https://knowmystatus.vercel.app/</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 w-full mt-6">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex-1 bg-white text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 cabinet-grotesk"
                        >
                            {downloading ? <span className="animate-spin">⌛</span> : <Download className="h-4 w-4" />}
                            Download
                        </button>
                        <button
                            onClick={handleShare}
                            disabled={downloading}
                            className="flex-1 bg-[#ff3333] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50 cabinet-grotesk"
                        >
                            <Share2 className="h-4 w-4" />
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareCardModal;
