import React from 'react';
import { FiArrowLeft, FiPhone, FiCheck, FiClock, FiMapPin, FiShield } from 'react-icons/fi';
import { Truck, ShoppingBag } from 'lucide-react';

export default function OrderTracking({ order, onBack }) {
  const defaultOrder = {
    id: '#HP-99824',
    items: [{ title: 'Authentic Chettinad Chicken Curry + 3 Parottas', quantity: 1, chef: 'Radha Amma' }],
    totalAmount: 140,
    fulfillmentType: 'delivery',
    containerOption: 'packed',
    deliveryOtp: '4821',
    date: 'Today, 1:15 PM',
    location: 'Neighborhood Delivery Address'
  };

  const activeOrder = order || defaultOrder;
  const isPickup = activeOrder.fulfillmentType === 'pickup';

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
        <div className="bg-[#FAF4EB] border-2 border-[#8C4A32] p-5 rounded-3xl text-center space-y-2 shadow-sm">
          <span className="text-[10px] font-bold text-[#8C4A32] uppercase tracking-wider block">
            {isPickup ? 'Kitchen Handover Verification OTP' : 'Delivery Handover OTP'}
          </span>
          <div className="flex justify-center gap-2 py-1 font-mono font-extrabold text-3xl tracking-widest text-[#2C1D14]">
            {activeOrder.deliveryOtp.split('').map((char, idx) => (
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

        {/* 3-Step Live Status Tracker */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-xs text-[#2C1D14]">
            {isPickup ? 'Order Preparation Status' : 'Live Delivery Steps'}
          </h3>

          <div className="space-y-4 relative pl-6 border-l-2 border-[#8C4A32] ml-2 text-xs">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                ✓
              </span>
              <p className="font-bold text-[#2C1D14]">Order Confirmed by Chef</p>
              <p className="text-[10px] text-[#7C746E]">Amma received your order and started preparation</p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] animate-pulse">
                ●
              </span>
              <p className="font-bold text-[#2C1D14]">Amma Cooking with Farm Fresh Spices</p>
              <p className="text-[10px] text-[#7C746E]">
                {isPickup && activeOrder.containerOption === 'own_box'
                  ? 'Keep your clean box ready when you arrive at the kitchen.'
                  : 'Packing in hygienic disposable sealed container.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative opacity-60">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center text-[9px]">
                3
              </span>
              <p className="font-bold text-[#2C1D14]">
                {isPickup ? 'Ready for Pickup at Kitchen' : 'HomePot Rider Handover & Delivery'}
              </p>
              <p className="text-[10px] text-[#7C746E]">
                {isPickup ? 'Reach kitchen within 15-20 mins' : 'Delivery to your door'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#FAF5EE] border border-[#E2D5BE] flex items-center justify-center text-lg">
              {isPickup ? '👩‍🍳' : '🛵'}
            </div>
            <div>
              <p className="font-bold text-xs text-[#2C1D14]">
                {isPickup ? 'Radha Amma (Chef)' : 'Kumar (Delivery Partner)'}
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
