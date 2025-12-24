import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User } from 'lucide-react';

const ScannerHeader = ({ title = "QR Scanner", subtitle = "Scan teacher QR codes to access their contact information and current status." }) => {
    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 w-full max-w-5xl rounded-full px-6 py-3 flex items-center justify-between relative shadow-2xl ring-1 ring-white/5">
                {/* Brand */}
                <Link to="/" className="text-xl sm:text-2xl font-bold text-white tracking-tight transition-opacity flex items-center cabinet-grotesk cursor-pointer decoration-0">
                    KnowMyStatus<span className="text-[#ff3333] text-3xl leading-none">.</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-white cabinet-grotesk">
                    <Link to="/" className="text-white hover:text-[#ff3333] transition-colors">
                        Home
                    </Link>
                    <Link to="/student" className="text-white hover:text-[#ff3333] transition-colors">
                        Browse Teachers
                    </Link>
                </div>

                {/* Mobile Dashboard/Action */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/student"
                        className="flex bg-white text-black px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors items-center gap-2 hover:bg-gray-200"
                    >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Browse</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default ScannerHeader;
