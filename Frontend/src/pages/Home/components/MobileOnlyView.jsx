import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, QrCode, Camera, Search, User, LogIn } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export const MobileOnlyView = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-black overflow-hidden relative selection:bg-red-500/30 font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-red-900/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-blue-900/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 h-full flex flex-col px-6 py-6">
                {/* Premium Mobile Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#ff3333] animate-pulse shadow-[0_0_10px_#ff3333]"></div>
                        <h1 className="text-2xl font-bold text-white cabinet-grotesk tracking-tight">
                            KnowMyStatus<span className="text-[#ff3333]">.</span>
                        </h1>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="text-[10px] font-medium text-white/60 uppercase tracking-widest">Mobile V1.0</span>
                    </div>
                </div>

                {/* Main Hero Section */}
                <div className="flex-1 flex flex-col items-start justify-center -mt-10">

                    <div className="mb-6 space-y-2 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff3333]/10 border border-[#ff3333]/20 mb-2">
                            <Sparkles className="w-3 h-3 text-[#ff3333]" />
                            <span className="text-xs font-bold text-[#ff3333] tracking-wide uppercase">New Scanner</span>
                        </div>
                        <h2 className="text-4xl xs:text-5xl font-bold text-white leading-[0.9] cabinet-grotesk">
                            Instant <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Status.</span>
                        </h2>
                        <p className="text-gray-400 text-sm max-w-[260px] leading-relaxed">
                            Scan a teacher's QR code to view their real-time availability instantly.
                        </p>
                    </div>

                    {/* Glass Hero Card */}
                    <div className="w-full relative group cursor-pointer" onClick={() => navigate('/student/scan')}>
                        <div className="relative w-full aspect-[4/3] bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <QrCode className="w-6 h-6 text-white" />
                                </div>
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-[#ff3333] shadow-[0_0_15px_#ff3333] animate-pulse">
                                    <Camera className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white cabinet-grotesk">Start Scanning</h3>
                                <p className="text-white/40 text-xs mt-1">Tap to open camera</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Quick Actions Footer */}
                <div className="w-full grid grid-cols-2 gap-3 mt-auto pt-6">
                    <button
                        onClick={() => navigate('/student')}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors gap-2"
                    >
                        <Search className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        <span className="text-xs font-medium text-gray-400">Browse</span>
                    </button>

                    {isAuthenticated ? (
                        <button
                            onClick={() => navigate('/teacher/dashboard')}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors gap-2"
                        >
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="text-xs font-medium text-gray-400">Dashboard</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#ff3333]/10 border border-[#ff3333]/20 hover:bg-[#ff3333]/20 transition-colors gap-2"
                        >
                            <LogIn className="w-5 h-5 text-[#ff3333]" />
                            <span className="text-xs font-medium text-[#ff3333]">Login</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
