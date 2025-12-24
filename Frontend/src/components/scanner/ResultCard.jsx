import React from 'react';
import { User, Phone, Mail, MapPin, Building, BookOpen, Clock, Calendar, StickyNote } from 'lucide-react';

const ResultCard = ({ scannedData, onReset }) => {
    if (!scannedData) return null;

    return (
        <div className="w-full max-w-sm mx-auto animate-fade-in">
            <div className="bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative">
                {/* Status Indicator Bar */}
                <div className={`h-1.5 w-full ${scannedData.status === 'available' || !scannedData.status ? 'bg-green-500' : 'bg-red-500'}`}></div>

                <div className="p-8 flex flex-col items-center">

                    {/* Profile Icon */}
                    <div className="mb-6 relative">
                        <div className={`absolute -inset-4 rounded-full opacity-20 blur-xl ${scannedData.status === 'available' || !scannedData.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="w-20 h-20 rounded-full bg-[#111] border border-white/10 flex items-center justify-center relative z-10">
                            <User className="h-8 w-8 text-gray-300" />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-[#0a0a0a] z-20 ${scannedData.status === 'available' || !scannedData.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>

                    {/* Name & Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white cabinet-grotesk tracking-tight leading-tight mb-2">
                            {scannedData.name}
                        </h2>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[#ff3333] font-bold tracking-widest text-[10px] uppercase opacity-90">{scannedData.subject}</span>
                            <span className="text-gray-500 text-xs font-medium">{scannedData.department}</span>
                        </div>
                    </div>

                    {/* Status Pill */}
                    <div className="mb-8 w-full">
                        <div className={`rounded-2xl p-4 border ${scannedData.status === 'available' || !scannedData.status ? 'bg-green-900/10 border-green-500/20' : 'bg-red-900/10 border-red-500/20'} text-center`}>
                            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Current Status</p>
                            <p className={`text-xl font-bold cabinet-grotesk capitalize ${scannedData.status === 'available' || !scannedData.status ? 'text-green-400' : 'text-red-400'}`}>
                                {scannedData.status ? scannedData.status.replace('_', ' ') : 'Available'}
                            </p>
                            {scannedData.status_note && (
                                <p className="text-gray-400 text-xs mt-2 italic border-t border-white/5 pt-2">
                                    "{scannedData.status_note}"
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="w-full space-y-3 mb-8">
                        {scannedData.office && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="p-2 rounded-lg bg-white/5 text-gray-400">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Office</p>
                                    <p className="text-sm text-gray-200 font-medium">{scannedData.office}</p>
                                </div>
                            </div>
                        )}

                        {scannedData.email && (
                            <a href={`mailto:${scannedData.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Email</p>
                                    <p className="text-sm text-gray-200 font-medium truncate">{scannedData.email}</p>
                                </div>
                            </a>
                        )}

                        {scannedData.phone && (
                            <a href={`tel:${scannedData.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Phone</p>
                                    <p className="text-sm text-gray-200 font-medium">{scannedData.phone}</p>
                                </div>
                            </a>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={onReset}
                        className="w-full py-4 rounded-xl bg-white text-black font-bold cabinet-grotesk hover:bg-gray-200 transition-colors"
                    >
                        Scan Another Code
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ResultCard;
