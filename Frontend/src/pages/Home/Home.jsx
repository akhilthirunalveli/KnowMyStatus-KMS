import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Spotlight } from "../../components/common/Spotlight";
import GithubLogo from "../../assets/github.png";

// Imported Sections
import { MobileOnlyView } from "./components/MobileOnlyView";
import { HeroSection } from "./components/HeroSection";
import { AboutTimelineSection } from "./components/AboutTimelineSection";
import { ChromeExtensionSection } from "./components/ChromeExtensionSection";
import { MobileAppSection } from "./components/MobileAppSection";
import { TechStackSection } from "./components/TechStackSection";

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
      <HeroSection />

      {/* About & Timeline Section */}
      <AboutTimelineSection aboutRef={aboutRef} />

      {/* Chrome Extension Section */}
      <ChromeExtensionSection />

      {/* Mobile App Section */}
      <MobileAppSection />

      {/* KMS Technologies Section */}
      <TechStackSection />

      {/* Live Status Spotlight Section */}
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
