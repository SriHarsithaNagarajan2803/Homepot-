import React, { useRef, useEffect, useState } from 'react';
import splashVideo from '../assets/splash-video.mp4';

export default function BuyerSplashScreen({ onFinish }) {
  const videoRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 600); // 600ms smooth crossfade exit
  };

  useEffect(() => {
    // 4-second duration at natural 1.0x playback speed
    const timer = setTimeout(() => {
      handleFinish();
    }, 4000);

    // Natural 1.0x playback rate (no rushing, full 4 seconds)
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay note:', err);
      });
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`absolute inset-0 z-50 bg-[#FAF6EE] flex flex-col items-center justify-between p-6 select-none overflow-hidden transition-all duration-600 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100 animate-fadeIn'
      }`}
    >
      {/* Top Header with Discreet Skip Button */}
      <div className="w-full flex justify-between items-center pt-2 z-10">
        <span className="font-serif font-bold text-sm tracking-widest text-[#8C4A32] opacity-80 uppercase">
          HomePot
        </span>
        <button
          onClick={handleFinish}
          className="text-xs font-bold text-[#8C4A32] bg-white/90 hover:bg-white border border-[#E2D5BE] px-3.5 py-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1"
        >
          <span>Skip</span>
          <span>➔</span>
        </button>
      </div>

      {/* Main 4-Sec Video Animation - Clean & Borderless (NO Box, NO Border, NO Shadow) */}
      <div className="w-full max-w-[340px] sm:max-w-[380px] aspect-square flex items-center justify-center my-auto relative">
        <video
          ref={videoRef}
          src={splashVideo}
          autoPlay
          muted
          playsInline
          onEnded={handleFinish}
          className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
        />
      </div>

      {/* Bottom Tagline & 4-Second Animated Progress Bar */}
      <div className="text-center pb-6 space-y-3 z-10 w-full px-4">
        <div className="space-y-1">
          <p className="font-serif font-bold text-lg sm:text-xl text-[#2C1D14] tracking-tight">
            Mom-Cooked Warm Meals
          </p>
          <p className="text-[11px] font-bold text-[#8C4A32] tracking-widest uppercase">
            Direct from Amma's Kitchen Near You
          </p>
        </div>

        {/* 4-Second Animated Progress Bar */}
        <div className="w-40 sm:w-48 h-1 bg-[#E8DEC8] rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-[#8C4A32] rounded-full"
            style={{
              animation: 'splashProgress 4s linear forwards'
            }}
          />
        </div>
      </div>
    </div>
  );
}
