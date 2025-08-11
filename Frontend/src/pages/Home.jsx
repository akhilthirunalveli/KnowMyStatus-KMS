import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { EvervaultCard } from "../components/EvervaultCard";
import { CometCard } from "../components/CometCard";
import { Spotlight } from "../components/Spotlight";
import oneImage from "../assets/1.png";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const liveStatusRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (liveStatusRef.current) {
        const rect = liveStatusRef.current.getBoundingClientRect();
        const centerY = window.innerHeight / 2;
        
        // Check if the center of the section is near the center of the viewport
        const sectionCenter = rect.top + rect.height / 2;
        const isInCenter = Math.abs(sectionCenter - centerY) < 100; // 100px tolerance
        
        setIsSpotlightActive(isInCenter);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-app-background subtle-grid">
      {/* Navbar */}
      <nav className="bg-app-background px-10 py-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="text-app-text-primary text-4xl navbar-brand">
            KnowMyStatus<span className="navbar-red-dot">.</span>
          </div>
          
          {/* Center Navigation Links */}
          <div className="flex items-center gap-4 navbar-brand text-xl text-white">
            <Link to="/process" className="nav-center-link">
              Student
            </Link>
            <span className="nav-dot">•</span>
            <Link to="/student" className="nav-center-link">
              Find Teacher
            </Link>
            <span className="nav-dot">•</span>
            <Link to="/student/scan" className="nav-center-link">
              Scan
            </Link>
          </div>
          
          {/* Dashboard Button */}
          <Link 
            to="/teacher/dashboard" 
            className="dashboard-pill-btn flex items-center gap-3"
          >
            <span className="navbar-brand text-lg">Dashboard</span>
            <ArrowRight size={24} className="dotted-arrow" />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full relative" style={{ height: 'calc(100vh - 110px)' }}>
        {/* Evervault Card Background */}
        <EvervaultCard text="Connect. Update. Share." className="" />
        
        {/* Comet Card - Fixed Position */}
        <div className="absolute right-[12.5%] bottom-[9rem] z-20">
          <CometCard className="w-[25vw] h-[25vw]">
            <div className="w-full h-full bg-gradient-to-br from-red-900 via-red-700 to-red-900 rounded-2xl p-8 flex items-center justify-center text-white">
              <div className="w-full h-full rounded-lg flex items-center justify-center">
                <img 
                  src={oneImage} 
                  alt="1" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          </CometCard>
        </div>
      </div>

      {/* Live Status Section */}
      <div 
        ref={liveStatusRef}
        className="w-full h-screen bg-app-background relative overflow-hidden flex items-center justify-center"
      >
        {/* Spotlight Effect - Only active when scrolled to center */}
        {isSpotlightActive && <Spotlight />}
        
        {/* Live Status Text */}
        <div className="relative z-50 text-center">
          <h2 className="text-6xl font-bold text-white cabinet-grotesk">
            KnowMyStatus<span className="text-red-500">.</span> is live now
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
