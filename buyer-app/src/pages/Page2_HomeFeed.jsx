import React, { useState } from 'react';
import logoImg from '../../logo/HomePot-logo.jpeg';
import { FiMapPin, FiSearch, FiStar, FiShoppingBag, FiPlus, FiCheck, FiArrowRight, FiHeart, FiClock, FiSend } from 'react-icons/fi';
import LocationModal from '../components/LocationModal';

export default function HomeFeed({ onNavigate, onAddToCart, cart = [], selectedLocation = 'Choose your location', onChangeLocation }) {
  const [activeMealTab, setActiveMealTab] = useState('All');
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [specialDish, setSpecialDish] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [specialMealTime, setSpecialMealTime] = useState('Lunch');
  const [specialReqSubmitted, setSpecialReqSubmitted] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const foodItems = [
    {
      id: 1,
      title: 'Authentic Chettinad Chicken Curry + 3 Parottas',
      chef: 'Radha Amma',
      rating: 4.9,
      reviews: '120+ orders',
      price: 100,
      portionsLeft: 'Only 4 portions left!',
      isVeg: false,
      mealType: 'Lunch',
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      title: 'Authentic Egg Curry + Roti',
      chef: 'Radha Amma',
      rating: 4.8,
      reviews: '95+ orders',
      price: 100,
      portionsLeft: 'Pre-order for Dinner',
      isVeg: false,
      mealType: 'Dinner',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      title: 'Traditional Ghee Podi Idli & Vadai',
      chef: 'Saraswathi Amma',
      rating: 5.0,
      reviews: '210+ orders',
      price: 90,
      portionsLeft: 'Hot & Fresh',
      isVeg: true,
      mealType: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60'
    }
  ];

  const filteredItems = foodItems.filter(item => {
    if (pureVegOnly && !item.isVeg) return false;
    if (activeMealTab !== 'All' && item.mealType !== activeMealTab) return false;
    if (searchQuery.trim() !== '') {
      const matchTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchChef = item.chef.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchTitle && !matchChef) return false;
    }
    return true;
  });

  const totalCartCount = cart.reduce((acc, i) => acc + (i.quantity || 1), 0);
  const totalCartPrice = cart.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);

  const handleSpecialRequestSubmit = (e) => {
    e.preventDefault();
    if (!specialDish.trim()) {
      alert('Please enter the name of the dish you crave!');
      return;
    }
    setSpecialReqSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FAF6EE] text-[#2C1D14] pb-40 relative select-none">
      
      {/* Top Header */}
      <div className="flex flex-col items-center text-center pt-3 px-5">
        <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2D5BE] shadow-md flex items-center justify-center overflow-hidden mb-1">
          <img 
            src={logoImg} 
            alt="HomePot Logo" 
            className="w-full h-full object-cover mix-blend-multiply" 
          />
        </div>
        
        <h1 className="font-serif font-bold text-2xl text-[#2C1D14] tracking-tight mt-0.5">Taste of Home</h1>
        <p className="text-[11px] font-semibold text-[#6B5B4F] mt-0.5 leading-snug">
          Authentic Meals • Hygienic Home Cooking<br />From Your Neighborhood Chefs
        </p>
      </div>

      {/* Active Delivering Address Banner */}
      <div className="px-5 mt-2">
        <div 
          onClick={() => setIsLocationModalOpen(true)}
          className="bg-[#FAF4EB] border border-[#E2D5BE] rounded-2xl p-2.5 flex items-center justify-between shadow-xs cursor-pointer hover:bg-white transition"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <FiMapPin className="text-[#8C4A32] shrink-0 text-sm" />
            <div className="truncate">
              <span className="text-[9px] font-bold text-[#7C746E] uppercase block">Location / Kitchen Distance:</span>
              <span className="text-xs font-bold text-[#2C1D14] truncate block">{selectedLocation || 'Tap to choose location (within 5km)'}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#8C4A32] bg-[#FAF5EE] px-2 py-1 rounded-xl border border-[#E2D5BE] shrink-0">
            Change
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 mt-2.5">
        <div className="bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl px-3 py-2 flex items-center gap-2 shadow-xs">
          <FiSearch className="text-[#8C4A32] text-sm shrink-0" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search home dishes or Amma..." 
            className="bg-transparent text-xs text-[#2C1D14] placeholder-[#A39281] focus:outline-none w-full font-medium"
          />
        </div>
      </div>

      {/* Meal Time Tabs */}
      <div className="px-5 mt-3">
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {['All', 'Breakfast', 'Lunch', 'Dinner'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveMealTab(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeMealTab === tab 
                  ? 'bg-[#8C4A32] text-white shadow-xs' 
                  : 'bg-white/80 border border-[#E2D5BE] text-[#6B5B4F] hover:bg-[#FAF4EB]'
              }`}
            >
              {tab}
            </button>
          ))}

          {/* Pure Veg Toggle */}
          <button
            onClick={() => setPureVegOnly(!pureVegOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              pureVegOnly 
                ? 'bg-emerald-700 text-white shadow-xs' 
                : 'bg-white/80 border border-[#E2D5BE] text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Pure Veg</span>
          </button>
        </div>
      </div>

      {/* Food Cards Feed */}
      <div className="px-5 mt-3 space-y-3.5">
        <div className="flex justify-between items-center px-1">
          <span className="font-serif font-bold text-xs text-[#2C1D14] uppercase tracking-wider">
            Available Near You (Within 5 km)
          </span>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Fresh Today
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white p-6 rounded-3xl border border-[#E2D5BE] text-center text-xs text-[#6B5B4F]">
            No dishes found matching your filters. Try clearing the search or pure veg toggle!
          </div>
        ) : (
          filteredItems.map(item => {
            const countInCart = cart.filter(c => c.id === item.id).reduce((sum, c) => sum + (c.quantity || 1), 0);

            return (
              <div 
                key={item.id}
                onClick={() => onNavigate('detail', item)}
                className="bg-white rounded-3xl border border-[#E2D5BE] p-3 shadow-xs hover:shadow-md transition-all cursor-pointer flex gap-3 group"
              >
                {/* Dish Photo with availability status */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#FAF6EE] shrink-0 border border-[#E2D5BE]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  {/* Vibrant Availability Green Dot */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full bg-[#10B981] border border-white shadow-[0_0_6px_#10B981]" title="Available Now"></div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm ${item.isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                      <span className="text-[10px] text-[#7C746E] truncate">Cooked by {item.chef}</span>
                    </div>

                    <h3 className="font-serif font-bold text-xs text-[#2C1D14] mt-1 leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1 text-[10px] text-amber-700 font-bold mt-1">
                      <FiStar className="fill-amber-500 text-amber-500 text-xs" />
                      <span>{item.rating}</span>
                      <span className="text-[#A09890] font-normal">({item.reviews})</span>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-[#F5EFE6]">
                    <span className="font-bold text-sm text-[#8C4A32]">₹{item.price}</span>
                    
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart({ ...item, quantity: 1 });
                      }}
                      className="bg-[#A0523D] hover:bg-[#8C4A32] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <FiPlus size={12} />
                      <span>{countInCart > 0 ? `ADD MORE (${countInCart})` : 'SELECT & ADD'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FULLY RESPONSIVE SPECIAL REQUEST SECTION */}
      <div className="px-5 mt-5">
        <div className="bg-[#FAF5EE] border-2 border-[#E2D5BE] rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍲</span>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2C1D14]">
                Order Special Requests - Custom Craving?
              </h4>
              <p className="text-[10px] text-[#6B5B4F]">
                Craving homemade mutton sukka, payasam or fish curry? Tell nearby chefs!
              </p>
            </div>
          </div>

          {specialReqSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 text-center space-y-2">
              <span className="text-2xl block">🎉</span>
              <p className="text-xs font-bold text-emerald-900">
                Special Request Sent for "{specialDish}"!
              </p>
              <p className="text-[10px] text-emerald-700">
                Broadcasted to 8 neighborhood home kitchens for {specialMealTime}. You will be notified with Amma's preparation offer.
              </p>
              <button
                type="button"
                onClick={() => { setSpecialReqSubmitted(false); setSpecialDish(''); setSpecialNotes(''); }}
                className="text-[10px] font-bold text-[#8C4A32] underline cursor-pointer mt-1"
              >
                Request another custom dish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSpecialRequestSubmit} className="space-y-2.5">
              <input 
                type="text" 
                required
                value={specialDish}
                onChange={(e) => setSpecialDish(e.target.value)}
                placeholder="What dish are you craving? (e.g. Mutton Sukka, Payasam...)" 
                className="w-full bg-white border border-[#E2D5BE] rounded-xl px-3 py-2 text-xs text-[#2C1D14] placeholder-[#A39281] focus:outline-none font-medium shadow-inner"
              />

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#6B5B4F]">Meal Time:</span>
                {['Lunch', 'Dinner', 'Snacks'].map(meal => (
                  <button
                    key={meal}
                    type="button"
                    onClick={() => setSpecialMealTime(meal)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition ${
                      specialMealTime === meal 
                        ? 'bg-[#8C4A32] text-white border-[#8C4A32]' 
                        : 'bg-white text-[#6B5B4F] border-[#E2D5BE]'
                    }`}
                  >
                    {meal}
                  </button>
                ))}
              </div>

              <input 
                type="text" 
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Any special instructions? (e.g. Less oil, medium spicy)" 
                className="w-full bg-white border border-[#E2D5BE] rounded-xl px-3 py-1.5 text-[11px] text-[#2C1D14] placeholder-[#A39281] focus:outline-none"
              />

              <button 
                type="submit"
                className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-98"
              >
                <FiSend size={12} />
                <span>Submit Special Request to Amma</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Floating Bottom Bar: Instant Proceed to Checkout when items added */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-16 left-0 right-0 p-3 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-md px-3 pointer-events-auto">
            <button
              onClick={() => onNavigate('checkout')}
              className="w-full bg-[#2E7D32] hover:bg-[#256829] text-white py-3 px-4 rounded-2xl shadow-xl flex items-center justify-between font-bold text-xs cursor-pointer transition active:scale-98 animate-pulse"
            >
              <div className="flex items-center gap-2">
                <FiShoppingBag className="text-base" />
                <span>{totalCartCount} item(s) in Pot • ₹{totalCartPrice}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Book Order Now</span>
                <FiArrowRight />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Location Modal */}
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={selectedLocation}
        onSelectLocation={onChangeLocation}
      />

    </div>
  );
}
