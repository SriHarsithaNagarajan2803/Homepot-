import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { FiArrowLeft, FiHeart, FiPlus, FiMinus, FiStar } from 'react-icons/fi';
import { ShieldCheck } from 'lucide-react';

export default function FoodDetail({ dish, onBack, onAddToCart }) {
  const [spiceLevel, setSpiceLevel] = useState("Amma's Special");
  const [specialNote, setSpecialNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fallback default dish matching the reference mockup
  const meal = dish || {
    id: 1,
    title: 'Traditional Curd Rice with Mango Pickle',
    price: 90,
    chef: "Radha Aunty's Kitchen",
    rating: 4.9,
    reviews: '50+ ratings',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=60'
  };

  const totalPrice = meal.price * quantity;

  return (
    <PageLayout>
      <div className="flex flex-col justify-between min-h-full pb-20 select-none">
        
        <div className="p-4 space-y-4">
          
          {/* Top Image Banner with Back & Favorite Buttons */}
          <div className="relative h-64 w-full bg-[#F4EAE0] rounded-3xl overflow-hidden shadow-sm">
            <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" />
            
            <button 
              onClick={onBack} 
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#2C1D14] shadow-md active:scale-95 cursor-pointer"
            >
              <FiArrowLeft className="text-base font-bold" />
            </button>

            <button 
              onClick={() => setIsFavorite(!isFavorite)} 
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md active:scale-95 cursor-pointer"
            >
              <FiHeart className={`text-base ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`} />
            </button>
          </div>

          {/* Title & Price Card */}
          <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-bold text-sm text-[#2C1D14] leading-snug">{meal.title}</h2>
              <p className="text-lg font-extrabold text-[#2C1D14] mt-1">₹{meal.price}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="bg-green-100 border border-green-200 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> FSSAI Hygiene Certified
              </span>
              <div className="text-[10px] font-bold text-[#6B5B4F] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-[#E2D5BE]">
                Amma Kitchen
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700">
                <FiStar className="fill-amber-600 text-amber-600" /> {meal.rating} ({meal.reviews})
              </div>
            </div>
          </div>

          {/* Kitchen Story Card */}
          <div className="bg-[#FAF5EE] p-4 rounded-3xl border border-[#E2D5BE] space-y-2.5 shadow-xs">
            <h3 className="font-bold text-xs text-[#2C1D14]">Kitchen Story Card</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-rose-100 border border-[#E2D5BE] shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60" 
                  alt="Radha Aunty" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#2C1D14]">Cooked in {meal.chef}</h4>
                <p className="text-[10px] text-[#2C1D14] font-semibold mt-0.5">Cleanliness Rating ★ 5.0</p>
              </div>
            </div>
            <p className="text-[11px] text-[#6B5B4F] italic mt-1">
              "Prepared using cold-pressed gingelly oil and homemade curd."
            </p>
          </div>

          {/* Customization Box */}
          <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] space-y-3.5 shadow-xs">
            <h3 className="font-bold text-xs text-[#2C1D14]">Customization Box</h3>
            
            {/* Spice level selector */}
            <div>
              <label className="text-[11px] font-bold text-[#6B5B4F]">Spice level selector</label>
              <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                {['Mild', 'Medium', "Amma's Special"].map((lvl) => (
                  <button 
                    key={lvl} 
                    onClick={() => setSpiceLevel(lvl)} 
                    className={`py-2 rounded-xl text-[11px] font-bold border cursor-pointer transition-all ${
                      spiceLevel === lvl 
                        ? 'bg-[#A0523D] text-white border-[#A0523D] shadow-xs' 
                        : 'bg-[#FAF5EE] text-[#6B5B4F] border-[#E2D5BE] hover:bg-[#F4EFE6]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Special cooking instruction note box */}
            <div>
              <label className="text-[11px] font-bold text-[#6B5B4F]">Special cooking instruction note box</label>
              <input 
                type="text" 
                value={specialNote} 
                onChange={(e) => setSpecialNote(e.target.value)} 
                placeholder="Special instructions for Amma (e.g., Less salt, extra pickle)" 
                className="w-full mt-1.5 p-3 bg-[#FAF5EE] rounded-xl text-xs text-[#2C1D14] border border-[#E2D5BE] focus:outline-none placeholder-[#A39281] font-medium" 
              />
            </div>

            {/* Allergens info */}
            <div>
              <label className="text-[11px] font-bold text-[#6B5B4F]">Allergens info</label>
              <p className="text-[10px] text-[#8C7A6B] mt-0.5 leading-relaxed">
                Common allergens are polloted down, Less salt, biryani, prdean, paniuts, more, tranians, allergens, and our mits.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Floating Bar: Quantity Counter & Add to Pot Button */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#FAF5EE]/95 backdrop-blur-md border-t border-[#E2D5BE] flex items-center justify-center z-50">
          <div className="w-full max-w-md flex items-center gap-3 px-2">
            
            {/* Quantity Controller */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#E2D5BE] shadow-xs">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="w-8 h-8 bg-[#FAF5EE] rounded-xl flex items-center justify-center text-xs font-bold active:scale-95 cursor-pointer border border-[#E2D5BE]"
              >
                <FiMinus />
              </button>
              <span className="font-extrabold text-sm w-5 text-center text-[#2C1D14]">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="w-8 h-8 bg-[#FAF5EE] rounded-xl flex items-center justify-center text-xs font-bold active:scale-95 cursor-pointer border border-[#E2D5BE]"
              >
                <FiPlus />
              </button>
            </div>

            {/* Add to Pot Button */}
            <button 
              onClick={() => onAddToCart({ ...meal, quantity, spiceLevel, specialNote, totalPrice })} 
              className="flex-1 py-3.5 bg-[#A0523D] hover:bg-[#8C4A32] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              Add to Pot • ₹{totalPrice}
            </button>

          </div>
        </div>

      </div>
    </PageLayout>
  );
}