import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.jpeg';
import { useLanguage } from '../context/LanguageContext';

export default function ChefProfile() {
  const { t } = useLanguage();
  // Load initial profile from localStorage or fallback to defaults
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('homepot_chef_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse profile:", e);
      }
    }
    return {
      chefName: 'Chef Varun',
      kitchenName: 'Varun\'s Home Kitchen',
      handle: '_lyf_of_mr_v_20',
      phone: '+91 98765 43210',
      email: 'chef.varun@homepot.com',
      bio: 'Specializing in authentic traditional home-cooked meals prepared with love and premium ingredients.',
      specialties: 'South Indian, Biryani, Tiffins',
      isOpen: true,
      address: 'Chennai, Tamil Nadu',
      landmark: 'Near Nexus Vijaya Mall, Vadapalani',
      profileImg: logoImg
    };
  });

  // Load reviews from localStorage
  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem('homepot_chef_reviews');
    if (savedReviews) {
      try {
        const parsed = JSON.parse(savedReviews);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse reviews:", e);
      }
    }
    return [];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [savedMessage, setSavedMessage] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Keep profile localStorage updated
  const handleSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    localStorage.setItem('homepot_chef_profile', JSON.stringify(formData));
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleToggleOnline = () => {
    const updated = { ...profile, isOpen: !profile.isOpen };
    setProfile(updated);
    setFormData(updated);
    localStorage.setItem('homepot_chef_profile', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  // Handle Image upload via file selector
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImg: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Share profile via link
  const handleShareProfile = () => {
    const shareUrl = window.location.href.split('#')[0] + `#profile-${profile.handle || 'chef'}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 3000);
      }).catch(() => {
        alert(`Share link: ${shareUrl}`);
      });
    } else {
      alert(`Share link: ${shareUrl}`);
    }
  };

  // Delete a review (Chef moderation control)
  const handleDeleteReview = (id) => {
    const updatedReviews = reviews.filter((rev) => rev.id !== id);
    setReviews(updatedReviews);
    localStorage.setItem('homepot_chef_reviews', JSON.stringify(updatedReviews));
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length).toFixed(1) 
    : '5.0';

  return (
    <div className="flex flex-col gap-4 pb-6 animate-fadeIn font-sans antialiased text-stone-800">
      
      {/* SEPARATE CARD: Chef Profile Photo Showcase */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/50 rounded-bl-full pointer-events-none"></div>

        <div className="flex items-center gap-4">
          {/* Profile Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-300 via-orange-400 to-amber-100 shadow-md">
              <img 
                src={profile.profileImg || logoImg} 
                alt="Chef Avatar" 
                className="w-full h-full object-cover rounded-full border-2 border-white" 
              />
            </div>
            <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${profile.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} title={profile.isOpen ? t('kitchen_open') : t('kitchen_closed')}></span>
          </div>

          {/* Chef Identity & Status */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h2 className="text-base font-bold tracking-tight font-serif text-stone-900 truncate">{profile.chefName}</h2>
                <p className="text-xs text-[#8C4A32] font-mono font-semibold">@{profile.handle}</p>
              </div>

              {/* Highly Visible & Bold Open/Closed Toggle Button */}
              <button 
                onClick={handleToggleOnline}
                className={`px-4 py-2 rounded-2xl text-xs font-black tracking-wider flex items-center gap-2 transition-all duration-300 shadow-lg transform active:scale-95 cursor-pointer border ${
                  profile.isOpen 
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30 hover:bg-emerald-600' 
                    : 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30 hover:bg-rose-700'
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  {profile.isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>}
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span>{profile.isOpen ? t('open') : t('closed')}</span>
                <i className={`fa-solid ${profile.isOpen ? 'fa-store text-xs ml-0.5' : 'fa-store-slash text-xs ml-0.5'}`}></i>
              </button>
            </div>

            <p className="text-[11px] text-stone-500 mt-1.5 truncate flex items-center gap-1 font-medium">
              <i className="fa-solid fa-map-pin text-[#8C4A32]"></i> {profile.landmark || profile.address}
            </p>
            <span className="inline-block bg-orange-50 text-orange-800 border border-orange-200/60 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide mt-1.5 uppercase">
              {profile.specialties}
            </span>
          </div>
        </div>

        {/* Share Profile Link Button */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-medium">{t('share_kitchen_prompt')}</span>
          <button 
            onClick={handleShareProfile}
            className="bg-orange-50 hover:bg-orange-100 text-[#8C4A32] border border-orange-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <i className="fa-solid fa-share-nodes text-xs"></i>
            {shareCopied ? t('link_copied') : t('share_profile_btn')}
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl flex items-center gap-2 animate-fadeIn font-medium">
          <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
          <span>{t('profile_updated_success')}</span>
        </div>
      )}

      {/* Profile Details or Edit Form Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 font-serif">
            <i className="fa-solid fa-user-gear text-[#8C4A32]"></i> {t('kitchen_profile_details')}
          </h3>
          {!isEditing ? (
            <button 
              onClick={() => { setFormData(profile); setIsEditing(true); }}
              className="text-xs font-bold text-[#8C4A32] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <i className="fa-solid fa-pen-to-square"></i> {t('edit_profile')}
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(false)}
              className="text-xs font-bold text-stone-500 hover:underline cursor-pointer"
            >
              {t('cancel')}
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="flex flex-col gap-3 text-xs text-stone-700">
            <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100/60">
              <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">{t('kitchen_name')}</span>
              <p className="font-semibold text-stone-900 mt-0.5 text-sm">{profile.kitchenName}</p>
            </div>

            <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100/60">
              <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">{t('location_landmark')}</span>
              <p className="font-semibold text-stone-900 mt-0.5 flex items-center gap-1.5">
                <i className="fa-solid fa-map-pin text-[#8C4A32]"></i> {profile.landmark || profile.address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100/60">
                <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">{t('phone_number_label')}</span>
                <p className="font-semibold text-stone-900 mt-0.5 font-mono text-[11px]">{profile.phone}</p>
              </div>
              <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100/60">
                <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">{t('email_address')}</span>
                <p className="font-semibold text-stone-900 mt-0.5 truncate text-[11px]">{profile.email}</p>
              </div>
            </div>

            <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100/60">
              <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">{t('chef_bio')}</span>
              <p className="text-stone-600 mt-0.5 leading-relaxed font-normal">{profile.bio}</p>
            </div>

            <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100/60">
              <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">{t('instagram_handle')}</span>
              <p className="font-bold text-[#8C4A32] mt-0.5 font-mono text-xs">@{profile.handle}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-3 text-xs">
            {/* Upload Profile Image Inside Edit */}
            <div className="bg-orange-50/60 p-3.5 rounded-2xl border border-orange-100 flex flex-col items-center gap-2">
              <span className="font-bold text-stone-700 text-[11px]">{t('change_profile_picture')}</span>
              <div className="flex items-center gap-3">
                <img 
                  src={formData.profileImg || logoImg} 
                  alt="Preview" 
                  className="w-12 h-12 rounded-full object-cover border border-[#8C4A32]" 
                />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-[11px] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#8C4A32] file:text-white hover:file:bg-[#783D29] cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('chef_name')}</label>
              <input 
                type="text" 
                value={formData.chefName} 
                onChange={(e) => setFormData({ ...formData, chefName: e.target.value })}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] font-medium"
                required 
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('kitchen_name')}</label>
              <input 
                type="text" 
                value={formData.kitchenName} 
                onChange={(e) => setFormData({ ...formData, kitchenName: e.target.value })}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] font-medium"
                required 
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('location_landmark')}</label>
              <input 
                type="text" 
                value={formData.landmark} 
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                placeholder="e.g. Near Nexus Vijaya Mall, Vadapalani"
                className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-stone-700 block mb-1">{t('phone_number_label')}</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">{t('instagram_handle')}</label>
                <input 
                  type="text" 
                  value={formData.handle} 
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('cuisine_specialties')}</label>
              <input 
                type="text" 
                value={formData.specialties} 
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">{t('chef_bio')}</label>
              <textarea 
                rows={3}
                value={formData.bio} 
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] resize-none leading-relaxed"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white py-2.5 rounded-xl font-bold transition shadow-sm mt-2 cursor-pointer tracking-wide"
            >
              {t('save_changes')}
            </button>
          </form>
        )}
      </div>

      {/* CUSTOMER REVIEWS & MODERATION CARD */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 font-serif">
              <i className="fa-solid fa-star text-amber-500"></i> {t('customer_reviews_title')}
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {t('overall_rating')} <span className="font-bold text-stone-900">{averageRating} / 5.0</span> ({reviews.length} {t('reviews_count')})
            </p>
          </div>
          <span className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
            {t('chef_dashboard_badge')}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-6 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
            <i className="fa-solid fa-comments text-stone-300 text-2xl mb-1"></i>
            <p className="text-xs text-stone-500 font-medium">{t('no_reviews_yet')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100/70 flex flex-col gap-1.5 relative group">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-stone-900 text-xs">{rev.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="text-amber-500 text-[11px]">
                        {'★'.repeat(Math.floor(rev.rating))}
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium ml-1">{rev.date}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer"
                      title="Delete review"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed font-normal pr-4">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
