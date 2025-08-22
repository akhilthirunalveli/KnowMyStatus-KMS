import React from 'react';
import './index.css';

const LoadingBar = ({ text = 'Loading...', barClass = '' }) => (
  <div className="flex flex-col items-center justify-center w-full py-4">
    <div className={`kms-loading-bar w-48 h-2 ${barClass}`}></div>
    <span className="mt-2 text-red-500 text-sm font-medium tracking-wide">{text}</span>
  </div>
);

export default LoadingBar;
