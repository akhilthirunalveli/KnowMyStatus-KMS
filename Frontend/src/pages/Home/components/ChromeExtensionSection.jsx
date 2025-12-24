import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const ChromeExtensionSection = () => {
    return (
        <div className="w-full bg-app-background py-16 sm:py-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="premium-card p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff3333]/10 border border-[#ff3333]/30">
                            <span className="w-2 h-2 rounded-full bg-[#ff3333] animate-pulse"></span>
                            <span className="text-xs font-bold text-[#ff3333] uppercase tracking-wider">Install now</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white cabinet-grotesk leading-tight">
                            Update Status <br />
                            <span className="text-gray-500">From Any Tab.</span>
                        </h2>
                        <p className="text-lg text-gray-400 font-light max-w-xl mx-auto md:mx-0">
                            The KnowMyStatus Chrome Extension lets you manage your availability instantly without leaving your current workflow.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
                            <Link to="/extension" className="px-8 py-3 bg-white text-black rounded-full font-bold cabinet-grotesk flex items-center gap-2 hover:bg-gray-200 transition-colors">
                                Add to Chrome
                                <ArrowRight size={18} />
                            </Link>
                            <span className="text-sm text-gray-500">v1.0 launching next week</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-4 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#ff3333] rounded-full blur-[40px] opacity-20" />
                            <div className="w-full h-full bg-black/60 backdrop-blur-md rounded-xl border border-white/5 flex flex-col p-6">
                                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                                    <div className="text-lg font-bold text-white cabinet-grotesk">Status Update</div>
                                    <div className="w-3 h-3 rounded-full bg-[#ff3333]" />
                                </div>
                                <div className="space-y-3">
                                    <div className="w-full h-8 bg-[#ff3333]/10 rounded mb-4" />
                                    <div className="w-3/4 h-3 bg-gray-800 rounded" />
                                    <div className="w-1/2 h-3 bg-gray-800 rounded" />
                                    <div className="flex gap-2 mt-6">
                                        <div className="w-8 h-8 rounded-full bg-gray-800" />
                                        <div className="w-8 h-8 rounded-full bg-gray-800" />
                                        <div className="w-8 h-8 rounded-full bg-[#ff3333]" />
                                    </div>
                                </div>
                                <div className="mt-auto pt-6">
                                    <div className="w-full h-10 bg-[#ff3333] rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
