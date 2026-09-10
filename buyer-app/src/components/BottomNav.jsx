import React from 'react';
import { FiClock, FiMenu, FiCreditCard, FiUser } from 'react-icons/fi';

export default function BottomNav() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#FAF5EE] border-t border-[#E2D5BE] py-2 px-6 flex justify-between items-center z-50 shadow-md">
      <div className="flex flex-col items-center gap-0.5 cursor-pointer text-[#8C4A32]">
        <FiClock className="text-base" />
        <span className="text-[10px] font-bold">Live Orders</span>
      </div>
      <div className="flex flex-col items-center gap-0.5 cursor-pointer text-[#8C4A32]">
        <FiMenu className="text-base" />
        <span className="text-[10px] font-bold">Menu</span>
      </div>
      <div className="flex flex-col items-center gap-0.5 cursor-pointer text-[#8C4A32]">
        <FiCreditCard className="text-base" />
        <span className="text-[10px] font-bold">Bankings</span>
      </div>
      <div className="flex flex-col items-center gap-0.5 cursor-pointer text-[#8C4A32]">
        <FiUser className="text-base" />
        <span className="text-[10px] font-bold">Impine</span>
      </div>
    </div>
  );
}