import React from 'react';
import { FiMenu, FiShoppingBag, FiUser } from 'react-icons/fi';

export default function BottomNav({ activeTab = 'feed', onSelectTab, cartCount = 0 }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#FAF5EE] border-t border-[#E2D5BE] px-6 flex justify-around items-center z-50 shadow-md">
      {/* 1. Menu Tab */}
      <button 
        type="button"
        onClick={() => onSelectTab && onSelectTab('feed')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
          activeTab === 'feed' || activeTab === 'menu' ? 'text-[#8C4A32] font-bold' : 'text-[#7C746E]'
        }`}
      >
        <FiMenu className="text-lg" />
        <span className="text-[10px] font-bold">Menu</span>
      </button>

      {/* 2. My Tiffin Tab with Live Counter */}
      <button 
        type="button"
        onClick={() => onSelectTab && onSelectTab('checkout')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors relative ${
          activeTab === 'checkout' || activeTab === 'tiffin' || activeTab === 'cart' ? 'text-[#8C4A32] font-bold' : 'text-[#7C746E]'
        }`}
      >
        <div className="relative">
          <FiShoppingBag className="text-lg" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-[#8C4A32] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-bounce">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold">My Tiffin</span>
      </button>

      {/* 3. Profile Tab */}
      <button 
        type="button"
        onClick={() => onSelectTab && onSelectTab('profile')}
        className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
          activeTab === 'profile' ? 'text-[#8C4A32] font-bold' : 'text-[#7C746E]'
        }`}
      >
        <FiUser className="text-lg" />
        <span className="text-[10px] font-bold">Profile</span>
      </button>
    </div>
  );
}
