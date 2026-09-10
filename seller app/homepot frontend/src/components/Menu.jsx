import React, { useState, useEffect, useRef } from 'react';
import { Camera, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X, Image as ImageIcon, Flame, Eye, EyeOff } from 'lucide-react';
import defaultFoodImg from '../assets/foodimage.png';
import { useLanguage } from '../context/LanguageContext';

export default function Menu() {
  const { t } = useLanguage();
  // 1. Menu Items State (loaded from localStorage)
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('homepot_chef_menu');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved menu", e);
      }
    }
    return [
      {
        id: 1,
        name: 'Masal Dosa with Sambar & Chutneys',
        category: 'Breakfast',
        price: 50,
        portions: 20,
        available: true,
        isVeg: true,
        description: 'Crispy golden dosa roasted in ghee with spiced potato masala filling and 2 fresh chutneys.',
        photo: null
      },
      {
        id: 2,
        name: 'Authentic Sambar Rice + Appalam',
        category: 'Lunch',
        price: 120,
        portions: 15,
        available: true,
        isVeg: true,
        description: 'Traditional home-cooked small onion sambar rice with ghee and crispy appalam.',
        photo: null
      }
    ];
  });

  // 2. Daily Kitchen Photo Verification State (Camera Only)
  const todayStr = new Date().toISOString().split('T')[0];
  const [dailyKitchenPhoto, setDailyKitchenPhoto] = useState(() => {
    const saved = localStorage.getItem('homepot_kitchen_photo_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayStr) {
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  });

  // Modal States
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState(null); // null for Add, ID for Edit

  // Form Fields
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState('Lunch');
  const [dishPrice, setDishPrice] = useState('');
  const [dishPortions, setDishPortions] = useState('15');
  const [dishIsVeg, setDishIsVeg] = useState(true);
  const [dishDescription, setDishDescription] = useState('');
  const [dishPhoto, setDishPhoto] = useState(null);

  // Live WebRTC Camera States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Save menu to localStorage
  useEffect(() => {
    localStorage.setItem('homepot_chef_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  // Open Dish Modal (Add or Edit)
  const openAddModal = () => {
    setEditingDishId(null);
    setDishName('');
    setDishCategory('Lunch');
    setDishPrice('');
    setDishPortions('15');
    setDishIsVeg(true);
    setDishDescription('');
    setDishPhoto(null);
    setIsDishModalOpen(true);
  };

  const openEditModal = (dish) => {
    setEditingDishId(dish.id);
    setDishName(dish.name);
    setDishCategory(dish.category || 'Lunch');
    setDishPrice(dish.price.toString());
    setDishPortions(dish.portions ? dish.portions.toString() : '15');
    setDishIsVeg(dish.isVeg !== undefined ? dish.isVeg : true);
    setDishDescription(dish.description || '');
    setDishPhoto(dish.photo || null);
    setIsDishModalOpen(true);
  };

  // Dish Photo upload handler (Optional)
  const handleDishPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDishPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Dish (Add or Edit)
  const handleSaveDish = (e) => {
    e.preventDefault();
    if (!dishName.trim() || !dishPrice) {
      alert('Please fill in dish name and price.');
      return;
    }

    if (editingDishId) {
      // Edit Existing
      setMenuItems(prev => prev.map(item => {
        if (item.id === editingDishId) {
          return {
            ...item,
            name: dishName.trim(),
            category: dishCategory,
            price: parseFloat(dishPrice),
            portions: parseInt(dishPortions) || 10,
            isVeg: dishIsVeg,
            description: dishDescription.trim(),
            photo: dishPhoto
          };
        }
        return item;
      }));
    } else {
      // Add New
      const newDish = {
        id: Date.now(),
        name: dishName.trim(),
        category: dishCategory,
        price: parseFloat(dishPrice),
        portions: parseInt(dishPortions) || 10,
        available: true,
        isVeg: dishIsVeg,
        description: dishDescription.trim() || 'Freshly prepared authentic home food.',
        photo: dishPhoto
      };
      setMenuItems([newDish, ...menuItems]);
    }

    setIsDishModalOpen(false);
  };

  // Delete Dish
  const handleDeleteDish = (id) => {
    if (window.confirm('Are you sure you want to remove this dish from your kitchen menu?')) {
      setMenuItems(prev => prev.filter(d => d.id !== id));
    }
  };

  // Toggle Availability
  const handleToggleAvailability = (id) => {
    setMenuItems(prev => prev.map(d => d.id === id ? { ...d, available: !d.available } : d));
  };

  // Adjust portions +/-
  const handleAdjustPortions = (id, delta) => {
    setMenuItems(prev => prev.map(d => {
      if (d.id === id) {
        const nextPortions = Math.max(0, (d.portions || 0) + delta);
        return {
          ...d,
          portions: nextPortions,
          available: nextPortions > 0 ? d.available : false
        };
      }
      return d;
    }));
  };

  // ========================================================
  // LIVE CAMERA ONLY FOR DAILY KITCHEN HYGIENE
  // ========================================================
  const startLiveCamera = async () => {
    setCameraError('');
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Webcam access error:", err);
      setCameraError('Camera access denied or device has no active webcam. Use camera capture below.');
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError('');
  };

  // Capture frame from live video feed
  const capturePhotoFromVideo = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

    const record = {
      photo: photoDataUrl,
      date: todayStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setDailyKitchenPhoto(record);
    localStorage.setItem('homepot_kitchen_photo_data', JSON.stringify(record));
    stopLiveCamera();
  };

  // Fallback Camera File Input (uses capture="environment" to force device camera)
  const handleCameraCaptureFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const record = {
          photo: reader.result,
          date: todayStr,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setDailyKitchenPhoto(record);
        localStorage.setItem('homepot_kitchen_photo_data', JSON.stringify(record));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 pb-6">
      
      {/* ======================================================== */}
      {/* 1. DAILY KITCHEN HYGIENE CAMERA PHOTO BANNER             */}
      {/* ======================================================== */}
      <div className={`p-3.5 rounded-2xl border transition-all ${
        dailyKitchenPhoto 
          ? 'bg-emerald-50/80 border-emerald-200' 
          : 'bg-[#FFF7ED] border-[#FDBA74] shadow-xs'
      }`}>
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5">
            <div className={`p-2 rounded-xl shrink-0 ${
              dailyKitchenPhoto ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-[#C2410C]'
            }`}>
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-[#2C1D14]">
                  {dailyKitchenPhoto ? t('daily_hygiene_verified') : t('daily_hygiene_required')}
                </h4>
                {dailyKitchenPhoto && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-[#6B5B4F] mt-0.5 leading-tight">
                {dailyKitchenPhoto 
                  ? `${t('daily_hygiene_verified_desc')} (${dailyKitchenPhoto.time})`
                  : t('daily_hygiene_desc')}
              </p>
            </div>
          </div>

          {dailyKitchenPhoto && (
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-emerald-300 shrink-0 shadow-xs">
              <img src={dailyKitchenPhoto.photo} alt="Kitchen" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Live Camera Action Button */}
        <div className="mt-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={startLiveCamera}
            className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
              dailyKitchenPhoto
                ? 'bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-[#A0523D] hover:bg-[#8C4A32] text-white shadow-xs'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{dailyKitchenPhoto ? t('retake_camera_btn') : t('open_camera_btn')}</span>
          </button>

          {/* Hidden HTML5 capture="environment" fallback input */}
          <label className="text-[10px] text-[#8C4A32] font-bold underline cursor-pointer hover:text-[#593222] shrink-0">
            <span>{t('direct_camera_btn')}</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handleCameraCaptureFile}
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MENU HEADER & ADD DISH BUTTON                        */}
      {/* ======================================================== */}
      <div className="flex justify-between items-center mt-1 px-1">
        <div>
          <h2 className="text-base font-serif font-bold text-[#2C1D14]">{t('menu_portions_title')}</h2>
          <p className="text-[10px] text-[#6B5B4F]">{t('menu_portions_subtitle')}</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#A0523D] hover:bg-[#8C4A32] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('add_dish_btn')}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 3. DISH CARDS LIST                                       */}
      {/* ======================================================== */}
      <div className="flex flex-col gap-2.5">
        {menuItems.length === 0 ? (
          <div className="bg-white/90 rounded-2xl p-6 text-center border border-[#E2D5BE] text-[#A39281] text-xs mt-2 shadow-xs">
            <p className="font-bold text-[#2C1D14] mb-1">Your menu is currently empty.</p>
            <p className="text-[11px]">Click "+ Add Dish" above to add your first delicious home-cooked item!</p>
          </div>
        ) : (
          menuItems.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white/95 rounded-2xl p-3 shadow-xs border transition-all flex flex-col gap-2 ${
                item.available ? 'border-[#E2D5BE]' : 'border-stone-200 opacity-65 bg-stone-50'
              }`}
            >
              {/* Dish Top Row: Image + Details + Price */}
              <div className="flex items-start gap-3">
                {/* Dish Photo Thumbnail (Optional or default) */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F4EFE6] border border-[#E8DEC8] shrink-0 relative">
                  <img 
                    src={item.photo || defaultFoodImg} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                  <span className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-full border border-white ${
                    item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} title={item.isVeg ? 'Veg' : 'Non-Veg'}></span>
                </div>

                {/* Dish Title, Category & Portions */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-bold text-xs sm:text-sm text-[#2C1D14] leading-tight truncate">
                      {item.name}
                    </h3>
                    <span className="font-extrabold text-sm text-[#8C4A32] shrink-0">
                      ₹{item.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#A0523D] bg-[#FAF6F0] px-1.5 py-0.5 rounded border border-[#E8DEC8]">
                      {item.category || 'Lunch'}
                    </span>
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                      item.available 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-stone-100 text-stone-500'
                    }`}>
                      {item.available ? t('available_badge') : t('sold_out_badge')}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#6B5B4F] mt-1 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Portion Manager & Action Buttons Row */}
              <div className="flex justify-between items-center pt-2 border-t border-[#F4EFE6] mt-0.5">
                {/* Portions Counter (+ / -) */}
                <div className="flex items-center gap-1.5 bg-[#FAF6F0] px-2 py-1 rounded-xl border border-[#E8DEC8]">
                  <span className="text-[10px] text-[#6B5B4F] font-semibold">{t('portions_label')}</span>
                  <button 
                    type="button"
                    onClick={() => handleAdjustPortions(item.id, -1)}
                    className="w-5 h-5 rounded-lg bg-white border border-[#E2D5BE] text-[#8C4A32] font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-[#F4EFE6]"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-[#2C1D14] w-5 text-center">
                    {item.portions || 0}
                  </span>
                  <button 
                    type="button"
                    onClick={() => handleAdjustPortions(item.id, 1)}
                    className="w-5 h-5 rounded-lg bg-white border border-[#E2D5BE] text-[#8C4A32] font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-[#F4EFE6]"
                  >
                    +
                  </button>
                </div>

                {/* Edit, Toggle Availability, Delete Actions */}
                <div className="flex items-center gap-1.5">
                  {/* Edit Button */}
                  <button 
                    onClick={() => openEditModal(item)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#FAF6F0] hover:bg-[#F4EFE6] text-[#2C1D14] border border-[#E2D5BE] flex items-center gap-1 cursor-pointer transition"
                    title="Edit Dish & Photo"
                  >
                    <Edit2 className="w-3 h-3 text-[#8C4A32]" />
                    <span>{t('edit_btn')}</span>
                  </button>

                  {/* Sold Out Toggle */}
                  <button 
                    onClick={() => handleToggleAvailability(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      item.available 
                        ? 'bg-stone-100 hover:bg-stone-200 text-stone-700' 
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.available ? t('mark_sold_out') : t('mark_available')}
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteDish(item.id)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Remove Dish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. ADD / EDIT DISH MODAL (WITH OPTIONAL PHOTO)           */}
      {/* ======================================================== */}
      {isDishModalOpen && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-3.5 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-[#E2D5BE] flex flex-col gap-3 max-h-[85vh] overflow-y-auto [scrollbar-width:none]">
            
            <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-2">
              <h3 className="font-serif font-bold text-[#2C1D14] text-base flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#A0523D]" />
                <span>{editingDishId ? t('edit_dish_title') : t('add_signature_dish')}</span>
              </h3>
              <button 
                onClick={() => setIsDishModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="flex flex-col gap-2.5 text-xs">
              
              {/* Optional Dish Photo Upload */}
              <div className="flex items-center gap-3 bg-[#FAF6F0] p-2.5 rounded-2xl border border-[#E8DEC8]">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#E2D5BE] shrink-0 flex items-center justify-center">
                  {dishPhoto ? (
                    <img src={dishPhoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-[#A39281]" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold uppercase text-[#593222] mb-0.5">
                    {t('dish_photo_optional')}
                  </label>
                  <label className="inline-block bg-[#A0523D] hover:bg-[#8C4A32] text-white text-[10px] font-bold py-1 px-2.5 rounded-lg cursor-pointer shadow-2xs">
                    <span>{dishPhoto ? t('change_photo') : t('upload_photo')}</span>
                    <input type="file" accept="image/*" onChange={handleDishPhotoChange} className="hidden" />
                  </label>
                  {dishPhoto && (
                    <button 
                      type="button" 
                      onClick={() => setDishPhoto(null)}
                      className="text-[10px] text-rose-600 hover:underline ml-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Dish Name */}
              <div className="flex flex-col gap-0.5">
                <label className="font-bold text-[#593222] text-[10px] uppercase">{t('dish_name_label')}</label>
                <input 
                  type="text" 
                  placeholder="e.g. Authentic Ghee Podi Idli" 
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="px-3 py-2 border border-[#E2D5BE] rounded-xl focus:outline-none focus:border-[#A0523D] text-xs text-[#2C1D14]"
                  required
                />
              </div>

              {/* Category & Meal Slot */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <label className="font-bold text-[#593222] text-[10px] uppercase">{t('meal_slot_label')}</label>
                  <select 
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value)}
                    className="px-3 py-2 border border-[#E2D5BE] rounded-xl focus:outline-none focus:border-[#A0523D] bg-white text-xs text-[#2C1D14]"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks & Sweets">Snacks & Sweets</option>
                  </select>
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="font-bold text-[#593222] text-[10px] uppercase">{t('food_type_label')}</label>
                  <button
                    type="button"
                    onClick={() => setDishIsVeg(!dishIsVeg)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      dishIsVeg 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${dishIsVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                    <span>{dishIsVeg ? "Pure Veg" : "Non-Veg"}</span>
                  </button>
                </div>
              </div>

              {/* Price & Portions Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <label className="font-bold text-[#593222] text-[10px] uppercase">{t('price_per_plate')}</label>
                  <input 
                    type="number" 
                    placeholder="120" 
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                    className="px-3 py-2 border border-[#E2D5BE] rounded-xl focus:outline-none focus:border-[#A0523D] text-xs text-[#2C1D14]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  <label className="font-bold text-[#593222] text-[10px] uppercase">{t('daily_portions_label')}</label>
                  <input 
                    type="number" 
                    placeholder="15" 
                    value={dishPortions}
                    onChange={(e) => setDishPortions(e.target.value)}
                    className="px-3 py-2 border border-[#E2D5BE] rounded-xl focus:outline-none focus:border-[#A0523D] text-xs text-[#2C1D14]"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-0.5">
                <label className="font-bold text-[#593222] text-[10px] uppercase">{t('description_label')}</label>
                <textarea 
                  placeholder="Describe your homemade ingredients and taste..." 
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  rows={2}
                  className="px-3 py-2 border border-[#E2D5BE] rounded-xl focus:outline-none focus:border-[#A0523D] resize-none text-xs text-[#2C1D14]"
                />
              </div>

              {/* Submit / Save Button */}
              <button 
                type="submit"
                className="w-full bg-[#A0523D] hover:bg-[#8C4A32] text-white py-3 rounded-full font-bold text-xs transition shadow-xs mt-1 cursor-pointer active:scale-95"
              >
                {editingDishId ? t('update_dish_btn') : t('save_dish_btn')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. LIVE WEBRTC CAMERA MODAL (NO GALLERY - STRICT CAMERA) */}
      {/* ======================================================== */}
      {isCameraOpen && (
        <div className="absolute inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1E293B] rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-stone-700 flex flex-col gap-3 text-white">
            
            <div className="flex justify-between items-center border-b border-stone-700 pb-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Live Kitchen Camera</h3>
              </div>
              <button 
                onClick={stopLiveCamera}
                className="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {cameraError ? (
              <div className="bg-rose-950/60 border border-rose-800 p-3 rounded-2xl text-xs text-rose-300 text-center">
                <p>{cameraError}</p>
                <label className="inline-block mt-3 bg-rose-700 text-white font-bold py-2 px-4 rounded-xl cursor-pointer">
                  <span>Take Photo with Mobile Camera</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    onChange={(e) => {
                      handleCameraCaptureFile(e);
                      stopLiveCamera();
                    }}
                    className="hidden" 
                  />
                </label>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-full aspect-4/3 bg-black rounded-2xl overflow-hidden relative border border-stone-700">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  ></video>
                  <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded-full text-[9px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>LIVE VIEW</span>
                  </div>
                </div>

                <p className="text-[10px] text-stone-400 text-center">
                  Point camera at your clean kitchen cooking counter and tap Shutter.
                </p>

                <button
                  type="button"
                  onClick={capturePhotoFromVideo}
                  className="w-14 h-14 rounded-full bg-white text-stone-900 border-4 border-emerald-500 flex items-center justify-center shadow-lg hover:scale-105 active:scale-90 transition cursor-pointer"
                  title="Capture Photo"
                >
                  <Camera className="w-6 h-6 text-stone-900" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
