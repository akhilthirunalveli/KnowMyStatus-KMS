import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, QrCode, Camera, ArrowLeft } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { EvervaultCard } from "../../components/common/EvervaultCard";
import { CometCard } from "../../components/common/CometCard";
import { Spotlight } from "../../components/common/Spotlight";
import { Timeline } from "../../components/common/Timeline";
import eventImage from "../../assets/EventImage.jpg";
import phpLogo from "../../assets/Php.png";
import sqlLogo from "../../assets/MySQL.svg";
import qrHeroImage from "../../assets/QRHeroSection.png";
import techStackImage from "../../assets/Techstackused.png";
import GithubLogo from "../../assets/github.png";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { SiExpress, SiTailwindcss, SiFramer, SiSupabase } from "react-icons/si";
import { SpotlightCard } from "../../components/common/SpotlightCard.jsx";

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
            <div className="bg-gray-900/50 rounded-xl p-2 overflow-hidden h-60 sm:h-72 md:h-80 lg:h-96 w-full">
              <img
                src={eventImage}
                alt="Event Image"
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
        <h1 className="text-3xl font-bold text-white cabinet-grotesk">
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
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="premium-card w-full max-w-5xl !rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:opacity-80 transition-opacity flex items-center cabinet-grotesk">
            KnowMyStatus<span className="text-[#ff3333] text-4xl leading-none">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-base font-medium text-white cabinet-grotesk">
            <button onClick={scrollToAbout} className="hover:text-white transition-colors">
              About
            </button>
            <Link to="/student" className="hover:text-white transition-colors">
              Find Teacher
            </Link>
            <Link to="/student/scan" className="hover:text-white transition-colors">
              Scan
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/teacher/dashboard"
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 cabinet-grotesk"
              >
                Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-[#ff3333] text-white px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 cabinet-grotesk"
              >
                Login
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full h-screen relative overflow-hidden">
        {/* Evervault Card Background */}
        <EvervaultCard text="Connect. Update. Share." className="" />

        {/* Comet Card - Responsive Position */}
        <div className="absolute right-[5%] sm:right-[8%] lg:right-[12.5%] bottom-[6rem] sm:bottom-[8rem] lg:bottom-[9rem] z-20">
          <CometCard className="w-[40vw] h-[40vw] sm:w-[35vw] sm:h-[35vw] lg:w-[25vw] lg:h-[25vw]">
            <div className="w-full h-full bg-gradient-to-br from-red-900 via-red-700 to-red-900 rounded-2xl p-4 sm:p-6 lg:p-8 flex items-center justify-center text-white">
              <div className="w-full h-full rounded-lg flex items-center justify-center">
                <img
                  src={qrHeroImage}
                  alt="QR Hero Section"
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

      {/* Chrome Extension Section */}
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

      {/* KMS Technologies Section */}
      <div className="w-full bg-app-background py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white cabinet-grotesk mb-4">
              Powered by Modern Tech
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Built with the latest technologies for maximum performance and reliability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "React", icon: FaReact, color: "#61DAFB", description: "Frontend" },
              { name: "Node.js", icon: FaNodeJs, color: "#339933", description: "Runtime" },
              { name: "Express", icon: SiExpress, color: "#FFFFFF", description: "Backend" },
              { name: "Supabase", icon: SiSupabase, color: "#3ECF8E", description: "Database" },
              { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4", description: "Styling" },
              { name: "Framer", icon: SiFramer, color: "#0055FF", description: "Animation" },
            ].map((tech, index) => (
              <SpotlightCard
                mode="after"
                spotlightColor={tech.color}
                key={index}
                className="group h-full flex flex-col items-center justify-center p-6 bg-black/5 hover:bg-black/10 border-2 border-black/10"
              >
                <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                  <div className="p-3 rounded-full bg-black/5 group-hover:bg-black/50 transition-colors">
                    <tech.icon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" style={{ color: tech.color }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold cabinet-grotesk text-lg tracking-wide">{tech.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-wider">{tech.description}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
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
