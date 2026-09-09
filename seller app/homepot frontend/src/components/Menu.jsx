import React, { useState, useEffect } from 'react';

export default function Menu() {
  // Initialize state with an empty array. We will load from localStorage in a moment.
  const [menuItems, setMenuItems] = useState([]);

  // Modal / Form state for adding a new dish
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newCategory, setNewCategory] = useState('Lunch / Dinner');
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // 1. Load saved menu from localStorage when the component mounts
  useEffect(() => {
    const savedMenu = localStorage.getItem('homepot_chef_menu');
    if (savedMenu) {
      try {
        setMenuItems(JSON.parse(savedMenu));
      } catch (error) {
        console.error("Failed to parse saved menu:", error);
      }
    }
  }, []);

  // 2. Save menu to localStorage whenever the menuItems state changes
  useEffect(() => {
    localStorage.setItem('homepot_chef_menu', JSON.stringify(menuItems));
  }, [menuItems]);


  // Toggle availability of an item
  const handleToggleAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  // Delete a menu item
  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to remove this dish from your menu?')) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Add new menu item handler
  const handleAddDish = (e) => {
    e.preventDefault();
    if (!newDishName || !newPrice) {
      alert('Please enter a dish name and price.');
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newDishName,
      category: newCategory,
      price: parseFloat(newPrice),
      available: true,
      description: newDescription || 'Freshly prepared homestyle dish.'
    };

    setMenuItems([newItem, ...menuItems]);
    
    // Reset form fields
    setNewDishName('');
    setNewPrice('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center mt-2 px-1">
        <div>
          <h2 className="text-lg font-bold text-stone-800">Kitchen Menu</h2>
          <p className="text-[11px] text-stone-500">Manage your active dishes and daily pricing</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#8C4A32] hover:bg-[#783D29] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
        >
          <i className="fa-solid fa-plus text-[10px]"></i> Add Dish
        </button>
      </div>

      {/* Menu Items List */}
      <div className="flex flex-col gap-3">
        {menuItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-400 text-xs mt-4 shadow-sm animate-fadeIn">
            <i className="fa-solid fa-book-open text-3xl mb-2 text-stone-300"></i>
            <p className="font-semibold text-stone-500 mb-1">Your menu is currently empty.</p>
            <p>Click "Add Dish" above to create your first signature dish. It will be saved automatically!</p>
          </div>
        ) : (
          menuItems.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all animate-fadeIn flex flex-col gap-2.5 ${item.available ? 'border-orange-100' : 'border-stone-200 opacity-75'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-800 text-sm">{item.name}</h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${item.available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-500'}`}>
                      {item.available ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                  <span className="text-[10px] text-orange-800 font-medium bg-orange-50 px-2 py-0.5 rounded-md inline-block mt-1">
                    {item.category}
                  </span>
                </div>
                <span className="font-extrabold text-stone-900 text-sm">₹{item.price}</span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>

              <div className="flex justify-between items-center pt-2 border-t border-stone-100 mt-1">
                <button 
                  onClick={() => handleToggleAvailability(item.id)}
                  className={`text-[11px] font-semibold px-3 py-1 rounded-lg transition cursor-pointer ${item.available ? 'bg-stone-100 hover:bg-stone-200 text-stone-700' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'}`}
                >
                  <i className={`fa-solid ${item.available ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
                  {item.available ? 'Mark Sold Out' : 'Mark Available'}
                </button>

                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-rose-600 hover:text-rose-700 text-xs p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  title="Delete Item"
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================== */}
      {/* ADD NEW DISH MODAL                         */}
      {/* ========================================== */}
      {isAddModalOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-orange-100 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-800 text-base flex items-center gap-2">
                <i className="fa-solid fa-utensils text-[#8C4A32]"></i> Add New Dish
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleAddDish} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-stone-700">Dish Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ghee Podi Dosa" 
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  className="px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-stone-700">Category / Meal Slot</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] bg-white"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Lunch / Dinner">Lunch / Dinner</option>
                  <option value="Snacks / Specials">Snacks / Specials</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-stone-700">Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="150" 
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-stone-700">Description / Ingredients</label>
                <textarea 
                  placeholder="Briefly describe your dish..." 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  className="px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white py-2.5 rounded-xl font-bold transition shadow-sm mt-2 cursor-pointer"
              >
                Save & Add to Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}