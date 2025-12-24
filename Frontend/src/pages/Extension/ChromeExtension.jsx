import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FolderOpen, Puzzle, ArrowRight, ArrowLeft, Chrome } from 'lucide-react';

const ChromeExtension = () => {
    useEffect(() => {
        document.title = "Install Chrome Extension - KnowMyStatus";
        window.scrollTo(0, 0);
    }, []);

    const steps = [
        {
            num: "01",
            title: "Download Extension",
            desc: "Download the latest version of the KnowMyStatus extension package.",
            icon: <Download className="h-6 w-6 text-[#ff3333]" />,
            action: (
                <button className="mt-4 px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold flex items-center gap-2 cabinet-grotesk">
                    <Download size={16} />
                    Download .zip
                </button>
            )
        },
        {
            num: "02",
            title: "Unzip Package",
            desc: "Locate the downloaded .zip file and extract it to a folder on your computer.",
            icon: <FolderOpen className="h-6 w-6 text-white" />
        },
        {
            num: "03",
            title: "Load Unpacked",
            desc: "Go to chrome://extensions, enable 'Developer Mode', and click 'Load Unpacked'. Select the extracted folder.",
            icon: <Puzzle className="h-6 w-6 text-white" />
        }
    ];

    return (
        <div className="min-h-screen bg-app-background subtle-grid cabinet-grotesk">
            {/* Navbar */}
            <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <div className="premium-card w-full max-w-5xl !rounded-full px-6 py-3 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-white tracking-tight flex items-center cabinet-grotesk">
                        KnowMyStatus<span className="text-[#ff3333] text-4xl leading-none">.</span>
                    </Link>
                    <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-400">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#ff3333]/10 mb-6 ring-1 ring-[#ff3333]/20">
                        <Chrome className="h-10 w-10 text-[#ff3333]" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                        Install <span className="text-[#ff3333]">Extension</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Follow these simple steps to install the KnowMyStatus extension manually and start managing your status from any tab.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-800 via-[#ff3333]/20 to-gray-800 z-0" />

                    {steps.map((step, index) => (
                        <div key={index} className="premium-card p-8 items-start relative z-10 bg-black/80">
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    {step.icon}
                                </div>
                                <span className="text-4xl font-black text-white/5 font-sans">{step.num}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-light">{step.desc}</p>
                            {step.action}
                        </div>
                    ))}
                </div>

                {/* Usage Preview */}
                <div className="premium-card p-1 bg-gradient-to-br from-white/5 to-transparent border-0 overflow-hidden">
                    <div className="bg-black/90 p-8 sm:p-12 lg:p-16 rounded-[1.4rem] text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to go?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Once installed, simply click the KnowMyStatus icon in your browser toolbar to set your status instantly.
                        </p>
                        <div className="inline-block p-4 rounded-2xl bg-[#ff3333]/5 border border-[#ff3333]/20">
                            <span className="text-[#ff3333] font-mono text-sm">chrome://extensions</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ChromeExtension;
