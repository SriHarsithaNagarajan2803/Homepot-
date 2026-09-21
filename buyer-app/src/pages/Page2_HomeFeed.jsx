import React, { useState } from 'react';
import logoImg from '../../logo/HomePot-logo.jpeg';
import { FiMapPin, FiSearch, FiStar, FiShoppingBag, FiPlus, FiMinus, FiCheck, FiArrowRight } from 'react-icons/fi';
import LocationModal from '../components/LocationModal';

export default function HomeFeed({ onNavigate, onAddToCart, cart = [], selectedLocation = 'Anna Nagar, Flat 4B', onChangeLocation }) {
  const [activeMealTab, setActiveMealTab] = useState('All');
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [specialDish, setSpecialDish] = useState('');
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
      portionsLeft: 'Only 6 portions left!',
      isVeg: false,
      mealType: 'Lunch',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      title: 'Traditional Ghee Podi Idli & Vadai',
      chef: 'Saraswathi Amma',
      rating: 5.0,
      reviews: '210+ orders',
      price: 90,
      portionsLeft: 'Only 3 portions left!',
      isVeg: true,
      mealType: 'Breakfast',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60'
    }
  ];

  const filteredItems = foodItems.filter(item => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.chef.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeMealTab !== 'All' && item.mealType !== activeMealTab) return false;
    if (pureVegOnly && !item.isVeg) return false;
    if (activeFilter === 'Under150' && item.price > 150) return false;
    if (activeFilter === 'TopRated' && item.rating < 4.9) return false;
    return true;
  });

  const totalCartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const getItemCountInCart = (id) => {
    const found = cart.find(c => c.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="flex flex-col min-h-full pb-24 relative select-none">
      
      {/* Top Interactive Location Pill Button */}
      <div className="pt-3 px-5 flex justify-center sticky top-0 z-30 bg-[#FAF6EE]/90 backdrop-blur-xs py-2">
        <button
          type="button"
          onClick={() => setIsLocationModalOpen(true)}
          className="bg-[#A0523D] hover:bg-[#8C4A32] text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95 text-xs font-bold tracking-wide"
        >
          <FiMapPin className="text-white text-sm animate-pulse" />
          <span>Choose Your Location</span>
        </button>
      </div>

      {/* HomePot Logo & Branding Header */}
      <div className="px-5 pt-2 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-white border border-[#E2D5BE] shadow-md flex items-center justify-center overflow-hidden mb-1">
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
              <span className="text-[9px] font-bold text-[#7C746E] uppercase block">Delivering to:</span>
              <span className="text-xs font-bold text-[#2C1D14] truncate block">{selectedLocation}</span>
            </div>
          </div>
          <span className="text-[10px] text-[#8C4A32] font-bold underline shrink-0 ml-2">Change</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-5 mt-3">
        <div className="bg-white border border-[#E2D5BE] rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-xs">
          <FiSearch className="text-[#8C4A32] text-sm shrink-0" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sambar rice, parathas, thali..." 
            className="w-full text-xs text-[#2C1D14] placeholder-[#A39281] bg-transparent focus:outline-none font-medium"
          />
        </div>
      </div>

      {/* Meal Type Tabs */}
      <div className="px-5 mt-3">
        <div className="flex items-center justify-around border-b border-[#E2D5BE] text-xs font-bold pb-2">
          {['All', 'Breakfast', 'Lunch', 'Dinner'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveMealTab(tab)}
              className={`pb-1 px-2 transition-all cursor-pointer ${
                activeMealTab === tab 
                  ? 'text-[#8C4A32] border-b-2 border-[#8C4A32] font-extrabold' 
                  : 'text-[#7C746E] hover:text-[#2C1D14]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Quick Pills */}
      <div className="px-5 mt-2.5 grid grid-cols-3 gap-2">
        <button 
          onClick={() => setPureVegOnly(!pureVegOnly)}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer border flex items-center justify-center gap-1 ${
            pureVegOnly 
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs' 
              : 'bg-white text-[#2C1D14] border-[#E2D5BE] hover:bg-[#FAF5EE]'
          }`}
        >
          {pureVegOnly && <FiCheck className="text-xs" />} Pure Veg
        </button>

        <button 
          onClick={() => setActiveFilter(activeFilter === 'Under150' ? 'All' : 'Under150')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer border flex items-center justify-center gap-1 ${
            activeFilter === 'Under150' 
              ? 'bg-[#A0523D] text-white border-[#A0523D] shadow-xs' 
              : 'bg-white text-[#2C1D14] border-[#E2D5BE] hover:bg-[#FAF5EE]'
          }`}
        >
          {activeFilter === 'Under150' && <FiCheck className="text-xs" />} Under ₹150
        </button>

        <button 
          onClick={() => setActiveFilter(activeFilter === 'TopRated' ? 'All' : 'TopRated')}
          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer border flex items-center justify-center gap-1 ${
            activeFilter === 'TopRated' 
              ? 'bg-[#A0523D] text-white border-[#A0523D] shadow-xs' 
              : 'bg-white text-[#2C1D14] border-[#E2D5BE] hover:bg-[#FAF5EE]'
          }`}
        >
          {activeFilter === 'TopRated' && <FiCheck className="text-xs" />} Top Rated
        </button>
      </div>

      {/* Food Cards Scrollable Feed */}
      <div className="px-5 pt-3 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-[#2C1D14] font-serif">Available Near You (5 km)</h3>
          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full">
            ● Fresh Today
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-xs font-bold text-[#A39281] bg-white/70 rounded-2xl border border-[#E2D5BE]">
            No dishes found matching your criteria.
          </div>
        ) : (
          filteredItems.map((item) => {
            const countInCart = getItemCountInCart(item.id);
            return (
              <div 
                key={item.id}
                onClick={() => onNavigate('detail', item)}
                className="bg-white border border-[#E2D5BE] rounded-3xl p-3 shadow-sm flex gap-3 items-center relative cursor-pointer hover:border-[#A0523D] transition-all active:scale-[0.99]"
              >
                {/* Food Image with Vibrant Availability Dot */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#FAF5EE] border border-[#F0E6D8]">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                  {/* Vibrant status dot on logo side: GREEN = Available */}
                  <span className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-white shadow-[0_0_8px_#10B981]"></span>
                </div>

                {/* Food Details */}
                <div className="flex flex-col flex-1 min-w-0 justify-between">
                  <div>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase mb-0.5 ${
                      item.isVeg ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {item.isVeg ? '🟢 Veg' : '🌶️ Non-Veg'}
                    </span>

                    <h3 className="font-serif font-bold text-xs text-[#2C1D14] leading-snug line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-[10px] text-[#6B5B4F] mt-0.5">Cooked by <b>{item.chef}</b></p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700">
                      <FiStar className="fill-amber-600 text-amber-600" /> {item.rating} ({item.reviews})
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

      {/* Special Request Box */}
      <div className="px-5 pt-3">
        <div className="bg-[#FAF5EE] border border-[#E2D5BE] rounded-2xl p-3 shadow-xs flex flex-col gap-1.5">
          <h4 className="font-serif font-bold text-xs text-[#2C1D14]">
            Order Special Requests - Custom Craving?
          </h4>
          <p className="text-[10px] text-[#6B5B4F] leading-relaxed">
            Craving homemade mutton sukka or hot payasam? Tell us and a neighborhood chef will prepare it!
          </p>
          <div className="flex items-center gap-1 mt-1">
            <input 
              type="text" 
              value={specialDish}
              onChange={(e) => setSpecialDish(e.target.value)}
              placeholder="Enter dish you crave..." 
              className="bg-white border border-[#E2D5BE] rounded-xl px-3 py-1.5 text-xs text-[#2C1D14] placeholder-[#A39281] focus:outline-none flex-1 font-medium"
            />
            <button 
              onClick={() => {
                if(!specialDish.trim()) { alert('Please enter a dish name!'); return; }
                alert(`Special Request for "${specialDish}" submitted! A home chef will confirm shortly.`);
                setSpecialDish('');
              }}
              className="bg-[#A0523D] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer shrink-0"
            >
              Request
            </button>
          </div>
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
