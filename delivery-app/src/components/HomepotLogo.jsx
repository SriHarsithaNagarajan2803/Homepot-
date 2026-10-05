import React from 'react';
import deliveryLogo from '../assets/homepot-delivery-logo.jpeg';

export default function HomepotLogo({ size = 'md', className = '', showText = true }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size] || sizeClasses.md} rounded-2xl border border-[#EADBCC] bg-white flex items-center justify-center overflow-hidden shadow-sm transition-transform hover:scale-105 duration-200`}>
        <img 
          src={deliveryLogo} 
          alt="HomePot Delivery Partner Logo" 
          className="w-full h-full object-cover" 
        />
      </div>
      {showText && (
        <span className="font-serif font-bold text-xs text-[#2C231E] mt-1 tracking-tight">
          HomePot Delivery
        </span>
      )}
    </div>
  );
}
