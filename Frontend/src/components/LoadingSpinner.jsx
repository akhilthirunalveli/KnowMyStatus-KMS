import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-app-accent`} />
      {text && (
        <p className="mt-4 text-app-text-muted text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 