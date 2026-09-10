import React from 'react';
import { FiMapPin, FiSearch, FiShoppingBag, FiChevronDown } from 'react-icons/fi';

export default function Navbar({ cartCount = 2, onCartClick, location = "Anna Nagar, Flat 4B" }) {
  return (
    <header className="sticky top-0 z-50 bg-[#FBF8F3] border-b border-[#E6D7C3] px-4 py-3 shadow-xs">
      <div className="max-w-md mx-auto flex flex-col gap-3">
        
        {/* Top Row: Location & Cart Icon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <FiMapPin className="text-[#8C4A32] text-lg shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#7A6B5D] font-medium">Delivering to</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-[#2C1D14] truncate max-w-[200px]">{location}</span>
                <FiChevronDown className="text-[#2C1D14] text-xs" />
              </div>
            </div>
          </div>

          {/* Cart Icon with Counter Badge */}
          <button 
            onClick={onCartClick} 
            className="relative p-2 rounded-full bg-[#F3ECE1] border border-[#E0D0BB] text-[#8C4A32] hover:bg-[#EBDDC9] transition-colors"
          >
            <FiShoppingBag className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D9534F] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar Row */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6B5D] text-base" />
          <input 
            type="text" 
            placeholder="Search sambar rice, parathas, thali..." 
            className="w-full bg-[#F3ECE1] border border-[#E0D0BB] rounded-full py-2.5 pl-10 pr-4 text-sm text-[#2C1D14] placeholder-[#7A6B5D] focus:outline-none focus:ring-2 focus:ring-[#8C4A32]/40"
          />
        </div>

      </div>
    </header>
  );
}