import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import RiderIllustration from '../components/RiderIllustration';

export default function WelcomeLanding() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[780px] h-full flex flex-col justify-between items-center px-6 py-8 overflow-hidden bg-[#FAF6EE]">
      {/* Decorative Wavy Background Bands (matching page1.jpeg) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg 
          viewBox="0 0 500 800" 
          preserveAspectRatio="none" 
          className="w-full h-full opacity-60"
        >
          {/* Broad soft wave */}
          <path 
            d="M -50 480 Q 150 430 250 500 T 550 460 L 550 560 Q 350 620 150 540 T -50 600 Z" 
            fill="#F5E5DC" 
          />
          {/* Terracotta accent wave ribbon */}
          <path 
            d="M -50 540 Q 180 500 270 560 T 550 520 L 550 565 Q 320 620 130 570 T -50 630 Z" 
            fill="#E8C9B8" 
          />
        </svg>
      </div>

      {/* Top Brand Section */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2">
        <HomepotLogo size="lg" className="mb-4" />
        
        <h1 className="font-serif text-3xl sm:text-4xl text-[#333C3E] font-bold text-center tracking-tight leading-snug">
          Start Your Journey
        </h1>
        <p className="text-[#6C645E] text-sm sm:text-base font-medium mt-1 text-center">
          Deliver Fresh Home Food & Earn
        </p>
      </div>

      {/* Center Illustration & Floating Highlights */}
      <div className="relative z-10 w-full flex flex-col items-center my-auto py-2">
        {/* Floating Highlight Badges */}
        <div className="w-full max-w-xs flex justify-between items-center px-2 mb-1">
          {/* Earnings Badge (Left) */}
          <div className="bg-[#D99436]/90 text-white px-3.5 py-2 rounded-2xl shadow-sm transform -rotate-3 hover:rotate-0 transition-transform flex flex-col items-start leading-tight">
            <span className="font-bold text-base tracking-tight">₹500+</span>
            <span className="text-[11px] opacity-95 font-medium">daily earnings</span>
          </div>

          {/* Live Tracking Badge (Right) */}
          <div className="bg-[#333C3E]/90 text-[#FAF6EE] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-medium transform rotate-2 hover:rotate-0 transition-transform">
            <MapPin size={13} className="text-[#D99436]" />
            <span>Live Tracking</span>
          </div>
        </div>

        {/* Rider On Scooter Illustration */}
        <RiderIllustration className="w-full max-w-[280px] my-2" />
      </div>

      {/* Bottom CTA Actions */}
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-3.5 pb-2">
        {/* LOGIN Button */}
        <button
          onClick={() => navigate('/login?mode=login')}
          className="w-full py-3.5 px-6 rounded-full bg-[#9C4A28] hover:bg-[#8B3A1C] active:scale-[0.98] text-white font-semibold text-sm tracking-wider uppercase shadow-md transition-all duration-200"
        >
          LOGIN
        </button>

        {/* JOIN US / SIGN UP Button */}
        <button
          onClick={() => navigate('/login?mode=signup')}
          className="w-full py-3.5 px-6 rounded-full bg-white/80 hover:bg-white border-2 border-[#9C4A28] text-[#9C4A28] active:scale-[0.98] font-semibold text-sm tracking-wider uppercase shadow-sm transition-all duration-200"
        >
          JOIN US / SIGN UP
        </button>

        {/* Legal Disclaimer */}
        <p className="text-[#8C847E] text-[11px] text-center mt-2 leading-relaxed max-w-xs">
          Terms and Privacy under the terms and Privacy list below.
        </p>
      </div>
    </div>
  );
}
