import React, { useState } from 'react';

export default function Login({ address, setAddress, onLoginSuccess }) {
  const [localAddress, setLocalAddress] = useState(address || '');

  const handleAction = (e) => {
    e.preventDefault();
    if (setAddress) setAddress(localAddress);
    if (onLoginSuccess) onLoginSuccess(localAddress);
  };

  return (
    <div className="w-full min-h-screen !bg-[#FAF5EE] flex items-center justify-center p-2 sm:p-6 relative select-none font-sans overflow-y-auto">
      
      {/* 1. Fluid Moving Pastel Aurora / Mesh Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden !bg-[#FAF5EE]">
        <div className="animate-wave-1 absolute -top-32 -left-20 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#FFD3C4] via-[#FFBC99] to-[#FFE9E0] blur-[110px] opacity-75 mix-blend-multiply" />
        <div className="animate-wave-2 absolute -bottom-32 -right-20 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#FFE7A8] via-[#FFD68A] to-[#FFF6DC] blur-[120px] opacity-80 mix-blend-multiply" />
        <div className="animate-wave-3 absolute top-1/4 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-r from-[#D7EED6] via-[#E8F6E6] to-[#CBE7C9] blur-[100px] opacity-70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(#8E583C15_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      {/* 2. Centered App Device Container */}
      <div className="relative z-10 w-full max-w-[420px] my-auto bg-[#FAF7F0] sm:rounded-[36px] shadow-2xl shadow-[#8E3F25]/20 border border-white/80 ring-1 ring-[#EADBCE]/80 overflow-hidden">
        
        {/* Container wrapper for image and precise interactive overlays */}
        <div className="relative w-full">
          
          {/* Your original graphic showing the tiffin and buttons */}
          <img 
            src="/page1-bg.jpeg" 
            alt="HomePot Taste of Home" 
            className="w-full h-auto object-contain block pointer-events-none"
          />

          {/* 3. Invisible Input Overlay placed directly over the image's address bar */}
          <div className="absolute inset-x-8 bottom-[108px] sm:bottom-[122px] z-20">
            <input 
              type="text" 
              value={localAddress}
              onChange={(e) => setLocalAddress(e.target.value)}
              placeholder="Enter your address..." 
              className="w-full py-3 px-4 rounded-xl bg-white/95 backdrop-blur-sm text-xs text-[#2C2420] font-semibold focus:outline-none focus:ring-2 focus:ring-[#A84D2F] shadow-sm"
            />
          </div>

          {/* 4. Clickable Click-Zones over the image buttons */}
          <div className="absolute inset-x-8 bottom-[58px] sm:bottom-[65px] h-10 z-20">
            <button 
              onClick={handleAction}
              className="w-full h-full opacity-0 cursor-pointer"
              title="Continue with Phone / OTP"
            />
          </div>

          <div className="absolute inset-x-8 bottom-[12px] sm:bottom-[15px] h-10 z-20">
            <button 
              onClick={handleAction}
              className="w-full h-full opacity-0 cursor-pointer"
              title="Continue with Google"
            />
          </div>

        </div>

      </div>

    </div>
  );
}