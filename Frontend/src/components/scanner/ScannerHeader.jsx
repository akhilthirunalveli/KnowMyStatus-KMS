import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User } from 'lucide-react';

const ScannerHeader = ({ title = "QR Scanner", subtitle = "Scan teacher QR codes to access their contact information and current status." }) => {
    return (
        <header className="bg-black px-4 sm:px-6 py-4 absolute top-0 w-full z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 w-full sm:w-auto">
                    {/* Brand */}
                    <Link to="/" className="text-white text-xl sm:text-2xl navbar-brand font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity cabinet-grotesk flex items-center gap-1">
                        KnowMyStatus
                        <div className="w-2 h-2 rounded-full bg-[#ff3333] mt-1.5"></div>
                    </Link>

                    {/* Welcome Message */}
                    <div className="flex-1 sm:flex-initial hidden sm:block">
                        <h1 className="text-xl font-bold text-white leading-none">
                            {title}
                        </h1>
                        <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
                    <Link
                        to="/"
                        className="bg-white/5 hover:bg-white/10 text-white font-medium py-2 px-3 sm:px-4 rounded-full border border-white/10 transition-all flex items-center gap-2 backdrop-blur-sm"
                    >
                        <Home className="h-4 w-4" />
                        <span className="hidden sm:inline text-sm">Home</span>
                    </Link>
                    <Link
                        to="/student"
                        className="bg-[#ff3333] hover:bg-red-600 text-white font-medium py-2 px-3 sm:px-4 rounded-full border border-transparent transition-all flex items-center gap-2 shadow-lg shadow-red-900/20"
                    >
                        <User className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">Browse Teachers</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default ScannerHeader;
