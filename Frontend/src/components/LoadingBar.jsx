import React from 'react';
import '../index.css';


const spinnerStyle = {
  width: '2.5rem',
  height: '2.5rem',
  border: '4px solid #f87171', // Tailwind red-400
  borderTop: '4px solid transparent',
  borderRadius: '50%',
  animation: 'kms-spin 1s linear infinite',
};

// Add keyframes for spinner animation
const styleSheet = document?.head && document.getElementById('kms-spinner-style') == null ? (() => {
  const style = document.createElement('style');
  style.id = 'kms-spinner-style';
  style.innerHTML = `@keyframes kms-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
  return style;
})() : null;

const LoadingBar = ({ text = 'Loading...', barClass = '' }) => (
  <div className="flex flex-col items-center justify-center w-full py-4">
    <div
      className={barClass}
      style={spinnerStyle}
      aria-label="Loading spinner"
    ></div>
    <span className="mt-2 text-red-500 text-sm font-medium tracking-wide">{text}</span>
  </div>
);

export default LoadingBar;
