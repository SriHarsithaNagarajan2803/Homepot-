import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Utensils, 
  BookOpen, 
  CreditCard, 
  User, 
  Flame, 
  Clock 
} from 'lucide-react';
import { DISHES } from '../data/dishes';

export default function HomeFeed({ address, cartCount, onSelectDish, onNavigateCart, onNavigateCraving }) {
  const [selectedSlot, setSelectedSlot] = useState('All');
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredDishes = DISHES.filter((dish) => {
    const matchesSlot = selectedSlot === 'All' || dish.mealType === selectedSlot;
    const matchesVeg = pureVegOnly ? dish.isVeg : true;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.chef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSlot && matchesVeg && matchesSearch;
  });

  return (
    <div className="flex-1 w-full flex flex-col bg-[#FFFDF9] select-none font-sans overflow-hidden">
      
      {/* 1. Header & Location Bar */}
      <header className="p-4 pb-3 border-b border-[#F0E6DA] bg-[#FFFDF9] space-y-3 shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F5EDE2] flex items-center justify-center text-[#A84D2F]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#736357]">Delivering To</p>
              <p className="text-xs font-bold text-[#2C2420] truncate max-w-[190px]">{address}</p>
            </div>
          </div>

          <button 
            onClick={onNavigateCart}
            className="relative p-2.5 bg-[#FAF4ED] hover:bg-[#F0E6DA] border border-[#EADBCE] rounded-2xl text-[#2C2420] active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#A84D2F]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#A84D2F] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search home sambar, parottas, thali..." 
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7F2EA] rounded-xl text-xs text-[#2C2420] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#A84D2F]/20 font-medium"
          />
        </div>

        {/* Meal Slot Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {['All', 'Lunch', 'Dinner'].map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSlot === slot 
                  ? 'bg-[#A84D2F] text-white shadow-sm' 
                  : 'bg-[#F5EDE2] text-[#736357] hover:bg-[#EADBCE]'
              }`}
            >
              {slot === 'All' ? '🔥 All Pots' : `${slot} Menu`}
            </button>
          ))}

          {/* Pure Veg Toggle */}
          <button
            onClick={() => setPureVegOnly(!pureVegOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap border transition-all ml-auto cursor-pointer ${
              pureVegOnly 
                ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]' 
                : 'bg-[#FAF6F0] text-[#736357] border-[#EADBCE]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${pureVegOnly ? 'bg-[#2E7D32]' : 'bg-stone-300'}`} />
            <span>Pure Veg</span>
          </button>
        </div>
      </header>

      {/* 2. Scrollable Dish Cards Feed */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3.5">
        
        {/* Craving Request Banner */}
        <div 
          onClick={onNavigateCraving}
          className="bg-gradient-to-r from-[#FAF6F0] to-[#F5ECE1] rounded-2xl p-3.5 border border-[#EADBCE] cursor-pointer hover:border-[#A84D2F] transition-all shadow-sm flex items-center justify-between"
        >
          <div className="pr-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A84D2F] bg-[#FFF0EB] px-2 py-0.5 rounded-full">
              Custom Craving?
            </span>
            <h4 className="font-bold text-xs text-[#2C2420] mt-1">Want something special today?</h4>
            <p className="text-[11px] text-[#736357]">Request custom dishes from neighborhood Ammas</p>
          </div>
          <span className="text-2xl shrink-0">✨</span>
        </div>

        {/* Dish List */}
        {filteredDishes.length === 0 ? (
          <div className="py-12 text-center text-stone-400">
            <p className="text-3xl">🍲</p>
            <p className="text-xs font-semibold mt-2">No home dishes match your search.</p>
          </div>
        ) : (
          filteredDishes.map((dish) => (
            <div 
              key={dish.id}
              onClick={() => onSelectDish(dish)}
              className="bg-white rounded-2xl border border-[#F0E6DA] p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3.5 group"
            >
              {/* Dish Photo */}
              <div className="w-24 h-24 rounded-xl bg-stone-100 shrink-0 overflow-hidden relative border border-stone-200">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <span className={`absolute top-1 left-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white ${
                  dish.isVeg ? 'bg-[#2E7D32]' : 'bg-[#A84D2F]'
                }`}>
                  {dish.isVeg ? 'VEG' : 'NON-VEG'}
                </span>
              </div>

              {/* Dish Details */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <h3 className="font-bold text-xs text-[#2C2420] leading-snug line-clamp-2">
                    {dish.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#736357]">
                    <span className="font-semibold text-[#2C2420]">By {dish.chef}</span>
                    <span>•</span>
                    <span className="flex items-center text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                      {dish.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-extrabold text-[#2C2420]">₹{dish.price}</span>
                    <span className="text-[10px] text-[#A84D2F] font-bold bg-[#FFF0EB] px-1.5 py-0.5 rounded">
                      {dish.portionsLeft} left
                    </span>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDish(dish);
                    }}
                    className="px-3.5 py-1.5 bg-[#A84D2F] hover:bg-[#8F3E24] text-white font-bold text-[11px] uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95"
                  >
                    + ADD
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

      </main>

      {/* 3. Bottom Sticky Navigation */}
      <nav className="h-16 bg-[#FAF7F2] border-t border-[#F0E6DA] flex items-center justify-around px-2 shrink-0">
        <button className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-[#A84D2F]">
          <Utensils className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button 
          onClick={onNavigateCraving}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-[#736357] hover:text-[#A84D2F] transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Cravings</span>
        </button>

        <button 
          onClick={onNavigateCart}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-[#736357] hover:text-[#A84D2F] transition-colors relative"
        >
          <CreditCard className="w-4 h-4" />
          <span>My Pot</span>
          {cartCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#A84D2F] absolute top-0 right-3" />
          )}
        </button>

        <button className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-[#736357] hover:text-[#A84D2F] transition-colors">
          <User className="w-4 h-4" />
          <span>Account</span>
        </button>
      </nav>

    </div>
  );
}