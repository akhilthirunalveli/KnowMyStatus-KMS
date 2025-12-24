import React from 'react';
import { User, Phone, Mail, MapPin, CheckCircle, XCircle, ArrowRight, Share2 } from 'lucide-react';

const ResultCard = ({ scannedData, onReset }) => {
    if (!scannedData) return null;

    const isAvailable = scannedData.status === 'available' || !scannedData.status;

    return (
        <div className="w-full max-w-sm mx-auto animate-rise-up perspective-1000">
            {/* Main Glass Card */}
            <div className="relative bg-[#1c1c1e]/80 backdrop-blur-3xl rounded-[40px] overflow-hidden border border-white/10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/5 group">

                {/* Dynamic Status Header */}
                <div className={`relative h-32 w-full overflow-hidden ${isAvailable ? 'bg-gradient-to-br from-emerald-600 to-emerald-900' : 'bg-gradient-to-br from-red-600 to-red-900'}`}>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                    {/* Status Badge Pulse */}
                    <div className="absolute top-6 right-6">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 ${isAvailable ? 'text-emerald-100' : 'text-red-100'}`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{isAvailable ? 'Live' : 'Busy'}</span>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="px-8 pb-8 relative">

                    {/* Avatar Stacking */}
                    <div className="relative -mt-16 mb-6 flex justify-center">
                        <div className="relative">
                            <div className={`absolute inset-0 rounded-[32px] blur-2xl opacity-40 ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                            <div className="w-32 h-32 rounded-[32px] bg-[#1c1c1e] border-[6px] border-[#1c1c1e] flex items-center justify-center relative z-10 overflow-hidden shadow-2xl">
                                {scannedData.photo_url ? (
                                    <img src={scannedData.photo_url} alt={scannedData.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                                        <User className="w-12 h-12 text-white/20" />
                                    </div>
                                )}
                            </div>
                            {/* Status Indicator Icon */}
                            <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl border-4 border-[#1c1c1e] flex items-center justify-center z-20 ${isAvailable ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'}`}>
                                {isAvailable ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            </div>
                        </div>
                    </div>

                    {/* Identity Block */}
                    <div className="text-center space-y-2 mb-8">
                        <h2 className="text-3xl font-bold text-white cabinet-grotesk tracking-tight leading-[0.9]">
                            {scannedData.name}
                        </h2>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/80 to-white/40 font-medium text-sm border-b border-white/10 pb-1">
                                {scannedData.subject || "Faculty Member"}
                            </span>
                            <span className="text-white/40 text-xs font-medium uppercase tracking-widest mt-1">
                                {scannedData.department || "KMS University"}
                            </span>
                        </div>
                    </div>

                    {/* Status Note Glass Card */}
                    <div className={`mb-8 p-5 rounded-3xl border transition-all duration-300 ${isAvailable ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Current Status</p>
                            <span className="text-[10px] text-white/20">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className={`text-xl font-bold cabinet-grotesk leading-tight ${isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                            {scannedData.status ? scannedData.status.replace(/_/g, ' ') : isAvailable ? 'Available on Campus' : 'Currently Unavailable'}
                        </p>
                        {scannedData.status_note && (
                            <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                                <div className="w-0.5 h-auto bg-white/10 rounded-full"></div>
                                <p className="text-sm text-gray-400 italic">"{scannedData.status_note}"</p>
                            </div>
                        )}
                        {/* Return Time Prediction */}
                        {!isAvailable && (scannedData.expected_return_time || scannedData.status_until) && (
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                                <span className="text-[10px] text-red-300">Back by: <span className="font-bold text-white">{scannedData.expected_return_time || new Date(scannedData.status_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                            </div>
                        )}
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {scannedData.office && (
                            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors group/item">
                                <MapPin className="w-5 h-5 text-gray-500 mb-3 group-hover/item:text-white transition-colors" />
                                <p className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Office</p>
                                <p className="text-sm text-gray-200 font-bold max-w-full truncate">{scannedData.office}</p>
                            </div>
                        )}
                        <a href={`mailto:${scannedData.email}`} className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors group/item hover:bg-white/5 cursor-pointer">
                            <Mail className="w-5 h-5 text-gray-500 mb-3 group-hover/item:text-white transition-colors" />
                            <p className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Email</p>
                            <p className="text-sm text-gray-200 font-bold max-w-full truncate">{scannedData.email ? scannedData.email.split('@')[0] : 'Contact'}</p>
                        </a>
                    </div>

                    {/* Primary Actions */}
                    <div className="space-y-3">
                        {scannedData.phone && (
                            <a href={`tel:${scannedData.phone}`} className="w-full py-4 rounded-2xl bg-white text-black font-bold cabinet-grotesk flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                <Phone className="w-5 h-5" />
                                <span>Call Now</span>
                            </a>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={onReset}
                                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold cabinet-grotesk hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180" />
                                <span>Scan Again</span>
                            </button>
                            <button className="px-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResultCard;
