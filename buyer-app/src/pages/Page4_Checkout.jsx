import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Checkout({ onBack, onOrderPlaced }) {
  return (
    <div className="flex-1 p-4 bg-[#FFFDF9] flex flex-col justify-between select-none">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DA]">
          <button onClick={onBack} className="p-1"><ArrowLeft className="w-5 h-5 text-[#2C2420]" /></button>
          <h2 className="font-bold text-sm text-[#2C2420]">Your Pot (Cart)</h2>
          <div className="w-5" />
        </div>
        <div className="mt-4 p-3 bg-white rounded-2xl border border-[#F0E6DA] shadow-sm">
          <h3 className="font-bold text-xs text-[#2C2420]">Order Summary</h3>
          <p className="text-[11px] text-[#736357] mt-1">1x Authentic Chettinad Chicken Curry</p>
          <p className="text-sm font-extrabold text-[#A84D2F] mt-2">Total: ₹100</p>
        </div>
      </div>
      <button onClick={onOrderPlaced} className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#256829] text-white font-bold text-xs uppercase rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-4 h-4" /> Place Order
      </button>
    </div>
  );
}