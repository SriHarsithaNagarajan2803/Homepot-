import React, { useState } from 'react';
import { FiArrowLeft, FiStar, FiHeart, FiCheck, FiPlus, FiMinus } from 'react-icons/fi';
import { PackageCheck, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';

export default function FoodDetail({ dish, onBack, onAddToCart, onBookNow }) {
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [specialNote, setSpecialNote] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Delivery vs Self-Pickup options
  const [deliveryOption, setDeliveryOption] = useState('delivery'); // 'delivery' | 'pickup'
  
  // Container Option for Self-Pickup: 'own_box' (₹0 FREE) | 'packed' (+₹15)
  const [containerOption, setContainerOption] = useState('own_box');

  const defaultDish = {
    id: 1,
    title: 'Traditional Ghee Podi Idli & Vadai',
    chef: 'Saraswathi Amma',
    rating: 5.0,
    reviews: '210+ orders',
    price: 90,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    description: 'Freshly steamed warm idlis drenched in pure country cow ghee, tossed in hand-pounded fragrant gun powder (karam podi), served with crispy medu vadai and freshly ground coconut-coriander chutney.'
  };

  const meal = dish || defaultDish;

  // Packaging Fee Calculation:
  // Delivery always includes packed container (+₹15).
  // Pickup allows customer to choose: Bring Own Dabba (₹0) OR Packed Container (+₹15).
  const packagingFee = deliveryOption === 'delivery' ? 15 : (containerOption === 'packed' ? 15 : 0);
  const deliveryFee = deliveryOption === 'delivery' ? 25 : 0;
  
  const basePrice = meal.price * quantity;
  const totalPrice = basePrice + packagingFee;

  const handleAddToCart = () => {
    onAddToCart({ 
      ...meal, 
      quantity, 
      spiceLevel, 
      specialNote, 
      totalPrice,
      deliveryOption,
      containerOption,
      packagingFee,
      deliveryFee
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const handleBookOrderNow = () => {
    onAddToCart({ 
      ...meal, 
      quantity, 
      spiceLevel, 
      specialNote, 
      totalPrice,
      deliveryOption,
      containerOption,
      packagingFee,
      deliveryFee
    });
    if (onBookNow) onBookNow();
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FAF6EE] text-[#2C1D14] pb-32 relative select-none">
      
      {/* Sticky Top Header Bar */}
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

        {/* CUSTOMER CHOICE: DELIVERY VS SELF PICKUP & PACKAGING PREFERENCE */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] space-y-3 shadow-xs">
          <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-2">
            <h3 className="font-bold text-xs text-[#2C1D14]">Delivery & Container Preference</h3>
            <span className="text-[10px] font-bold text-[#8C4A32]">Customer's Choice</span>
          </div>

          {/* Option 1: Delivery vs Pickup Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryOption('delivery')}
              className={`p-2.5 rounded-2xl border text-left cursor-pointer transition ${
                deliveryOption === 'delivery'
                  ? 'bg-amber-50 border-[#8C4A32] text-[#8C4A32] font-bold shadow-2xs'
                  : 'bg-[#FAF6EE] border-[#E2D5BE] text-[#6B5B4F]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#8C4A32]" />
                <span className="text-xs font-bold">Rider Delivery</span>
              </div>
              <p className="text-[9px] text-[#7C746E] mt-1">Direct to door (within 5km) • +₹15 packed</p>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryOption('pickup')}
              className={`p-2.5 rounded-2xl border text-left cursor-pointer transition ${
                deliveryOption === 'pickup'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold shadow-2xs'
                  : 'bg-[#FAF6EE] border-[#E2D5BE] text-[#6B5B4F]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold">Self-Pickup</span>
              </div>
              <p className="text-[9px] text-[#7C746E] mt-1">Visit Amma's kitchen • ₹0 delivery fee</p>
            </button>
          </div>

          {/* If Self-Pickup: Container Option */}
          {deliveryOption === 'pickup' ? (
            <div className="bg-[#FAF4EB] p-3 rounded-2xl border border-[#E2D5BE] space-y-2">
              <span className="text-[10px] font-bold text-[#593222] uppercase tracking-wide block">
                Do you need packaging or will you bring your own dabba?
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setContainerOption('own_box')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition text-xs ${
                    containerOption === 'own_box'
                      ? 'bg-emerald-700 text-white font-bold border-emerald-700 shadow-xs'
                      : 'bg-white text-[#593222] border-[#E2D5BE]'
                  }`}
                >
                  <span className="block font-bold">🥘 Bring Own Box</span>
                  <span className="text-[9px] opacity-90">₹0 Free • Eco-friendly</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContainerOption('packed')}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition text-xs ${
                    containerOption === 'packed'
                      ? 'bg-[#8C4A32] text-white font-bold border-[#8C4A32] shadow-xs'
                      : 'bg-white text-[#593222] border-[#E2D5BE]'
                  }`}
                >
                  <span className="block font-bold">📦 Need Packed Box</span>
                  <span className="text-[9px] opacity-90">+₹15 extra packaging</span>
                </button>
              </div>

              <p className="text-[10px] text-emerald-900 font-medium">
                {containerOption === 'own_box' 
                  ? '🌿 You selected to bring your own container to Amma’s kitchen. No packaging charge!' 
                  : '📦 Amma will pack your hot food in a sealed food-grade disposable box (+₹15).'}
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl text-[10px] text-emerald-900 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Food delivered in sealed food-grade tamper-proof container (+₹15 packaging included).
              </span>
            </div>
          )}

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

          {/* Cooking Instructions */}
          <div>
            <label className="text-[11px] font-bold text-[#6B5B4F]">Special Cooking Instructions for Chef</label>
            <input 
              type="text" 
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Less salt, extra gravy, crisp roti..." 
              className="mt-1.5 w-full bg-[#FAF6EE] border border-[#E2D5BE] rounded-xl px-3 py-2 text-xs text-[#2C1D14] placeholder-[#A39281] focus:outline-none"
            />
          </div>
        </div>

      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="sticky bottom-0 left-0 right-0 bg-[#FAF6EE]/95 backdrop-blur-md border-t border-[#E2D5BE] p-3 px-4 z-50 flex items-center justify-between gap-2 shadow-lg">
        
        {/* Quantity Counter */}
        <div className="flex items-center gap-2 bg-white border border-[#E2D5BE] rounded-2xl px-2 py-1.5 shadow-xs">
          <button 
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-7 rounded-xl bg-[#FAF5EE] flex items-center justify-center text-[#8C4A32] font-bold hover:bg-[#EFE3D0] active:scale-90 cursor-pointer"
          >
            <FiMinus size={12} />
          </button>
          <span className="font-bold text-xs text-[#2C1D14] w-4 text-center">{quantity}</span>
          <button 
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-7 h-7 rounded-xl bg-[#FAF5EE] flex items-center justify-center text-[#8C4A32] font-bold hover:bg-[#EFE3D0] active:scale-90 cursor-pointer"
          >
            <FiPlus size={12} />
          </button>
        </div>

        {/* Select & Add To Pot */}
        <button 
          type="button"
          onClick={handleAddToCart}
          className="flex-1 bg-white hover:bg-[#FAF4EB] border-2 border-[#8C4A32] text-[#8C4A32] font-bold text-xs py-3 rounded-2xl shadow-xs cursor-pointer transition active:scale-95 flex items-center justify-center gap-1"
        >
          <span>SELECT THIS • ₹{totalPrice}</span>
        </button>

        {/* Book Order Now Button */}
        <button 
          type="button"
          onClick={handleBookOrderNow}
          className="bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-md cursor-pointer transition active:scale-95 flex items-center gap-1.5"
        >
          <span>BOOK ORDER</span>
          <span>➔</span>
        </button>

      </div>

    </div>
  );
}
