import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, QrCode, Camera, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { EvervaultCard } from "../components/EvervaultCard";
import { CometCard } from "../components/CometCard";
import { Spotlight } from "../components/Spotlight";
import { Timeline } from "../components/Timeline";
import oneImage from "../assets/1.png";
import phpLogo from "../assets/2.png";
import sqlLogo from "../assets/3.svg";
import asaImage from "../assets/ASA.png.jpg";
import adobeHackathonImage from "../assets/Adobe India Hackathon 2025.png";
import GithubLogo from "../assets/github.png"; // add GitHub logo import

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const liveStatusRef = useRef(null);
  const aboutRef = useRef(null);

  // Set page title
  useEffect(() => {
    document.title = "KnowMyStatus - Real-time Teacher Communication";
  }, []);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Consider it mobile if either width is small OR it's a mobile device
      setIsMobile(width < 768 || isMobileUserAgent);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debug log to check mobile state
  useEffect(() => {
    console.log('Is Mobile:', isMobile, 'Window Width:', window.innerWidth);
  }, [isMobile]);

  // Timeline data
  const timelineData = [
    {
      title: "Early 2023",
      content: (
        <div>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl font-normal mb-6 sm:mb-8 cabinet-grotesk">
            Started development of KnowMyStatus to solve the problem of student-teacher 
            communication and real-time status updates in educational environments.
          </p>
        </div>
      ),
    },
    {
      title: "2023",
      content: (
        <div>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl font-normal mb-6 sm:mb-8 cabinet-grotesk">
            Built the core platform with QR code integration, teacher profiles in PHP & SQL first.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-black rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center">
              <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 mb-3 sm:mb-4">
                <img src={phpLogo} alt="PHP Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="bg-black rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center">
              <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 mb-3 sm:mb-4">
                <img src={sqlLogo} alt="SQL Logo" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
    title: "2024",
    content: (
      <div>
        <div className="w-full">
          <div className="bg-gray-800 rounded-xl p-2 overflow-hidden h-60 sm:h-72 md:h-80 lg:h-96 w-full">
            <img 
              src={asaImage} 
              alt="ASA" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base text-center mt-3 sm:mt-4 cabinet-grotesk italic px-2">
            KnowMyStatus got an award for Innovation on Industry Conclave at VIT
          </p>
        </div>
      </div>
      ),
    },
    {
      title: "Present",
      content: (
        <div>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl font-normal mb-6 sm:mb-8 cabinet-grotesk">
            KnowMyStatus is now live using MERN Stack and helping educational institutions worldwide 
            improve communication between teachers and students.
          </p>
        </div>
      ),
    },
  ];

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

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

  // Mobile-only component
  const MobileOnlyView = () => (
    <div className="h-screen bg-app-background subtle-grid flex flex-col overflow-hidden">
      {/* Compact Mobile Header */}
      <div className="bg-app-background px-4 py-4 text-center flex-shrink-0">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Bitcount Grid Single, monospace' }}>
          KnowMyStatus<span className="text-red-500">.</span>
        </h1>
        <p className="text-gray-400 text-xs mt-1" style={{ fontFamily: 'Bitcount Grid Single, monospace' }}>Quick Teacher Scan</p>
      </div>

      {/* Main Content Area - Uses remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 space-y-4">
        {/* Compact Scan Card */}
        <div className="w-full max-w-sm bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-center">
          <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-500 border-dotted">
            <QrCode className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2 cabinet-grotesk">
            Scan Teacher QR
          </h2>
          <p className="text-gray-400 text-xs mb-4">
            Quickly access teacher information and status
          </p>
          <button
            onClick={() => navigate('/student/scan')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors cabinet-grotesk flex items-center justify-center space-x-2 text-sm"
          >
            <Camera className="h-4 w-4" />
            <span>Start Scanning</span>
          </button>
        </div>

        {/* Compact Quick Actions */}
        <div className="w-full max-w-sm space-y-2">
          <button
            onClick={() => navigate('/student')}
            className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-medium py-2.5 px-4 rounded-lg border border-gray-600 transition-colors cabinet-grotesk text-sm"
          >
            Browse All Teachers
          </button>
          
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/teacher/dashboard')}
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-medium py-2.5 px-4 rounded-lg border border-blue-500/30 transition-colors cabinet-grotesk text-sm"
            >
              Teacher Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-medium py-2.5 px-4 rounded-lg border border-blue-500/30 transition-colors cabinet-grotesk text-sm"
            >
              Teacher Login
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Return mobile view for small devices
  if (isMobile) {
    return <MobileOnlyView />;
  }

  return (
    <div className="min-h-screen bg-app-background subtle-grid">
      {/* Navbar */}
      <nav className="bg-app-background px-4 sm:px-6 lg:px-10 py-4 sm:py-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="text-app-text-primary text-2xl sm:text-3xl lg:text-4xl navbar-brand cursor-pointer hover:opacity-80 transition-opacity">
            KnowMyStatus<span className="navbar-red-dot">.</span>
          </Link>
          
          {/* Center Navigation Links */}
          <div className="flex items-center gap-3 lg:gap-4 navbar-brand text-lg lg:text-xl text-white">
            <button onClick={scrollToAbout} className="nav-center-link cursor-pointer">
              About
            </button>
            <span className="nav-dot">•</span>
            <Link to="/student" className="nav-center-link">
              Find Teacher
            </Link>
            <span className="nav-dot">•</span>
            <Link to="/student/scan" className="nav-center-link">
              Scan
            </Link>
            <span className="nav-dot">•</span>
            <Link to="/admin" className="nav-center-link">
              Admin
            </Link>
          </div>
          
          {/* Dashboard Button */}
          {isAuthenticated ? (
            <Link 
              to="/teacher/dashboard" 
              className="dashboard-pill-btn flex items-center gap-2 lg:gap-3"
            >
              <span className="navbar-brand text-sm sm:text-base lg:text-lg">Dashboard</span>
              <ArrowRight size={20} className="dotted-arrow sm:w-6 sm:h-6" />
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="dashboard-pill-btn flex items-center gap-2 lg:gap-3"
            >
              <span className="navbar-brand text-sm sm:text-base lg:text-lg">Login</span>
              <ArrowRight size={20} className="dotted-arrow sm:w-6 sm:h-6" />
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full relative" style={{ height: 'calc(100vh - 90px)' }}>
        {/* Evervault Card Background */}
        <EvervaultCard text="Connect. Update. Share." className=""/>
        
        {/* Comet Card - Responsive Position */}
        <div className="absolute right-[5%] sm:right-[8%] lg:right-[12.5%] bottom-[6rem] sm:bottom-[8rem] lg:bottom-[9rem] z-20">
          <CometCard className="w-[40vw] h-[40vw] sm:w-[35vw] sm:h-[35vw] lg:w-[25vw] lg:h-[25vw]">
            <div className="w-full h-full bg-gradient-to-br from-red-900 via-red-700 to-red-900 rounded-2xl p-4 sm:p-6 lg:p-8 flex items-center justify-center text-white">
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

      {/* About Section */}
      <div ref={aboutRef} className="w-full bg-app-background pt-8 sm:pt-10 pb-1">
        <div className="max-w-xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-red-500 cabinet-grotesk flex items-center justify-center gap-2 sm:gap-4">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full"></span>
            About
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full"></span>
          </h2>
        </div>
      </div>

      {/* Timeline Section */}
      <Timeline data={timelineData} />

      {/* Red Scroll Section */}
      <div className="w-full py-3 sm:py-4 bg-red-900 relative overflow-hidden">
        <div className="w-full">
          <div className="flex animate-scroll whitespace-nowrap">
            <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 text-white text-base sm:text-lg md:text-xl lg:text-2xl cabinet-grotesk uppercase">
              <span>•</span>
              <span>Innovation</span>
              <span>•</span>
              <span>Technology</span>
              <span>•</span>
              <span>Education</span>
              <span>•</span>
              <span>Real-time Communication</span>
              <span>•</span>
              <span>Student-Teacher Connect</span>
              <span>•</span>
              <span>QR Integration</span>
              <span>•</span>
              <span>Award Winning</span>
              <span>•</span>
              <span>VIT Industry Conclave</span>
              <span>•</span>
              <span>Innovation</span>
              <span>•</span>
              <span>Technology</span>
              <span>•</span>
              <span>Education</span>
              <span>•</span>
              <span>Real-time Communication</span>
              <span>•</span>
            </div>
          </div>
        </div>
      </div>

      {/* KMS Technologies Section */}
      <div className="w-full bg-app-background py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 text-center">
          <div className="flex justify-center">
            <div className="bg-black rounded-xl p-3 sm:p-4 overflow-hidden max-w-xs sm:max-w-md lg:max-w-2xl">
              <img 
                src={adobeHackathonImage} 
                alt="Adobe India Hackathon 2025" 
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <div 
        ref={liveStatusRef}
        className="w-full h-screen bg-app-background relative overflow-hidden flex items-center justify-center px-4">
        {isSpotlightActive && <Spotlight />}
        {/* Live Status Text */}
        <div className="relative z-50 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white cabinet-grotesk leading-tight">
            KnowMyStatus<span className="text-red-500">.</span> is live now
          </h2>
        </div>
      </div>

      {/* Credit Bar */}
      <div
        className="credit-bar"
        style={{
          position: "fixed",
          right: "1.5vw",
          bottom: "1.2vw",
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
          background: "rgba(0,0,0,0.12)",
          color: "#b6b6b6",
          fontSize: "1.05em",
          fontWeight: 400,
          borderRadius: "999px",
          padding: "0.35em 1.1em 0.35em 0.7em",
          zIndex: 99,
          opacity: 0.45,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
          transition: "opacity 0.2s, background 0.2s, color 0.2s",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none"
        }}
      >
        Developed By
        <img
          src={GithubLogo}
          alt="GitHub"
          style={{
            height: "1.25em",
            width: "1.25em",
            marginRight: "0.3em",
            verticalAlign: "middle",
            opacity: 0.45,
            filter: "grayscale(0.7)",
            transition: "filter 0.2s, opacity 0.2s",
            userSelect: "none",
            pointerEvents: "none"
          }}
        />
        akhilthirunalveli
      </div>
    </div>
  );
};

export default Home;
