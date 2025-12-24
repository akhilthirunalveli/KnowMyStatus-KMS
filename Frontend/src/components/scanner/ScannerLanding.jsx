import React from 'react';
import { Camera, QrCode, User, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ScannerLanding = ({ onStartScan }) => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-4 overflow-hidden">

            {/* Ambient Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-fade-in-up">

                {/* Header / Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff3333] animate-pulse"></div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-medium">Quick Scan</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight cabinet-grotesk mb-2">
                        KnowMyStatus
                        <span className="text-[#ff3333]">.</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">Identify teachers in seconds</p>
                </div>

                {/* Main Action Card */}
                <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-2 shadow-2xl ring-1 ring-white/5 mb-8 group hover:bg-white/10 transition-colors duration-500">
                    <div className="bg-[#050505]/80 rounded-[28px] p-8 flex flex-col items-center text-center relative overflow-hidden">

                        {/* Decorative scanner line */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff3333] to-transparent opacity-0 group-hover:opacity-100 group-hover:top-full transition-all duration-[2s] ease-in-out"></div>

                        {/* Icon */}
                        <div className="mb-8 relative">
                            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full"></div>
                            <div className="relative w-24 h-24 bg-gradient-to-br from-[#1a1a1a] to-black rounded-3xl border border-white/10 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                                <QrCode className="h-10 w-10 text-white opacity-90" />
                            </div>
                            {/* Corner accents */}
                            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[#ff3333] rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#ff3333] rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2 cabinet-grotesk">Ready to Scan?</h2>
                        <p className="text-gray-500 text-xs sm:text-sm mb-8 leading-relaxed max-w-[240px]">
                            Point your camera at a teacher's QR code to view their real-time availability.
                        </p>

                        <button
                            onClick={onStartScan}
                            className="w-full group/btn relative overflow-hidden rounded-xl bg-[#ff3333] p-[1px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
                        >
                            <div className="relative flex items-center justify-center gap-3 rounded-xl bg-[#ff3333] px-6 py-4 transition-all duration-300 group-hover/btn:bg-red-600">
                                <Camera className="h-5 w-5 text-white" />
                                <span className="font-bold text-white tracking-wide">Start Camera</span>
                                <ArrowRight className="h-4 w-4 text-white/70 group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="grid grid-cols-2 gap-4 w-full">
                    <Link
                        to="/student"
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-center group"
                    >
                        <div className="p-2 rounded-full bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                            <User className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover:text-white">Browse Teachers</span>
                    </Link>

                    <Link
                        to="/login"
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-center group"
                    >
                        <div className="p-2 rounded-full bg-white/5 text-gray-400 group-hover:text-blue-400 transition-colors">
                            <Lock className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover:text-white">Admin Login</span>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ScannerLanding;

