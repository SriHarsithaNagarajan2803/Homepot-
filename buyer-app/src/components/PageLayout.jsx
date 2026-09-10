import React from 'react';
import BottomNav from './BottomNav';

export default function PageLayout({ children }) {
  return (
    <div 
      className="min-h-screen w-full flex justify-center items-center py-4 px-2 sm:px-4"
      style={{ backgroundColor: '#EFE9DF', colorScheme: 'light' }}
    >
      {/* Mobile Card Frame */}
      <div 
        className="w-full max-w-md h-[92vh] max-h-[850px] border border-[#E8DEC8] rounded-3xl shadow-2xl flex flex-col justify-between overflow-y-auto relative text-stone-900 pb-16"
        style={{ backgroundColor: '#FFFFFF', colorScheme: 'light' }}
      >
        
        {/* Layer 2: Soft Grey Dot Pattern Overlay */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#D6C7B2 1.2px, transparent 1.2px)',
            backgroundSize: '20px 20px'
          }}
        ></div>

        {/* Content Layer */}
        <div className="flex flex-col flex-1 relative z-10 overflow-y-auto">
          {children}
        </div>

        {/* Persistent Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  );
}