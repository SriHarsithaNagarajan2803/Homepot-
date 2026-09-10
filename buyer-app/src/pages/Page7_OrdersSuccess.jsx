import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function OrdersSuccess({ onViewTracking }) {
  return (
    <div className="flex-1 p-4 bg-[#FFFDF9] flex flex-col items-center justify-center text-center select-none min-h-full">
      <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h2 className="font-serif font-bold text-xl text-[#2C1D14]">Order Placed Successfully! 🎉</h2>
      <p className="text-xs text-[#736357] mt-1 max-w-xs">
        Your order has been sent to Amma's kitchen. Fresh cooking is underway!
      </p>
      
      <button 
        onClick={onViewTracking}
        className="mt-6 w-full max-w-xs py-3.5 bg-[#A0523D] hover:bg-[#8C4A32] text-white font-bold text-xs uppercase rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
      >
        Track Live Pot
      </button>
    </div>
  );
}