import React, { useState, useEffect } from 'react';
import { Utensils, Plus, Trash2, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

export default function DailyMenuManager({ currentChefId = "mock-chef-id-123" }) {
  const [menuItems, setMenuItems] = useState([]);
  const [dishData, setDishData] = useState({
    name: '',
    price: '',
    category: 'Lunch',
    portions: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch chef's existing menu on load
  useEffect(() => {
    fetchMenu();
  }, [currentChefId]);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/dishes/${currentChefId}`);
      const data = await response.json();
      if (response.ok) {
        setMenuItems(data.menu || []);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  // Handle adding a new dish to the menu
  const handleAddDish = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chef_id: currentChefId,
          dish_name: dishData.name,
          price_per_plate: parseFloat(dishData.price),
          category: dishData.category,
          available_portions: parseInt(dishData.portions, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to add dish');
      }

      setMessage({ type: 'success', text: data.message });
      // Reset form
      setDishData({ name: '', price: '', category: 'Lunch', portions: '' });
      // Refresh menu list
      fetchMenu();
    } catch (error) {
      console.error('Menu addition error:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#FDFBF7] min-h-screen pb-12 shadow-2xl rounded-3xl overflow-hidden font-sans border border-amber-100 flex flex-col">
      
      {/* Header Banner */}
      <div className="bg-[#8B4513] text-white pt-8 pb-12 px-6 rounded-b-[2.5rem] shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Daily Menu Manager</h1>
          <p className="text-xs text-amber-200 mt-1">Manage today's offerings and portion inventory</p>
        </div>
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-[#8B4513] shadow-inner">
          <Utensils size={24} />
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-10 space-y-6">
        
        {/* Status Feedback Banner */}
        {message.text && (
          <div className={`p-4 rounded-2xl flex items-center gap-2 text-sm shadow-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Add Dish Card Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-[#8B4513]" /> Add New Dish
          </h2>

          <form onSubmit={handleAddDish} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dish Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dish Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Homestyle Paneer Thali" 
                  value={dishData.name}
                  onChange={(e) => setDishData({...dishData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm bg-[#FFFDF9]"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Meal Category</label>
                <select 
                  value={dishData.category}
                  onChange={(e) => setDishData({...dishData, category: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm bg-[#FFFDF9]"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks/Special</option>
                </select>
              </div>

              {/* Price per plate */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Price per Plate (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="150" 
                  value={dishData.price}
                  onChange={(e) => setDishData({...dishData, price: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm bg-[#FFFDF9]"
                  required
                />
              </div>

              {/* Available Portions */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Available Portions</label>
                <input 
                  type="number" 
                  placeholder="10" 
                  value={dishData.portions}
                  onChange={(e) => setDishData({...dishData, portions: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm bg-[#FFFDF9]"
                  required
                />
              </div>

            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B4513] text-white py-3 rounded-2xl font-bold shadow-lg hover:bg-amber-900 transition tracking-wide text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Adding Dish...' : 'ADD TO DAILY MENU'}
              </button>
            </div>
          </form>
        </div>

        {/* Active Menu List Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Layers size={18} className="text-[#8B4513]" /> Today's Active Menu
          </h2>

          {menuItems.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No dishes added for today yet. Add your first dish above!</p>
          ) : (
            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#FFFDF9] border border-amber-100 rounded-2xl shadow-sm">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{item.dish_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.category} • <span className="font-semibold text-[#8B4513]">₹{item.price_per_plate}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-amber-100 text-[#8B4513] px-3 py-1 rounded-full font-bold">
                      {item.available_portions} portions left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}