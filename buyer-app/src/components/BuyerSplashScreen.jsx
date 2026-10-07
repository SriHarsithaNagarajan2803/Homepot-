import React, { useRef, useEffect, useState } from 'react';
import splashVideo from '../assets/splash-video.mp4';

export default function BuyerSplashScreen({ onFinish }) {
  const videoRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 600); // 600ms smooth crossfade exit
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure browser autoplay policy is 100% satisfied directly on HTML DOM node
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.playbackRate = 1.0;

      const playVideo = () => {
        const promise = video.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.warn('Initial autoplay prevented, retrying muted play:', err);
              video.muted = true;
              video.play().then(() => setIsPlaying(true)).catch(() => {});
            });
        }
      };

      playVideo();
      video.addEventListener('canplay', playVideo);
      video.addEventListener('playing', () => setIsPlaying(true));

      return () => {
        video.removeEventListener('canplay', playVideo);
        video.removeEventListener('playing', () => setIsPlaying(true));
      };
    }
  }, []);

  // 4-second auto-transition to main app
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFinish();
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 sm:absolute z-50 bg-[#FAF6EE] flex flex-col items-center justify-between p-6 select-none overflow-hidden transition-all duration-600 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100 animate-fadeIn'
      }`}
    >
      {/* Top Header: Clean Branding & Skip Button */}
      <div className="w-full flex justify-between items-center pt-2 sm:pt-4 z-20">
        <span className="font-serif font-bold text-sm tracking-widest text-[#8C4A32] opacity-80 uppercase">
          HOMEPOT
        </span>
        <button
          onClick={handleFinish}
          className="text-xs font-bold text-[#8C4A32] bg-white/90 hover:bg-white border border-[#E2D5BE] px-3.5 py-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1"
        >
          <span>Skip</span>
          <span>➔</span>
        </button>
      </div>

      {/* DEAD-CENTER CONTAINER: Large, Neat & Live Animated Logo */}
      <div className="flex-1 flex flex-col items-center justify-center w-full my-auto z-10">
        <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 aspect-square flex items-center justify-center relative overflow-hidden">
          <video
            ref={videoRef}
            src={splashVideo}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            className="w-full h-full object-cover mix-blend-multiply pointer-events-none"
          />
        </div>
      </div>

      {/* Bottom Footer: Tagline & 4-Second Animated Progress Bar */}
      <div className="w-full pb-6 sm:pb-8 flex flex-col items-center text-center space-y-3 z-20">
        <div className="space-y-1">
          <p className="font-serif font-bold text-lg sm:text-xl text-[#2C1D14] tracking-tight">
            Mom-Cooked Warm Meals
          </p>
          <p className="text-[11px] font-bold text-[#8C4A32] tracking-widest uppercase">
            DIRECT FROM AMMA'S KITCHEN NEAR YOU
          </p>
        </div>

        {/* 4-Second Smooth Progress Line */}
        <div className="w-44 sm:w-52 h-1 bg-[#E8DEC8] rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-[#8C4A32] rounded-full"
            style={{
              animation: 'splashProgress 4.2s linear forwards'
            }}
          />
        </div>
      </div>
    </div>
  );
}
