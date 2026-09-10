import React from 'react';
import PageLayout from '../components/PageLayout';
import { FiMapPin } from 'react-icons/fi';
import tiffinArt from '../../logo/tiffin-box.jpeg';
import logoImg from '../../logo/HomePot-logo.jpeg';

export default function Login({ onLoginSuccess }) {
  return (
    <PageLayout>
      <div className="flex flex-col justify-between h-full p-6 sm:p-8">
        
        {/* Top Branding & Inputs Container */}
        <div className="flex flex-col items-center text-center pt-2">
          
          {/* Logo Image Badge */}
          <div className="w-16 h-16 rounded-full bg-white border border-[#E2D5BE] shadow-md flex items-center justify-center overflow-hidden mb-2">
            <img 
              src={logoImg} 
              alt="HomePot Logo" 
              className="w-full h-full object-cover mix-blend-multiply" 
            />
          </div>
          
          <h1 className="font-serif font-bold text-4xl text-[#2C1D14] mt-2 tracking-tight">Taste of Home</h1>
          <p className="text-base font-semibold text-[#6B5B4F] mt-2.5 leading-relaxed">
            Authentic Meals<br />
            Hygienic Home Cooking<br />
            From Your Neighborhood Chefs
          </p>

          {/* Fully Borderless Blended Tiffin Illustration */}
          <div className="my-4 w-full flex items-center justify-center">
            <img 
              src={tiffinArt} 
              alt="Tiffin Art" 
              className="w-full h-52 object-contain mix-blend-multiply filter contrast-105"
            />
          </div>

          {/* Fully Interactive Address Input Box */}
          <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs mt-2">
            <div className="p-3 bg-[#EFE3D0] rounded-full text-[#8C4A32] shrink-0">
              <FiMapPin className="text-base font-bold" />
            </div>
            <div className="flex flex-col text-left flex-1 min-w-0">
              <span className="text-[11px] font-bold text-[#593222] tracking-wide uppercase">Find Home Chefs Near Me</span>
              <input 
                type="text" 
                placeholder="Enter your address..." 
                className="bg-transparent text-sm text-[#2C1D14] placeholder-[#A39281] focus:outline-none mt-0.5 w-full font-medium"
              />
            </div>
          </div>
        </div>

        {/* Responsive Bottom Action Buttons */}
        <div className="flex flex-col gap-3.5 pt-8 w-full mt-auto">
          <button 
            onClick={onLoginSuccess}
            className="w-full bg-[#A0523D] hover:bg-[#8C4A32] text-white font-semibold text-base py-4 rounded-full shadow-md transition-all tracking-wide cursor-pointer active:scale-95"
          >
            Continue with Phone / OTP
          </button>

          <button 
            onClick={onLoginSuccess}
            className="w-full bg-white/90 hover:bg-[#F4EFE6] border border-[#E2D5BE] text-[#2C1D14] font-semibold text-base py-4 rounded-full shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95 backdrop-blur-xs"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.14v3.15C3.16 21.2 7.23 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.14C.41 8.07 0 9.73 0 12s.41 3.93 1.14 5.4l4.14-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.16 2.8 1.14 6.6l4.14 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
            </svg>
            Continue with Google
          </button>
        </div>

      </div>
    </PageLayout>
  );
}