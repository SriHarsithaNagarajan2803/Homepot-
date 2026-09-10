import React from 'react';
import { FiStar } from 'react-icons/fi';

export default function FoodCard({ dish, onAdd }) {
  return (
    <div className="bg-[#FBF8F3] border border-[#E6D7C3] rounded-2xl p-3.5 shadow-xs flex gap-3 relative">
      
      {/* Left side: Dish info */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          {/* Dietary Badge */}
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
            dish.isVeg 
              ? 'bg-[#EAF3DE] text-[#3B6D11] border-[#C0DD97]' 
              : 'bg-[#FCE8E6] text-[#A51D24] border-[#F4C0BE]'
          }`}>
            {dish.isVeg ? '🌱 Veg' : '🌶️ Non-veg'}
          </span>

          <h3 className="font-serif font-bold text-sm text-[#2C1D14] mt-1">{dish.title}</h3>
          <p className="text-xs text-[#7A6B5D] mt-0.5">Cooked by {dish.cookName}</p>
          
          <div className="flex items-center gap-1 text-xs text-[#593222] mt-1 font-medium">
            <span className="flex items-center text-[#B26B00] font-bold">
              <FiStar className="mr-0.5 fill-[#B26B00]" /> {dish.rating}
            </span>
            <span className="text-[#A39281]">({dish.ordersCount}+ orders)</span>
          </div>
        </div>

        {/* Price and Add button */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0E6D8]">
          <div>
            <span className="font-serif font-bold text-base text-[#2C1D14]">₹{dish.price}</span>
            <div className="text-[10px] text-[#AD6800] font-semibold bg-[#FFF8E7] px-1.5 py-0.2 rounded-xs inline-block ml-1">
              Only {dish.portionsLeft} left!
            </div>
          </div>

          <button 
            onClick={() => onAdd(dish)}
            className="bg-[#8C4A32] hover:bg-[#733A26] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            + ADD
          </button>
        </div>

      </div>
    </div>
  );
}