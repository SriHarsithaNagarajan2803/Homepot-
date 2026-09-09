import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Sparkles } from 'lucide-react';

export default function DeviceFrame({ children, currentScreenName = '' }) {
  // Mode: 'mobile' | 'tablet' | 'desktop'
  const [deviceMode, setDeviceMode] = useState('mobile');

  return (
    <div className="min-h-screen bg-[#F4EFE6] flex flex-col items-center">
      {/* PC / Laptop Top Control Bar - Only visible on medium/large screens (>= md) */}
      <header className="w-full bg-[#333C3E] text-white py-2 px-4 shadow-sm z-50 flex flex-wrap items-center justify-between gap-3 text-xs hidden md:flex border-b border-[#22292A]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span className="font-medium text-[#FAF6EE] tracking-wide">HomePot Delivery Partner UI</span>
          {currentScreenName && (
            <span className="bg-[#FAF6EE]/15 text-[#F5E5DC] px-2 py-0.5 rounded-full text-[10px]">
              Screen: {currentScreenName}
            </span>
          )}
        </div>

        {/* Viewport Switcher Buttons */}
        <div className="flex items-center bg-[#22292A] rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              deviceMode === 'mobile'
                ? 'bg-[#9C4A28] text-white shadow-sm font-semibold'
                : 'text-[#DAC9B4] hover:text-white'
            }`}
            title="Mobile Device Preview"
          >
            <Smartphone size={14} />
            <span>Mobile (390px)</span>
          </button>

          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              deviceMode === 'tablet'
                ? 'bg-[#9C4A28] text-white shadow-sm font-semibold'
                : 'text-[#DAC9B4] hover:text-white'
            }`}
            title="Tablet Preview"
          >
            <Tablet size={14} />
            <span>Tablet (640px)</span>
          </button>

          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
              deviceMode === 'desktop'
                ? 'bg-[#9C4A28] text-white shadow-sm font-semibold'
                : 'text-[#DAC9B4] hover:text-white'
            }`}
            title="Responsive Full Width View"
          >
            <Monitor size={14} />
            <span>Full Responsive</span>
          </button>
        </div>

        <div className="text-[#DAC9B4] text-[11px] flex items-center gap-1">
          <Sparkles size={12} className="text-[#D99436]" />
          <span>Flexible across all screens</span>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="w-full flex-1 flex justify-center items-start p-0 md:py-6 overflow-x-hidden">
        {deviceMode === 'mobile' && (
          <div className="w-full md:w-[410px] md:min-h-[844px] md:max-h-[92vh] md:rounded-[42px] md:border-[10px] md:border-[#2B231E] md:shadow-2xl overflow-y-auto overflow-x-hidden relative bg-[#FAF6EE] flex flex-col transition-all duration-300">
            {/* Phone Speaker & Camera Notch (Desktop Preview) */}
            <div className="hidden md:flex justify-center items-center py-2 bg-[#FAF6EE] sticky top-0 z-30">
              <div className="w-20 h-4 bg-[#2B231E] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#3E484A] ml-8"></div>
              </div>
            </div>
            <div className="flex-1 flex flex-col">{children}</div>
          </div>
        )}

        {deviceMode === 'tablet' && (
          <div className="w-full md:w-[680px] md:min-h-[850px] md:max-h-[92vh] md:rounded-[36px] md:border-[10px] md:border-[#2B231E] md:shadow-2xl overflow-y-auto overflow-x-hidden relative bg-[#FAF6EE] flex flex-col transition-all duration-300">
            <div className="flex-1 flex flex-col">{children}</div>
          </div>
        )}

        {deviceMode === 'desktop' && (
          <div className="w-full max-w-5xl min-h-[85vh] bg-[#FAF6EE] md:rounded-3xl md:shadow-lg border border-[#EADBCC] overflow-hidden flex flex-col transition-all duration-300">
            <div className="flex-1 flex flex-col">{children}</div>
          </div>
        )}
      </main>
    </div>
  );
}
