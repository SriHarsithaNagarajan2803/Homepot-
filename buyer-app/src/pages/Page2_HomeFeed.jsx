import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import logoImg from '../../logo/HomePot-logo.jpeg';
import { FiMapPin, FiSearch, FiStar, FiShoppingBag, FiPlus, FiMinus, FiCheck } from 'react-icons/fi';

export default function HomeFeed({ onNavigate }) {
  const [activeMealTab, setActiveMealTab] = useState('All');
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Under150', 'TopRated'
  const [specialDish, setSpecialDish] = useState('');
  const [cartCounts, setCartCounts] = useState({});

  const handleIncrement = (id) => {
    setCartCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrement = (id) => {
    setCartCounts(prev => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

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
    if (activeMealTab !== 'All' && item.mealType !== activeMealTab) return false;
    if (pureVegOnly && !item.isVeg) return false;
    if (activeFilter === 'Under150' && item.price > 150) return false;
    if (activeFilter === 'TopRated' && item.rating < 4.9) return false;
    return true;
  });

  const totalItemsInCart = Object.values(cartCounts).reduce((a, b) => a + b, 0);

  return (
    <PageLayout>
      <div className="flex flex-col justify-between min-h-full pb-20">
        
        {/* Top Location Pill Button */}
        <div className="pt-4 px-5 flex justify-center">
          <div className="bg-[#A0523D] hover:bg-[#8C4A32] text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95">
            <FiMapPin className="text-white text-sm" />
            <span className="text-xs font-bold tracking-wide">Choose Your Location</span>
          </div>
        </div>

        {/* HomePot Logo & Branding Header */}
        <div className="px-5 pt-3 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-white border border-[#E2D5BE] shadow-md flex items-center justify-center overflow-hidden mb-1">
            <img 
              src={logoImg} 
              alt="HomePot Logo" 
              className="w-full h-full object-cover mix-blend-multiply" 
            />
          </div>
          
          <h1 className="font-serif font-bold text-3xl text-[#2C1D14] tracking-tight mt-1">Taste of Home</h1>
          <p className="text-xs font-semibold text-[#6B5B4F] mt-1 leading-relaxed">
            Authentic Meals<br />
            Hygienic Home Cooking From<br />
            Your Neighborhood Chefs
          </p>
        </div>

        {/* Delivering To & Cart Header */}
        <div className="px-5 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C1D14]">
            <FiMapPin className="text-[#8C4A32]" /> Delivering to: <span className="underline">Anna Nagar, Flat 4B</span>
          </div>
          <div 
            onClick={() => onNavigate('checkout')}
            className="relative cursor-pointer bg-[#A0523D] hover:bg-[#8C4A32] text-white p-2.5 rounded-full shadow-sm transition-all active:scale-95"
          >
            <FiShoppingBag className="text-sm" />
            {totalItemsInCart > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItemsInCart}
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-5 pt-3">
          <div className="w-full bg-white border border-[#E2D5BE] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xs">
            <FiSearch className="text-[#A39281] text-base shrink-0" />
            <input 
              type="text" 
              placeholder="Search sambar rice, parathas, thali..." 
              className="bg-transparent text-xs text-[#2C1D14] placeholder-[#A39281] focus:outline-none w-full font-medium"
            />
          </div>
        </div>

        {/* Meal Time Tabs */}
        <div className="px-5 pt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Breakfast', 'Lunch', 'Dinner'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveMealTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeMealTab === tab 
                  ? 'bg-[#A0523D] text-white shadow-sm' 
                  : 'bg-white text-[#6B5B4F] border border-[#E2D5BE] hover:bg-[#FAF5EE]'
              }`}
            >
              {tab} {tab === activeMealTab && tab !== 'All' && '(Active)'}
            </button>
          ))}
        </div>

        {/* Interactive Filters Row (Idle Grid/Wrap Layout) */}
        <div className="px-5 pt-3 grid grid-cols-3 gap-2">
          <button 
            onClick={() => setPureVegOnly(!pureVegOnly)}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
              pureVegOnly 
                ? 'bg-[#A0523D] text-white border-[#A0523D] shadow-xs' 
                : 'bg-white text-[#2C1D14] border-[#E2D5BE] hover:bg-[#FAF5EE]'
            }`}
          >
            {pureVegOnly && <FiCheck className="text-xs" />} Pure Veg
          </button>
          
          <button 
            onClick={() => setActiveFilter(activeFilter === 'Under150' ? 'All' : 'Under150')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
              activeFilter === 'Under150' 
                ? 'bg-[#A0523D] text-white border-[#A0523D] shadow-xs' 
                : 'bg-white text-[#2C1D14] border-[#E2D5BE] hover:bg-[#FAF5EE]'
            }`}
          >
            {activeFilter === 'Under150' && <FiCheck className="text-xs" />} Under ₹150
          </button>

          <button 
            onClick={() => setActiveFilter(activeFilter === 'TopRated' ? 'All' : 'TopRated')}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
              activeFilter === 'TopRated' 
                ? 'bg-[#A0523D] text-white border-[#A0523D] shadow-xs' 
                : 'bg-white text-[#2C1D14] border-[#E2D5BE] hover:bg-[#FAF5EE]'
            }`}
          >
            {activeFilter === 'TopRated' && <FiCheck className="text-xs" />} Top Rated
          </button>
        </div>

        {/* Food Cards Scrollable Feed with Navigation */}
        <div className="px-5 pt-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#2C1D14] font-serif">Available Near You</h3>
            <span className="text-[10px] text-[#A39281] italic">📸 Live photos uploaded by chefs</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-xs font-bold text-[#A39281] bg-white/60 rounded-2xl border border-[#E2D5BE]">
              No dishes found for this filter. Try clearing filters!
            </div>
          ) : (
            filteredItems.map((item) => {
              const qty = cartCounts[item.id] || 0;
              return (
                <div 
                  key={item.id}
                  onClick={() => onNavigate('detail', item)}
                  className="bg-white border border-[#E2D5BE] rounded-3xl p-3.5 shadow-sm flex gap-3.5 items-center relative cursor-pointer hover:border-[#A0523D] transition-all"
                >
                  {/* Chef-Uploaded Food Image */}
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-[#FAF5EE] border border-[#F0E6D8]">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                      Chef Pic 📸
                    </span>
                  </div>

                  {/* Food Details & Alignment */}
                  <div className="flex flex-col flex-1 min-w-0 justify-between">
                    <div>
                      {/* Veg / Non-Veg Tag */}
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase mb-1 ${
                        item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isVeg ? '🟢 Veg' : '🌶️ Non-veg'}
                      </span>

                      {/* Food Name */}
                      <h3 className="font-serif font-bold text-xs text-[#2C1D14] leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Cooked By Amma & Rating */}
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-[#6B5B4F]">
                        Cooked by {item.chef}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 mt-0.5">
                        <FiStar className="fill-amber-600 text-amber-600" /> {item.rating} ({item.reviews})
                      </div>

                      {/* Portions Left Badge */}
                      <div className="mt-1.5 inline-block bg-orange-100 text-orange-900 text-[9px] font-bold px-2 py-0.5 rounded-md">
                        {item.portionsLeft}
                      </div>
                    </div>

                    {/* Total Amount & Add / Counter Controls */}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#F5EFE6]">
                      <span className="font-bold text-base text-[#8C4A32]">₹{item.price * (qty === 0 ? 1 : qty)}</span>
                      {qty === 0 ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleIncrement(item.id); }}
                          className="bg-[#A0523D] hover:bg-[#8C4A32] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                          + ADD
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-[#A0523D] text-white px-3 py-1.5 rounded-xl shadow-xs" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleDecrement(item.id)} className="cursor-pointer">
                            <FiMinus className="text-xs" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{qty}</span>
                          <button onClick={() => handleIncrement(item.id)} className="cursor-pointer">
                            <FiPlus className="text-xs" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Special Request Box */}
        <div className="px-5 pt-4">
          <div className="bg-[#FAF5EE] border border-[#E2D5BE] rounded-2xl p-3.5 shadow-2xs flex flex-col gap-2">
            <h4 className="font-serif font-bold text-xs text-[#2C1D14]">
              Order Special Requests - Your Favorite Dish, Not on Today's Menu
            </h4>
            <p className="text-[10px] text-[#6B5B4F] leading-relaxed">
              Tell us what you crave (e.g., Mutton Biryani) and we'll connect you with a neighborhood chef.
            </p>
            <div className="flex items-center gap-1 mt-1">
              <input 
                type="text" 
                value={specialDish}
                onChange={(e) => setSpecialDish(e.target.value)}
                placeholder="Enter dish you crave..." 
                className="bg-white border border-[#E2D5BE] rounded-xl px-3 py-2 text-xs text-[#2C1D14] placeholder-[#A39281] focus:outline-none flex-1 font-medium"
              />
              <button 
                onClick={() => {
                  if(!specialDish.trim()) { alert('Please enter a dish name!'); return; }
                  alert(`Special Request for "${specialDish}" submitted successfully!`);
                  setSpecialDish('');
                }}
                className="bg-[#A0523D] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer shrink-0"
              >
                Special Order
              </button>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}