import React, { useRef, useEffect } from 'react';
import splashVideo from '../assets/splash-video.mp4';
import logoImg from '../../logo/HomePot-logo.jpeg';

export default function BuyerSplashScreen({ onFinish }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // 2-second cap: auto-transition after 2 seconds
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2000);

    // Speed up playback to 2x so 4-second video plays completely in 2 seconds
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0;
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay note:', err);
      });
    }

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="absolute inset-0 z-50 bg-[#FAF6EE] flex flex-col items-center justify-between p-6 select-none animate-fadeIn overflow-hidden">
      {/* Top Branding */}
      <div className="w-full flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E2D5BE] shadow-xs flex items-center justify-center overflow-hidden">
            <img src={logoImg} alt="HomePot Logo" className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <span className="font-serif font-bold text-base text-[#2C1D14] tracking-tight">HomePot</span>
        </div>
        <button
          onClick={onFinish}
          className="text-xs font-semibold text-[#8C4A32] bg-white/80 hover:bg-white border border-[#E2D5BE] px-3 py-1 rounded-full shadow-2xs transition cursor-pointer"
        >
          Skip ➔
        </button>
      </div>

      {/* Main 2-Sec Video Animation */}
      <div className="w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden shadow-xl border-2 border-[#E2D5BE] bg-white flex items-center justify-center my-auto">
        <video
          ref={videoRef}
          src={splashVideo}
          autoPlay
          muted
          playsInline
          onEnded={onFinish}
          onLoadedMetadata={() => {
            if (videoRef.current) videoRef.current.playbackRate = 2.0;
          }}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Tagline */}
      <div className="text-center pb-4 space-y-1">
        <p className="font-serif font-bold text-base text-[#2C1D14]">Mom-Cooked Warm Meals</p>
        <p className="text-[11px] font-medium text-[#8C4A32] tracking-wider uppercase">Direct from Amma's Kitchen Near You</p>
      </div>
    </div>
  );
}
