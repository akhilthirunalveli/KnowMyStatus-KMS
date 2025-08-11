import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const liveStatusRef = useRef(null);
  const aboutRef = useRef(null);

  // Timeline data
  const timelineData = [
    {
      title: "Early 2023",
      content: (
        <div>
          <p className="text-gray-300 text-xl md:text-2xl font-normal mb-8 cabinet-grotesk">
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
          <p className="text-gray-300 text-sm md:text-2xl font-normal mb-8 cabinet-grotesk">
            Built the core platform with QR code integration, teacher profiles in PHP & SQL.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="w-44 h-44 mb-4">
                <img src={phpLogo} alt="PHP Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="bg-black rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="w-44 h-44 mb-4">
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
          <div className="bg-gray-800 rounded-xl p-2 overflow-hidden h-80 md:h-96 w-full">
            <img 
              src={asaImage} 
              alt="ASA" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <p className="text-gray-300 text-sm md:text-base text-center mt-4 cabinet-grotesk italic">
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
          <p className="text-gray-300 text-sm md:text-2xl font-normal mb-8 cabinet-grotesk">
            KnowMyStatus is now live and helping educational institutions worldwide 
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

      {/* About Section */}
      <div ref={aboutRef} className="w-full bg-app-background pt-10 pb-1">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-red-500 cabinet-grotesk flex items-center justify-center gap-4">
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-red-500 rounded-full"></span>
            About
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-red-500 rounded-full"></span>
          </h2>
        </div>
      </div>

      {/* Timeline Section */}
      <Timeline data={timelineData} />

      {/* Gray Scroll Section */}
      <div className="w-full h-32 bg-app-background relative overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 w-full">
          <div className="flex animate-scroll whitespace-nowrap">
            <div className="flex items-center space-x-8 text-gray-400 text-xl md:text-2xl cabinet-grotesk">
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
      <div className="w-full bg-app-background py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 text-center">
          <div className="flex justify-center">
            <div className="bg-black rounded-xl p-4 overflow-hidden max-w-2xl">
              <img 
                src={adobeHackathonImage} 
                alt="Adobe India Hackathon 2025" 
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
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
