import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function SpecialRequest({ onBack }) {
  return (
    <div className="flex-1 p-4 bg-[#FFFDF9] flex flex-col select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DA]">
        <button onClick={onBack} className="p-1"><ArrowLeft className="w-5 h-5 text-[#2C2420]" /></button>
        <h2 className="font-bold text-sm text-[#2C2420]">Special Craving Request</h2>
        <div className="w-5" />
      </div>
      <div className="mt-4 p-3 bg-white rounded-2xl border border-[#F0E6DA] shadow-sm">
        <p className="text-xs text-[#736357]">Tell neighborhood chefs what custom food you crave today.</p>
      </div>
    </div>
  );
}