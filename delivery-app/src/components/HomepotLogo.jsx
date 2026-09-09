import React from 'react';

export default function HomepotLogo({ size = 'md', className = '', showText = true }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-28 h-28'
  };

  const textClasses = {
    sm: 'text-[9px]',
    md: 'text-xs',
    lg: 'text-sm font-semibold',
    xl: 'text-base font-bold'
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full border-[1.5px] border-[#333C3E]/80 bg-white flex flex-col items-center justify-center p-1.5 shadow-sm transition-transform hover:scale-105 duration-200`}>
        {/* Roof / Eaves Accent Shape */}
        <svg viewBox="0 0 100 85" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Eaves chevron top */}
          <path 
            d="M 50 8 L 22 28 L 30 28 L 50 14 L 70 28 L 78 28 Z" 
            fill="#333C3E" 
          />
          {/* Gentle steam curls */}
          <path 
            d="M 44 26 C 42 20, 48 18, 46 12" 
            stroke="#BD7553" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity="0.8"
          />
          <path 
            d="M 54 26 C 52 20, 58 18, 56 12" 
            stroke="#BD7553" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity="0.8"
          />
          
          {/* Pot Lid handle */}
          <ellipse cx="50" cy="32" rx="4" ry="2" fill="#8B3A1C" />
          
          {/* Pot Lid */}
          <path 
            d="M 32 36 Q 50 30 68 36 L 70 38 Q 50 35 30 38 Z" 
            fill="#A04A26" 
          />
          
          {/* Traditional Clay Pot (Matka/Handi body) */}
          <path 
            d="M 30 38 
               Q 18 52 32 64 
               Q 50 68 68 64 
               Q 82 52 70 38 
               Z" 
            fill="#9C4A28" 
          />
          {/* Pot highlight & handles */}
          <path 
            d="M 28 44 Q 24 45 27 48" 
            stroke="#5A2411" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M 72 44 Q 76 45 73 48" 
            stroke="#5A2411" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          {/* Warm sheen */}
          <path 
            d="M 36 45 Q 40 54 44 59" 
            stroke="#F5E5DC" 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.4" 
          />
          {/* Base shadow */}
          <ellipse cx="50" cy="65" rx="14" ry="2.5" fill="#5A2411" opacity="0.4" />
        </svg>

        {showText && (
          <span className={`font-serif tracking-tight text-[#333C3E] -mt-0.5 ${textClasses[size]}`}>
            HomePot
          </span>
        )}
      </div>
    </div>
  );
}
