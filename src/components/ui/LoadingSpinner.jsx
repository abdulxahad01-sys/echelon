import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-black'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-[#A17E3C] mx-auto ${sizeClasses[size]}`}></div>
        {text && (
          <p className="mt-4 text-white/70 font-['Jost'] text-sm md:text-base">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;