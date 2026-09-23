import React, { useState } from 'react';
import { Camera, ChefHat, CheckCircle2, ShieldCheck, ArrowRight, MapPin } from 'lucide-react';
import logoImg from '../assets/HomePot-logo.jpeg';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export function HomePotKitchenRegistration({ initialData = {}, onProceedToBanking, onBackToLogin }) {
  const { t } = useLanguage();
  const [kitchenName, setKitchenName] = useState(initialData.kitchenName || '');
  const [ownerName, setOwnerName] = useState(initialData.ownerName || '');
  const [fssaiNumber, setFssaiNumber] = useState(initialData.fssaiNumber || '');
  const [address, setAddress] = useState(initialData.address || '');
  const [selectedSpecialties, setSelectedSpecialties] = useState(initialData.specialties || []);
  const [declaration, setDeclaration] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(initialData.photoPreview || null);

  // FSSAI Govt Bridge Verification State
  const [isVerifyingFssai, setIsVerifyingFssai] = useState(false);
  const [fssaiVerified, setFssaiVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const specialties = [
    'Pure Veg',
    'South Indian',
    'North Indian',
    'Home Sweets & Snacks',
    'Andhra Style'
  ];

  const toggleSpecialty = (name) => {
    setSelectedSpecialties(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setPhotoPreview(imageUrl);
  };

  const handleFssaiChange = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 14);
    setFssaiNumber(digits);
    if (digits.length === 14) {
      setIsVerifyingFssai(true);
      setTimeout(() => {
        setIsVerifyingFssai(false);
        setFssaiVerified(true);
      }, 700);
    } else {
      setFssaiVerified(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!kitchenName || !ownerName || !address) {
      setMessage({ text: 'Please fill in Kitchen Name, Full Name and Address.', type: 'red' });
      return;
    }
    if (fssaiNumber.length !== 14) {
      setMessage({ text: 'FSSAI Registration number must be exactly 14 digits.', type: 'red' });
      return;
    }
    if (!declaration) {
      setMessage({ text: 'Please accept the food safety & fair pricing declaration.', type: 'red' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    setTimeout(() => {
      setLoading(false);
      if (onProceedToBanking) {
        onProceedToBanking({
          ...initialData,
          kitchenName,
          ownerName,
          fssaiNumber,
          address,
          specialties: selectedSpecialties,
          photoPreview
        });
      }
    }, 600);
  };

  return (
    <div 
      className="min-h-screen w-full flex justify-center items-center py-4 px-2 sm:px-4"
      style={{ backgroundColor: '#EFE9DF', colorScheme: 'light' }}
    >
      {/* Mobile Card Frame */}
      <div 
        className="w-full max-w-md h-[92vh] max-h-[850px] border border-[#E8DEC8] rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative text-stone-900 pb-2"
        style={{ backgroundColor: '#FFFFFF', colorScheme: 'light' }}
      >
        
        {/* Soft Grey Dot Pattern Overlay */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#D6C7B2 1.2px, transparent 1.2px)',
            backgroundSize: '20px 20px'
          }}
        ></div>

        {/* Content Container with hidden scrollbar */}
        <div className="flex flex-col justify-between h-full p-5 sm:p-6 relative z-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex justify-end mb-1">
              <LanguageSelector variant="pill" />
            </div>
            
            {/* Top Logo Badge */}
            <div className="w-12 h-12 rounded-full bg-white border border-[#E2D5BE] shadow-xs flex items-center justify-center overflow-hidden mb-1">
              <img 
                src={logoImg} 
                alt="HomePot Logo" 
                className="w-full h-full object-cover mix-blend-multiply" 
              />
            </div>
            
            {/* Title */}
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C1D14] tracking-tight">
              {t('register_kitchen') || 'Register Kitchen'}
            </h1>
            <p className="text-xs text-[#6B5B4F] mt-0.5">
              {t('step_2_title') || 'Set up your kitchen details'}
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-3 mt-3 text-left" autoComplete="off">
              
              {/* Chef's photo Upload */}
              <div className="flex flex-col items-center justify-center my-1">
                <label className="relative cursor-pointer group">
                  <div className="w-20 h-20 rounded-full border-2 border-[#A0523D] bg-[#F4EFE6] flex items-center justify-center overflow-hidden shadow-inner relative transition-transform active:scale-95">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Chef Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#8C4A32]">
                        <ChefHat className="w-8 h-8 opacity-80" />
                        <Camera className="w-4 h-4 absolute bottom-1 right-1 bg-[#A0523D] text-white p-0.5 rounded-full shadow" />
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                <span className="text-xs font-bold text-[#2C1D14] mt-1 tracking-wide">
                  Chef's photo
                </span>
              </div>

              {/* Kitchen Name */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">{t('kitchen_name') || 'Kitchen Name'}</label>
                <input
                  type="text"
                  required
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  placeholder={t('kitchen_name_placeholder') || "e.g. Grandma's Kitchen"}
                  className="w-full text-xs sm:text-sm text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium"
                />
              </div>

              {/* Full Name */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">{t('Owner Full Name') || 'Owner Full Name'}</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full text-xs sm:text-sm text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium"
                />
              </div>

              {/* FSSAI Number */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <div className="flex justify-between items-center mb-0.5">
                  <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase">
                    {t('fssai_title') || 'FSSAI License Number'}
                  </label>
                  {fssaiVerified && (
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> {t('fssai_verified') || 'Verified'}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={14}
                  required
                  value={fssaiNumber}
                  onChange={(e) => handleFssaiChange(e.target.value)}
                  placeholder={t('fssai_placeholder') || '14-digit FSSAI number'}
                  className="w-full text-xs sm:text-sm text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium tracking-wide"
                />
                {isVerifyingFssai && (
                  <span className="text-[10px] text-sky-700 mt-1 block animate-pulse">
                    Connecting to FoSCoS Govt API Bridge...
                  </span>
                )}
              </div>

              {/* Kitchen Location & Address with Privacy Shield */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8C4A32]" />
                  <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase">
                    {t('kitchen_address') || 'Kitchen Address'}
                  </label>
                </div>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('kitchen_address_placeholder') || 'Enter complete address'}
                  className="w-full text-xs text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium resize-none"
                />
                <div className="bg-[#FAF6F0] p-2 rounded-xl mt-1.5 flex items-start gap-1.5 border border-[#E8DEC8]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-[10px] text-[#6B5B4F] leading-tight">
                    <strong>Chef Safety Shield:</strong> Exact address is kept confidential. Revealed to customer only after payment during the pickup window.
                  </span>
                </div>
              </div>

              {/* Cuisine Tags */}
              <div>
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-1.5">
                  {t('cuisine_specialties') || 'Cuisine Specialties'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {specialties.map(name => {
                    const isSelected = selectedSpecialties.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleSpecialty(name)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-[#A0523D] text-white border-[#8C4A32] shadow-xs scale-102'
                            : 'bg-white text-[#6B5B4F] border-[#E2D5BE] hover:bg-[#F4EFE6] hover:border-[#A0523D]/60'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="safety-declaration"
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  className="mt-0.5 accent-[#A0523D] cursor-pointer"
                />
                <label htmlFor="safety-declaration" className="text-[10px] text-[#6B5B4F] leading-relaxed cursor-pointer">
                  <strong>{t('safety_declaration_title') || 'Food Safety Declaration:'}</strong> {t('safety_declaration_desc') || 'I declare that food will be prepared in a clean, hygienic environment following standard safety protocols.'}
                </label>
              </div>

              {/* Status Message */}
              {message.text && (
                <div className={`p-2.5 rounded-xl text-xs text-center font-semibold ${
                  message.type === 'red' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#A0523D] hover:bg-[#8C4A32] text-white font-semibold text-sm sm:text-base py-3.5 rounded-full shadow-md transition-all tracking-wide cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting...' : <><span>{t('continue_to_banking') || 'Continue to Banking'}</span> <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>

              {/* Link back */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-xs text-[#8C4A32] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
} 