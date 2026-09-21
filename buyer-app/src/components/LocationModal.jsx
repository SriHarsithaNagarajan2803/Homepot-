import React, { useState } from 'react';
import { FiMapPin, FiNavigation, FiCheck, FiX } from 'react-icons/fi';

export default function LocationModal({ isOpen, onClose, currentLocation, onSelectLocation }) {
  if (!isOpen) return null;

  const [customAddress, setCustomAddress] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const savedLocations = [
    { label: 'Home', address: 'Anna Nagar, Flat 4B, 2nd Avenue' },
    { label: 'Office', address: 'T. Nagar, North Usman Road' },
    { label: 'Neighborhood', address: 'Vadapalani, 2nd Cross Street' },
    { label: 'Hostel / PG', address: 'Velachery Main Road, Near Station' }
  ];

  const handleUseGPS = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetecting(false);
          const detected = 'Vadapalani, Chennai (Within 5 km)';
          onSelectLocation(detected);
          onClose();
        },
        () => {
          setIsDetecting(false);
          onSelectLocation('Anna Nagar, Chennai (5 km GPS)');
          onClose();
        },
        { timeout: 3000 }
      );
    } else {
      setIsDetecting(false);
      onSelectLocation('Anna Nagar, Flat 4B');
      onClose();
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customAddress.trim()) {
      onSelectLocation(customAddress.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF6EE] border border-[#E2D5BE] rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-4 text-[#2C1D14]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#E2D5BE] pb-2.5">
          <div className="flex items-center gap-2 text-[#8C4A32]">
            <FiMapPin className="text-lg" />
            <h3 className="font-serif font-bold text-base text-[#2C1D14]">Choose Location</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white border border-[#E2D5BE] flex items-center justify-center text-[#6B5B4F] hover:bg-[#F4EFE6] cursor-pointer"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        {/* GPS Button */}
        <button
          type="button"
          onClick={handleUseGPS}
          disabled={isDetecting}
          className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition"
        >
          <FiNavigation className={isDetecting ? "animate-spin" : ""} />
          <span>{isDetecting ? "Detecting GPS..." : "Use Current GPS Location"}</span>
        </button>

        {/* Saved Locations */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-[#7C746E] uppercase tracking-wider">Nearby Delivery Hubs (5 km)</p>
          {savedLocations.map((loc) => {
            const isSelected = currentLocation.includes(loc.label) || currentLocation === loc.address;
            return (
              <button
                key={loc.label}
                type="button"
                onClick={() => {
                  onSelectLocation(`${loc.label}: ${loc.address}`);
                  onClose();
                }}
                className={`w-full p-2.5 rounded-2xl border text-left flex justify-between items-center transition cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-50 border-[#8C4A32] text-[#8C4A32] font-bold' 
                    : 'bg-white border-[#E2D5BE] text-[#2C1D14] hover:bg-[#FAF5EE]'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">{loc.label}</p>
                  <p className="text-[10px] text-[#6B5B4F] mt-0.5 leading-snug">{loc.address}</p>
                </div>
                {isSelected && <FiCheck className="text-sm text-[#8C4A32] shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} className="space-y-2 pt-1 border-t border-[#E2D5BE]">
          <label className="text-[10px] font-bold text-[#7C746E] uppercase tracking-wider block">Or Enter Address / Pincode</label>
          <div className="flex gap-1.5">
            <input 
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="e.g. Besant Nagar, 600090"
              className="flex-1 bg-white border border-[#E2D5BE] rounded-xl px-3 py-1.5 text-xs text-[#2C1D14] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#2C1D14] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-black"
            >
              Set
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
