import React from 'react';
import { Home, Wallet, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function DeliveryNavbar({ activeTab = 'home', onTabChange }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const tabs = [
    {
      id: 'home',
      label: t('home'),
      icon: Home,
      path: '/radar'
    },
    {
      id: 'payout',
      label: t('payout'),
      icon: Wallet,
      path: '/payout'
    },
    {
      id: 'profile',
      label: t('profile'),
      icon: User,
      path: '/profile'
    }
  ];

  const handleSelect = (tab) => {
    if (onTabChange) {
      onTabChange(tab.id);
    }
    navigate(tab.path);
  };

  return (
    <nav 
      aria-label="Rider Navigation"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-40 bg-[#F3ECE0]/95 backdrop-blur-md border border-[#EADBCC] rounded-3xl py-2 px-6 shadow-dock flex items-center justify-around transition-all"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentPath === tab.path || (tab.id === 'home' && (currentPath === '/radar' || currentPath === '/'));
        
        return (
          <button
            key={tab.id}
            onClick={() => handleSelect(tab)}
            className={`flex flex-col items-center justify-center transition-all duration-200 group relative px-3 py-1 cursor-pointer ${
              isActive ? 'text-[#333C3E]' : 'text-[#7C746E] hover:text-[#333C3E]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#8C4A32]/10 -translate-y-0.5' : 'group-hover:-translate-y-0.5'}`}>
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2.5 : 1.8} 
                className={isActive ? 'text-[#8C4A32]' : 'text-[#6C645E]'} 
              />
            </div>
            <span className={`text-[11px] font-medium tracking-tight mt-0.5 ${isActive ? 'font-bold text-[#333C3E]' : ''}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A32] absolute -bottom-1"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
