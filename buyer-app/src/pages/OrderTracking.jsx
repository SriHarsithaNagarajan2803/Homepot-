import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function OrderTracking({ onBack }) {
  return (
    <div className="flex-1 p-4 bg-[#FFFDF9] flex flex-col select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DA]">
        <button onClick={onBack} className="p-1"><ArrowLeft className="w-5 h-5 text-[#2C2420]" /></button>
        <h2 className="font-bold text-sm text-[#2C2420]">Live Pot Tracking</h2>
        <div className="w-5" />
      </div>
      <div className="mt-6 flex flex-col items-center text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center text-2xl">🍲</div>
        <h3 className="font-bold text-sm text-[#2C2420]">Amma is Simmering your food</h3>
        <p className="text-xs text-[#736357]">Estimated delivery: 25 mins</p>
      </div>
    </div>
  );
}