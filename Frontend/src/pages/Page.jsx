import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Home, User, QrCode, Settings, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gridTemplateRows: "0.5fr 1fr 1fr 0.5fr",
  minHeight: "100vh",
  minWidth: "100vw",
  background: "var(--app-surface)",
};

const cellStyle = {
  border: "1px solid var(--app-card-border)",
  boxSizing: "border-box",
  position: "relative",
  minWidth: 0,
  minHeight: 0,
};

const numberStyle = {
  position: "absolute",
  top: 4,
  left: 6,
  color: "var(--app-text-muted)",
  fontSize: "1.1rem",
  fontFamily: "sans-serif",
};

const cellWithButtonStyle = {
  ...cellStyle,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
};

const buttonStyle = {
  width: "100%",
  height: "40px",
  background: "var(--app-button-primary)",
  color: "var(--app-button-primary-text)",
  border: "none",
  fontSize: "1.1rem",
  fontWeight: "bold",
  cursor: "pointer",
  marginBottom: 0,
  transition: "background 0.2s, color 0.2s",
  fontFamily: "Nunito Sans, sans-serif",
  textAlign: "center",
  paddingLeft: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mergedFirstTwoCellStyle = {
  ...cellStyle,
  gridColumn: "1 / span 2",
  gridRow: "1",
};

const mergedFirstRowCellStyle = {
  ...cellStyle,
  gridColumn: "3 / span 2",
  gridRow: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mergedCellStyle = {
  ...cellStyle,
  gridColumn: "3 / span 2",
  gridRow: "2 / span 2",
};

const mergedLastRowCellStyle = {
  ...cellStyle,
  gridColumn: "1 / span 2",
  gridRow: "4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mergedLastRowCellStyle2 = {
  ...cellStyle,
  gridColumn: "3 / span 2",
  gridRow: "4",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const titleStyle = {
  color: "var(--app-text-light)",
  fontSize: "4.5rem",
  fontFamily: "Nunito Sans, sans-serif",
  fontWeight: "bold",
  textAlign: "center",
  wordBreak: "break-word",
  width: "100%",
};

// Original order: 1-16
// Indices: 6 (7), 7 (8), 10 (11), 11 (12)
// Let's mix: 7->12, 8->7, 11->8, 12->11
const mixedNumbers = [
  1, 2, 3, 4,
  5, 6, 12, 7,
  9, 10, 8, 11,
  13, 14, 15, 16
];

// Responsive styles using a style tag
const ResponsiveStyles = () => (
  <style>{`
    @media (max-width: 900px) {
      .kms-title {
        font-size: 2.5rem !important;
      }
  `}</style>
);

const searchBarContainerStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const searchInputWrapperStyle = {
    width: "90%",
    maxWidth: "700px",
    display: "flex",
    alignItems: "center",
    background: "#000",
    border: "1px solid #f4e9e9",
    borderRadius: "80px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    padding: "0 8px 0 0",
    WebkitBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
    transform: "translateZ(0)",
};

const searchInputStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#f4e9e9",
  fontSize: "1.2rem",
  fontFamily: "Nunito Sans, sans-serif",
  fontWeight: "bold",
  padding: "14px 0 14px 18px",
};

const searchButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  cursor: "pointer",
  marginLeft: "8px",
};

const searchIconStyle = {
  width: "20px",
  height: "20px",
  color: "#000",
};

const roundButtonsContainerStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  gap: "20px",
};

const roundButtonStyle = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  background: "#fff",
  border: "1.5px solid rgb(214, 197, 197)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "1.3rem",
  color: "#000",
  fontWeight: "bold",
  transition: "background 0.2s, color 0.2s",
};

const doubleBoxContainerStyle = {
  display: "flex",
  height: "100%",
  width: "100%",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "32px",
  padding: "20px 20px 20px 20px",
};

const doubleBoxStyle = {
  flex: 'none',
  minWidth: 0,
  minHeight: 0,
  border: "1.5px solid #333",
  height: "300px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontFamily: "Nunito Sans, sans-serif",
  fontWeight: "bold",
  fontSize: "1.3rem",
};

const doubleBoxStyle1 = {
  flex: 'none',
  minWidth: 0,
  minHeight: 0,
  border: "1.5px solid #333",
  height: "100px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontFamily: "Nunito Sans, sans-serif",
  fontWeight: "bold",
  fontSize: "1.3rem",
};

const Page = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Navbar styles
  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    background: "var(--app-surface)",
    borderBottom: "2px solid var(--app-card-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    zIndex: 1000,
  };

  const navButtonStyle = {
    background: "var(--app-button-primary)",
    color: "var(--app-button-primary-text)",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const logoStyle = {
    color: "var(--app-text-light)",
    fontSize: "1.5rem",
    fontWeight: "bold",
    fontFamily: "Nunito Sans, sans-serif",
  };

  return (
    <>
      {/* Navbar */}
      <nav style={navbarStyle}>
        <div style={logoStyle}>
          KNOW MY STATUS
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/student" style={navButtonStyle}>
            <User size={18} />
            Find Teachers
          </Link>
          <Link to="/student/scan" style={navButtonStyle}>
            <QrCode size={18} />
            Scan QR
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              style={navButtonStyle}
              title="Logout"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <Link to="/teacher/login" style={navButtonStyle}>
              <LogIn size={18} />
              Login
            </Link>
          )}
        </div>
      </nav>

      <ResponsiveStyles />
      {/* Add top padding to account for fixed navbar */}
      <div style={{...gridStyle, paddingTop: "60px"}} className="kms-grid">
        {/* Merged first two cells for 1 and 2 */}
        <div style={mergedFirstTwoCellStyle} key="merged-1-2"></div>
        {/* Merged first row cell for 3 and 4 with search bar */}
        <div style={mergedFirstRowCellStyle} key="merged-3-4">
          <div style={searchBarContainerStyle}>
            <div style={searchInputWrapperStyle}>
              <input
                type="text"
                placeholder="Search"
                style={searchInputStyle}
              />
              <button style={searchButtonStyle}>
                <svg style={searchIconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <line x1="16.018" y1="16.485" x2="20.542" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Cell 5 */}
        <div key={4} style={cellStyle}></div>
        {/* 6th cell with button */}
        <div key={5} style={cellWithButtonStyle}>
          <Link to="/student" style={buttonStyle}>FIND TEACHER</Link>
        </div>
        {/* Merged cell for 7,8,11,12 with two stacked boxes */}
        <div style={mergedCellStyle} key="merged-7-8-11-12">
          <div style={doubleBoxContainerStyle}>
            <div style={doubleBoxStyle}>
              {/* HTML5 QR Scanner placeholder */}
              <div id="qr-reader" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: '#888', fontSize: '1.1rem' }}>QR Scanner will appear here</span>
              </div>
            </div>
            <div style={doubleBoxStyle1}>Box 2</div>
          </div>
        </div>
        {/* Cell 9 with button */}
        <div key={9} style={cellWithButtonStyle}>
          <Link to="/teacher/login" style={buttonStyle}>LOGIN</Link>
        </div>
        {/* Cell 10 */}
        <div key={10} style={cellStyle}></div>
        {/* Merged last row cell for 13 and 14 */}
        <div style={mergedLastRowCellStyle} key="merged-13-14">
          <span style={titleStyle} className="kms-title">KNOW MY STATUS</span>
        </div>
        {/* Merged last row cell for 15 and 16 with five round buttons */}
        <div style={mergedLastRowCellStyle2} key="merged-15-16">
          <div style={roundButtonsContainerStyle}>
            <Link to="/" style={roundButtonStyle}><Home size={22} /></Link>
            <Link to="/student" style={roundButtonStyle}><User size={22} /></Link>
            <Link to="/qr" style={roundButtonStyle}><QrCode size={22} /></Link>
            <Link to="/settings" style={roundButtonStyle}><Settings size={22} /></Link>
            {isAuthenticated ? (
              <button
                style={roundButtonStyle}
                onClick={() => { logout(); setIsMenuOpen(false); }}
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            ) : (
              <Link
                to="/teacher/login"
                style={roundButtonStyle}
                title="Login"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={22} style={{ transform: 'scaleX(-1)' }} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
