import React, { useState } from 'react';
import { ArrowLeft, Heart, ShieldCheck, Plus, Minus } from 'lucide-react';

export default function FoodDetail({ dish, onBack, onAddToCart }) {
  const [spiceLevel, setSpiceLevel] = useState("Amma's Special");
  const [specialNote, setSpecialNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  const meal = dish || {
    name: 'Authentic Chettinad Chicken Curry + 3 Parottas',
    price: 100,
    chef: "Radha Amma's Kitchen",
    rating: 4.9,
    reviews: '120+ ratings',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=60'
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-[#FFFDF9] select-none font-sans overflow-y-auto">
      <div className="relative h-60 bg-[#F4EAE0] overflow-hidden shrink-0">
        <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#2C2420] shadow-md active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 shadow-md active:scale-95">
          <Heart className="w-5 h-5 fill-rose-500" />
        </button>
      </div>

      <div className="p-4 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-bold text-base text-[#2C2420] leading-snug">{meal.name}</h2>
            <p className="text-xl font-extrabold text-[#A84D2F] mt-1">₹{meal.price}</p>
          </div>
          <span className="bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3 h-3" /> FSSAI Certified
          </span>
        </div>

        <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-[#EADBCE] space-y-1.5 shadow-sm">
          <p className="text-[10px] font-bold text-[#A84D2F] uppercase tracking-wider">Kitchen Story</p>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#EEDBCC] flex items-center justify-center text-xl shrink-0">👵🏼</div>
            <div>
              <h4 className="font-bold text-xs text-[#2C2420]">Cooked by {meal.chef}</h4>
              <p className="text-[10px] text-[#2E7D32] font-semibold">Cleanliness Rating ★ 5.0</p>
            </div>
          </div>
          <p className="text-[11px] text-[#736357] italic">"Slow-cooked with hand-ground spices and pure love."</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#F0E6DA] space-y-3 shadow-sm">
          <div>
            <label className="text-[11px] font-bold text-[#2C2420]">Spice Level Selector</label>
            <div className="grid grid-cols-3 gap-1.5 mt-1.5 text-xs">
              {['Mild', 'Medium', "Amma's Special"].map((lvl) => (
                <button key={lvl} onClick={() => setSpiceLevel(lvl)} className={`py-1.5 rounded-xl text-[11px] font-bold border ${spiceLevel === lvl ? 'bg-[#A84D2F] text-white border-[#A84D2F]' : 'bg-[#FAF6F0] text-[#736357] border-[#EADBCE]'}`}>
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#2C2420]">Special instruction note</label>
            <input type="text" value={specialNote} onChange={(e) => setSpecialNote(e.target.value)} placeholder="e.g., Less oil, extra gravy" className="w-full mt-1 p-2.5 bg-[#FAF6F0] rounded-xl text-xs text-[#2C2420] border border-[#EADBCE] focus:outline-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-2 bg-[#F5EDE2] p-1.5 rounded-xl border border-[#EADBCE]">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm active:scale-95"><Minus className="w-3.5 h-3.5" /></button>
            <span className="font-extrabold text-xs w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm active:scale-95"><Plus className="w-3.5 h-3.5" /></button>
          </div>
          <button onClick={onAddToCart} className="flex-1 py-3.5 bg-[#A84D2F] hover:bg-[#913E23] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95">
            Add to Pot • ₹{meal.price * quantity}
          </button>
        </div>
      </div>
    </div>
  );
}