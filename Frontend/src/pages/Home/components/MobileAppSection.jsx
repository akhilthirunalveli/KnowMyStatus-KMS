import React, { useState } from "react";
import { ArrowRight, Check, Wifi, Battery, Signal } from "lucide-react";

export const MobileAppSection = () => {
    return (
        <div className="w-full py-20 sm:py-32 relative overflow-hidden bg-app-background ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">

                    {/* Content Side */}
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Coming Soon</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white cabinet-grotesk leading-tight">
                            Control from <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Home Screen.</span>
                        </h2>
                        <p className="text-lg text-gray-400 font-light max-w-xl mx-auto md:mx-0">
                            Update your teaching status instantly with native iOS and Android widgets. No need to even open the app.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
                            <button className="px-8 py-3 bg-white text-black rounded-full font-bold cabinet-grotesk flex items-center gap-2 hover:bg-gray-200 transition-colors opacity-50 cursor-not-allowed">
                                Join Waitlist
                                <ArrowRight size={18} />
                            </button>
                            <span className="text-sm text-gray-500">Limited beta opening soon</span>
                        </div>
                    </div>

                    {/* Visual Side - Phone Mockup */}
                    <div className="flex-1 w-full max-w-md flex justify-center perspective-1000">
                        <div className="relative w-[300px] h-[600px] bg-black rounded-[55px] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-[12px] ring-[#1a1a1a] border-[4px] border-[#333] transform rotate-[-6deg] hover:rotate-0 transition-all duration-700 ease-spring group">

                            {/* Side Buttons */}
                            <div className="absolute top-28 -left-[18px] w-[6px] h-10 bg-[#2a2a2a] rounded-l-md border-r border-[#111]"></div> {/* Mute */}
                            <div className="absolute top-44 -left-[18px] w-[6px] h-16 bg-[#2a2a2a] rounded-l-md border-r border-[#111]"></div> {/* Vol Up */}
                            <div className="absolute top-64 -left-[18px] w-[6px] h-16 bg-[#2a2a2a] rounded-l-md border-r border-[#111]"></div> {/* Vol Down */}
                            <div className="absolute top-48 -right-[18px] w-[6px] h-24 bg-[#2a2a2a] rounded-r-md border-l border-[#111]"></div> {/* Power */}

                            {/* Screen Content */}
                            <div className="relative w-full h-full bg-black rounded-[48px] overflow-hidden border-[6px] border-black mask-image:radial-gradient(white, black)">

                                {/* Wallpaper / Background */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-80">
                                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
                                </div>

                                {/* Glass Glare Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-30"></div>

                                {/* Status Bar */}
                                <div className="absolute top-0 w-full h-12 z-20 flex justify-between px-8 items-end pb-2 text-white font-medium text-[13px]">
                                    <span className="tracking-wide">9:41</span>
                                    <div className="flex gap-1.5 items-center">
                                        <Signal size={14} className="text-white" />
                                        <Wifi size={14} className="text-white" />
                                        <Battery size={14} className="text-white" />
                                    </div>
                                </div>

                                {/* Dynamic Island */}
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[110px] h-[32px] bg-black rounded-full z-30 flex items-center justify-center">
                                </div>

                                {/* Home Screen Icons Grid */}
                                <div className="absolute top-20 left-6 right-6 grid grid-cols-4 gap-x-5 gap-y-7 opacity-90">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1 group/icon">
                                            <div className={`w-[54px] h-[54px] rounded-[14px] ${i === 2 ? 'bg-[#ff3333]' : 'bg-white/10 backdrop-blur-md'} flex items-center justify-center transition-transform duration-300 group-hover/icon:scale-105 shadow-lg`}>
                                                {i === 2 && <div className="w-7 h-7 bg-white rounded-lg opacity-90"></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* The Widget - Premium Interactive visual */}
                                <div className="absolute bottom-32 left-6 right-6 h-auto min-h-[170px] bg-[#1c1c1e]/60 backdrop-blur-xl border border-white/10 rounded-[28px] p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] z-20 flex flex-col ring-1 ring-white/5 animate-float will-change-transform group/widget overflow-hidden">
                                    {/* Background Gradient Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
                                    {/* Active Status Config */}
                                    <div className="flex-1 bg-gradient-to-b from-[#2c2c2e]/80 to-[#1e1e20]/90 rounded-[22px] p-4 flex items-center gap-4 mb-4 border border-white/5 relative overflow-hidden group/item transition-all duration-300 hover:border-white/10 hover:shadow-lg shadow-black/20">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500"></div>

                                        <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.3)] group-hover/item:scale-105 transition-transform duration-300 ring-4 ring-emerald-500/10">
                                            <Check size={20} className="text-white drop-shadow-sm" strokeWidth={3} />
                                        </div>

                                        <div className="z-10 min-w-0 flex-1">
                                            <p className="text-[10px] text-gray-400 font-medium mb-0.5 uppercase tracking-wider font-sans">Current Status</p>
                                            <p className="text-[19px] font-bold text-white tracking-tight leading-none cabinet-grotesk">Available</p>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="grid grid-cols-3 gap-2 relative z-10">
                                        {['bg-red-500', 'bg-yellow-500', 'bg-blue-500'].map((color, idx) => (
                                            <div key={idx} className="h-10 rounded-xl bg-[#2c2c2e]/60 border border-white/5 flex items-center justify-center hover:bg-[#3a3a3c] transition-all cursor-pointer group/btn active:scale-95 duration-200">
                                                <div className={`w-3.5 h-3.5 rounded-full ${color} shadow-lg opacity-90 group-hover/btn:scale-125 transition-transform duration-300`}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Dock */}
                                <div className="absolute bottom-5 left-4 right-4 h-[88px] bg-white/5 backdrop-blur-2xl rounded-[30px] flex items-center justify-around px-2 z-10 border border-white/5">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-[54px] h-[54px] bg-gradient-to-tr from-white/10 to-white/5 rounded-[14px] shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"></div>
                                    ))}
                                </div>

                                {/* Home Bar */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/80 rounded-full z-30"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
