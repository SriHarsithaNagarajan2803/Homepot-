import React, { useState } from 'react';
import { FiArrowLeft, FiHeart, FiPlus, FiMinus, FiStar, FiShoppingBag, FiCheck } from 'react-icons/fi';
import { ShieldCheck, PackageCheck } from 'lucide-react';

export default function FoodDetail({ dish, onBack, onAddToCart, onBookNow }) {
  const [spiceLevel, setSpiceLevel] = useState("Amma's Special");
  const [specialNote, setSpecialNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const meal = dish || {
    id: 1,
    title: 'Authentic Chettinad Chicken Curry + 3 Parottas',
    price: 100,
    chef: "Radha Amma",
    rating: 4.9,
    reviews: '120+ orders',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=60'
  };

  const totalPrice = meal.price * quantity;

  const handleSelectThis = () => {
    onAddToCart({ ...meal, quantity, spiceLevel, specialNote, totalPrice });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBookOrderNow = () => {
    onAddToCart({ ...meal, quantity, spiceLevel, specialNote, totalPrice });
    if (onBookNow) onBookNow();
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FAF6EE] text-[#2C1D14] pb-28 relative select-none">
      
      {/* Sticky Top Header Bar with Prominent Back Button */}
      <div className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md px-4 py-3 border-b border-[#E2D5BE] flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2D5BE] text-[#8C4A32] font-bold text-xs shadow-xs hover:bg-[#F4EFE6] cursor-pointer active:scale-95"
        >
          <FiArrowLeft className="text-sm font-bold" />
          <span>Back to Menu</span>
        </button>

        <h2 className="font-serif font-bold text-xs text-[#2C1D14] truncate max-w-[180px]">
          {meal.title}
        </h2>

        <button 
          onClick={() => setIsFavorite(!isFavorite)} 
          className="w-8 h-8 rounded-full bg-white border border-[#E2D5BE] flex items-center justify-center shadow-xs cursor-pointer active:scale-95"
        >
          <FiHeart className={`text-sm ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`} />
        </button>
      </div>

      {showToast && (
        <div className="px-4 pt-2">
          <div className="bg-emerald-700 text-white text-xs px-3 py-2 rounded-xl flex items-center gap-2 shadow-md">
            <FiCheck className="text-base shrink-0" />
            <span>Added {quantity}x "{meal.title}" to your Pot!</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 space-y-3.5">
        
        {/* Dish Hero Image with Vibrant Availability Dot */}
        <div className="relative h-56 w-full bg-[#F4EAE0] rounded-3xl overflow-hidden shadow-sm border border-[#E2D5BE]">
          <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
            <span>Available from Home Kitchen</span>
          </div>
        </div>

        {/* Title, Rating & Hygiene Seal */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs flex items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-base text-[#2C1D14] leading-snug">{meal.title}</h2>
            <p className="text-xl font-extrabold text-[#8C4A32] mt-1">₹{meal.price}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> FSSAI Certified
            </span>
            <div className="text-[10px] font-bold text-[#6B5B4F] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-[#E2D5BE]">
              {meal.chef}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700">
              <FiStar className="fill-amber-600 text-amber-600" /> {meal.rating} ({meal.reviews})
            </div>
          </div>
        </div>

        {/* Packaging Assurance (Sealed Plastic Containers - No Tiffin return needed) */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2.5 text-xs">
          <PackageCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="text-[11px] text-emerald-900 leading-snug font-medium">
            <b>100% Sealed Food-Grade Packaging:</b> Packed in hygienic disposable containers. No dabba collection or returns required.
          </p>
        </div>

        {/* Kitchen Story Card */}
        <div className="bg-[#FAF4EB] p-4 rounded-3xl border border-[#E2D5BE] space-y-2 shadow-xs">
          <h3 className="font-bold text-xs text-[#2C1D14]">Kitchen Story Card</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-rose-100 border border-[#E2D5BE] shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60" 
                alt={meal.chef} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#2C1D14]">Cooked by {meal.chef}</h4>
              <p className="text-[10px] text-[#2C1D14] font-semibold">Kitchen Cleanliness Rating ★ 5.0</p>
            </div>
          </div>
          <p className="text-[11px] text-[#6B5B4F] italic">
            "Prepared with love using fresh farm spices, pure cold-pressed oil, and home-cooked hygiene."
          </p>
        </div>

        {/* Customization Box */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] space-y-3 shadow-xs">
          <h3 className="font-bold text-xs text-[#2C1D14]">Customization Box</h3>
          
          {/* Spice level selector */}
          <div>
            <label className="text-[11px] font-bold text-[#6B5B4F]">Spice Level</label>
            <div className="grid grid-cols-3 gap-1.5 mt-1.5">
              {['Mild', 'Medium', "Amma's Special"].map((lvl) => (
                <button 
                  key={lvl} 
                  type="button"
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
            <label className="text-[11px] font-bold text-[#6B5B4F]">Special Cooking Instructions for Chef</label>
            <input 
              type="text" 
              value={specialNote} 
              onChange={(e) => setSpecialNote(e.target.value)} 
              placeholder="e.g. Less salt, extra gravy, crisp roti..." 
              className="w-full mt-1 p-2.5 bg-[#FAF5EE] rounded-xl text-xs text-[#2C1D14] border border-[#E2D5BE] focus:outline-none placeholder-[#A39281] font-medium" 
            />
          </div>
        </div>

      </div>

      {/* Sticky Bottom Action Bar: Select This & Book Order Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#FAF6EE] border-t border-[#E2D5BE] flex items-center justify-center z-50 shadow-2xl">
        <div className="w-full max-w-md flex items-center gap-2 px-1">
          
          {/* Quantity Counter */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#E2D5BE] shadow-xs">
            <button 
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              className="w-7 h-7 bg-[#FAF5EE] rounded-xl flex items-center justify-center text-xs font-bold active:scale-95 cursor-pointer border border-[#E2D5BE]"
            >
              <FiMinus />
            </button>
            <span className="font-extrabold text-sm w-4 text-center text-[#2C1D14]">{quantity}</span>
            <button 
              type="button"
              onClick={() => setQuantity(quantity + 1)} 
              className="w-7 h-7 bg-[#FAF5EE] rounded-xl flex items-center justify-center text-xs font-bold active:scale-95 cursor-pointer border border-[#E2D5BE]"
            >
              <FiPlus />
            </button>
          </div>

          {/* Button 1: Select & Add to Pot */}
          <button 
            type="button"
            onClick={handleSelectThis} 
            className="flex-1 py-3 bg-white hover:bg-[#FAF4EB] border-2 border-[#8C4A32] text-[#8C4A32] font-bold text-xs uppercase rounded-2xl shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1"
          >
            <FiShoppingBag />
            <span>Select This • ₹{totalPrice}</span>
          </button>

          {/* Button 2: Direct Book Order */}
          <button 
            type="button"
            onClick={handleBookOrderNow} 
            className="flex-1 py-3 bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Book Order ➔</span>
          </button>

        </div>
      </div>

    </div>
  );
}
