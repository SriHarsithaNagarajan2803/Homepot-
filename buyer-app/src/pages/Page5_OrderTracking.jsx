import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPhone, FiCheck, FiClock, FiMapPin, FiShield, FiAlertTriangle } from 'react-icons/fi';
import { Truck, ShoppingBag, UtensilsCrossed, AlertCircle } from 'lucide-react';

export default function OrderTracking({ order, onBack }) {
  const defaultOrder = {
    id: '#HP-48921',
    items: [{ title: 'Authentic Chettinad Chicken Curry + 3 Parottas', quantity: 2, chef: 'Radha Amma' }],
    totalAmount: 280,
    fulfillmentType: 'delivery',
    containerOption: 'packed',
    deliveryOtp: '4821',
    date: 'Today, 1:15 PM',
    location: 'Door 14, 5th Main Road, Vadapalani, Chennai'
  };

  const activeOrder = order || defaultOrder;
  const isPickup = activeOrder.fulfillmentType === 'pickup';

  // Live order status synced with delivery app
  // 'CHEF_ACCEPTED' | 'RIDER_ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
  const [orderStage, setOrderStage] = useState('OUT_FOR_DELIVERY');
  const [etaRemaining, setEtaRemaining] = useState(11);

  // Listen to shared live storage notifications
  useEffect(() => {
    const handleStorage = () => {
      try {
        const raw = localStorage.getItem('homepot_live_notification');
        if (raw) {
          const notif = JSON.parse(raw);
          if (notif.title?.includes('Food Picked Up')) {
            setOrderStage('OUT_FOR_DELIVERY');
          } else if (notif.title?.includes('Delivery Partner Assigned')) {
            setOrderStage('RIDER_ASSIGNED');
          } else if (notif.title?.includes('Delivered')) {
            setOrderStage('DELIVERED');
          }
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-[#FAF6EE] text-[#2C1D14] pb-24 relative select-none">
      
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md px-4 py-3 border-b border-[#E2D5BE] flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2D5BE] text-[#8C4A32] font-bold text-xs shadow-xs hover:bg-[#F4EFE6] cursor-pointer active:scale-95"
        >
          <FiArrowLeft className="text-sm font-bold" />
          <span>Back to Feed</span>
        </button>

        <h2 className="font-serif font-bold text-xs text-[#2C1D14]">
          {isPickup ? 'Self-Pickup Tracking' : 'Live Delivery Tracking'}
        </h2>
        <div className="w-8" />
      </div>

      <div className="p-4 space-y-3.5">
        
        {/* OTP Handover Card */}
        <div className="bg-[#FAF4EB] border-2 border-[#8C4A32] p-4 sm:p-5 rounded-3xl text-center space-y-2 shadow-sm">
          <span className="text-[10px] font-bold text-[#8C4A32] uppercase tracking-wider block">
            {isPickup ? 'Kitchen Handover Verification OTP' : 'Delivery Handover OTP (Give to Rider)'}
          </span>
          <div className="flex justify-center gap-2 py-1 font-mono font-extrabold text-3xl tracking-widest text-[#2C1D14]">
            {(activeOrder.deliveryOtp || '4821').split('').map((char, idx) => (
              <span key={idx} className="bg-white border border-[#DFCBB5] w-12 h-14 rounded-2xl flex items-center justify-center shadow-xs">
                {char}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-[#6B5B4F]">
            {isPickup 
              ? 'Share this code with Radha Amma upon reaching the kitchen to collect your food.' 
              : 'Share this 4-digit code with the delivery partner upon arrival to confirm handover.'}
          </p>
        </div>

        {/* GOOGLE MAPS STYLE LIVE ROUTE WITH LIGHT RED TRAFFIC SECTION */}
        {!isPickup && (
          <div className="bg-white border border-[#E2D5BE] rounded-3xl p-4 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-serif font-bold text-xs text-[#2C1D14] flex items-center gap-1.5">
                <span>📍 Live Route & Traffic Map</span>
              </span>
              <span className="bg-[#8C4A32] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                ETA: {etaRemaining} mins (2.4 km)
              </span>
            </div>

            {/* Interactive SVG Map with Red Traffic Bottleneck */}
            <div className="relative h-44 bg-[#E8E4DA] rounded-2xl overflow-hidden border border-[#D2C5B6]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="buyer_grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DCD6C8" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="#E8E4DA" />
                <rect width="100%" height="100%" fill="url(#buyer_grid)" />

                {/* Secondary Roads */}
                <path d="M 0 100 Q 180 110 380 90" stroke="#FFFFFF" strokeWidth="12" fill="none" />
                <path d="M 120 0 Q 110 160 130 300" stroke="#FFFFFF" strokeWidth="14" fill="none" />
                <path d="M 260 0 Q 270 180 260 300" stroke="#FFFFFF" strokeWidth="14" fill="none" />

                {/* Route Segment 1: Clear Road (Green) */}
                <path d="M 40 120 L 120 80 L 120 60" stroke="#10B981" strokeWidth="7" strokeLinecap="round" fill="none" />

                {/* Route Segment 2: TRAFFIC JAM ROAD (LIGHT RED / AMBER-RED LIKE GOOGLE MAPS) */}
                <path 
                  d="M 120 60 L 220 60 L 260 50" 
                  stroke="#EA4335" 
                  strokeWidth="9" 
                  strokeLinecap="round" 
                  fill="none" 
                  filter="drop-shadow(0 0 5px rgba(234, 67, 53, 0.7))"
                />

                {/* Route Segment 3: Clear Road to Doorstep (Green) */}
                <path d="M 260 50 L 260 30 L 320 25" stroke="#10B981" strokeWidth="7" strokeLinecap="round" fill="none" />
              </svg>

              {/* Start: Amma's Kitchen */}
              <div className="absolute bottom-2 left-3 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded text-[8px] font-bold text-[#2C1D14] border border-[#D2C5B6]">
                <span>🍳 Radha Amma</span>
              </div>

              {/* Red Traffic Label Callout */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#EA4335] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span>2nd Avenue Traffic Slowdown (+4m delay)</span>
              </div>

              {/* Rider Scooter Marker */}
              <div className="absolute top-[38%] left-[48%] -translate-y-1/2 flex flex-col items-center">
                <span className="text-xl animate-bounce">🛵</span>
                <span className="bg-[#8C4A32] text-white text-[7px] font-bold px-1 rounded shadow-xs">
                  Kumar (Rider)
                </span>
              </div>

              {/* Destination: Your House */}
              <div className="absolute top-1 right-2 flex items-center gap-1 bg-white/95 px-1.5 py-0.5 rounded text-[8px] font-bold text-[#2C1D14] border border-[#D2C5B6]">
                <span>🏡 Your Home</span>
              </div>
            </div>

            {/* CUSTOMER REASSURANCE TRAFFIC BANNER */}
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-rose-950">
              <FiAlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-rose-900">
                  Live Traffic Notice: Slow Traffic on 2nd Avenue
                </p>
                <p className="text-[11px] text-rose-800 leading-snug mt-0.5">
                  Your delivery partner is temporarily waiting in traffic at the 2nd Avenue signal (marked in <b>light red</b> on the map above). Rest assured, your hot food is securely sealed in tamper-proof container!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4-Step Order Lifecycle Progress */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-xs text-[#2C1D14]">
            {isPickup ? 'Order Preparation Status' : 'Live Delivery Stages'}
          </h3>

          <div className="space-y-4 relative pl-6 border-l-2 border-[#8C4A32] ml-2 text-xs">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                ✓
              </span>
              <p className="font-bold text-[#2C1D14]">Chef Accepted & Started Cooking</p>
              <p className="text-[10px] text-[#7C746E]">Radha Amma is preparing fresh hot meals</p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                ✓
              </span>
              <p className="font-bold text-[#2C1D14]">Delivery Partner Assigned</p>
              <p className="text-[10px] text-[#7C746E]">Kumar V. accepted order & arrived at kitchen</p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] animate-pulse">
                ●
              </span>
              <p className="font-bold text-[#2C1D14]">Food Picked Up & On the Way</p>
              <p className="text-[10px] text-[#7C746E]">
                Rider navigating route to {activeOrder.location}
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative opacity-60">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center text-[9px]">
                4
              </span>
              <p className="font-bold text-[#2C1D14]">Delivery Handover at Doorstep</p>
              <p className="text-[10px] text-[#7C746E]">Provide OTP {activeOrder.deliveryOtp || '4821'} to confirm</p>
            </div>
          </div>
        </div>

        {/* Contact Delivery Partner & Chef */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#FAF5EE] border border-[#E2D5BE] flex items-center justify-center text-lg">
              {isPickup ? '👩‍🍳' : '🛵'}
            </div>
            <div>
              <p className="font-bold text-xs text-[#2C1D14]">
                {isPickup ? 'Radha Amma (Chef)' : 'Kumar V. (Delivery Partner)'}
              </p>
              <p className="text-[10px] text-[#6B5B4F]">
                {isPickup ? 'Kitchen: 2nd Cross Street (0.6km)' : 'Hero Splendor • TN 09 BK 4102'}
              </p>
            </div>
          </div>

          <a 
            href="tel:9876543210"
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 cursor-pointer shadow-xs transition"
          >
            <FiPhone size={15} />
          </a>
        </div>

      </div>
    </div>
  );
}
