
import React from 'react';
import '../../index.css';
import { MoonLoader } from 'react-spinners';


const LoadingBar = ({ text = '', barClass = '' }) => (
  <div className="flex flex-col items-center justify-center w-full py-4">
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-transparent"
      style={{ minHeight: '100vh' }}
    >
      <MoonLoader color="#ff0000" size={40} className={barClass} />
      <span className="mt-2 text-red-500 text-sm font-medium tracking-wide">{text}</span>
    </div>
  </div>
);

export default LoadingBar;
