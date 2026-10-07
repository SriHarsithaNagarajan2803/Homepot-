import React, { useRef, useEffect, useState } from 'react';
import splashVideo from '../assets/splash-video.mp4';

export default function BuyerSplashScreen({ onFinish }) {
  const videoRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleFinish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 500); // 500ms smooth crossfade exit
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure browser autoplay policy is satisfied directly on HTML DOM node
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.playbackRate = 1.0;

      const playVideo = () => {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch((err) => {
            console.warn('Autoplay prevented, retrying with explicit muted:', err);
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      };

      playVideo();
      video.addEventListener('canplay', playVideo);

      return () => {
        video.removeEventListener('canplay', playVideo);
      };
    }
  }, []);

  // 4-second natural auto-transition
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`w-full max-w-[500px] h-full max-h-screen bg-white flex flex-col items-center justify-between px-6 py-6 sm:py-8 select-none overflow-hidden transition-all duration-500 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100 animate-fadeIn'
      }`}
    >
      {/* Top Header: Clean Centered Branding on Plain White Background */}
      <div className="w-full flex justify-center items-center pt-1 z-20">
        <span className="font-serif font-bold text-sm tracking-[0.25em] text-[#8C4A32] opacity-85 uppercase">
          HOMEPOT
        </span>
      </div>

      {/* DEAD-CENTER CONTAINER: Large, Crisp, Borderless Animated Video on Pure White */}
      <div className="flex-1 flex flex-col items-center justify-center w-full my-auto z-10 overflow-hidden">
        <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 max-w-[85vw] max-h-[46vh] aspect-square flex items-center justify-center relative overflow-hidden">
          <video
            ref={videoRef}
            src={splashVideo}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            style={{
              WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 80.8%, transparent 82.4%)',
              maskImage: 'radial-gradient(circle at center, black 0%, black 80.8%, transparent 82.4%)'
            }}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      </div>

      {/* Bottom Footer: Tagline & 4-Second Animated Progress Bar */}
      <div className="w-full pb-2 sm:pb-4 flex flex-col items-center text-center space-y-2.5 z-20">
        <div className="space-y-0.5">
          <p className="font-serif font-bold text-base sm:text-lg text-[#2C1D14] tracking-tight">
            Mom-Cooked Warm Meals
          </p>
          <p className="text-[10px] sm:text-[11px] font-bold text-[#8C4A32] tracking-widest uppercase">
            DIRECT FROM AMMA'S KITCHEN NEAR YOU
          </p>
        </div>

        {/* 4-Second Smooth Progress Line */}
        <div className="w-40 sm:w-48 h-1 bg-stone-100 rounded-full overflow-hidden mx-auto mt-1 border border-stone-200/50">
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
