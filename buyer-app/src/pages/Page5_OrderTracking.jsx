import React from 'react';
import { FiArrowLeft, FiPhone, FiCheck, FiMapPin, FiTruck } from 'react-icons/fi';
import { ShieldCheck, UtensilsCrossed } from 'lucide-react';

export default function OrderTracking({ order, onBack }) {
  const activeOrder = order || {
    id: '#HP-58210',
    date: 'Today, 2:15 PM',
    deliveryOtp: '4821',
    status: 'COOKING',
    items: [{ title: 'Authentic Chettinad Chicken Curry + 3 Parottas', quantity: 1, price: 100 }],
    totalAmount: 145,
    deliveryAddress: 'Anna Nagar, Flat 4B',
    rider: { name: 'Kumar V.', phone: '+91 98765 43210', vehicle: 'Electric Scooter (TN 09 BX 4521)' }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FAF6EE] text-[#2C1D14] pb-20 relative select-none">
      
      {/* Top Header with Back Button */}
      <div className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md px-4 py-3 border-b border-[#E2D5BE] flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2D5BE] text-[#8C4A32] font-bold text-xs shadow-xs hover:bg-[#F4EFE6] cursor-pointer active:scale-95"
        >
          <FiArrowLeft className="text-sm font-bold" />
          <span>Back to Menu</span>
        </button>

        <h2 className="font-serif font-bold text-sm text-[#2C1D14]">
          Live Order Tracking
        </h2>

        <div className="w-12"></div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Delivery OTP Card (To share with rider) */}
        <div className="bg-gradient-to-br from-[#8C4A32] to-[#683220] text-white p-5 rounded-3xl shadow-md text-center space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-orange-200 font-bold">Your Delivery Handover OTP</p>
          <h1 className="font-mono text-4xl font-extrabold tracking-widest text-amber-300 py-1">
            {activeOrder.deliveryOtp || '4821'}
          </h1>
          <p className="text-[10px] text-orange-100 max-w-xs mx-auto leading-tight">
            Share this 4-digit code with your delivery partner at your door to verify and collect your food parcel.
          </p>
        </div>

        {/* 3-Step Live Progress Timeline */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-xs text-[#2C1D14]">Order Status: {activeOrder.id}</h3>
          
          <div className="flex items-center justify-between relative px-2 pt-2">
            <div className="absolute left-6 right-6 top-5 h-0.5 bg-[#E2D5BE] -z-0"></div>

            {/* Step 1: Confirmed */}
            <div className="flex flex-col items-center z-10">
              <div className="w-6 h-6 rounded-full bg-[#8C4A32] text-white flex items-center justify-center text-xs shadow-xs">
                <FiCheck size={12} />
              </div>
              <span className="text-[9px] font-bold text-[#8C4A32] mt-1">Confirmed</span>
            </div>

            {/* Step 2: Amma Cooking */}
            <div className="flex flex-col items-center z-10">
              <div className="w-6 h-6 rounded-full bg-[#8C4A32] text-white flex items-center justify-center text-xs shadow-xs animate-pulse">
                <UtensilsCrossed size={12} />
              </div>
              <span className="text-[9px] font-bold text-[#8C4A32] mt-1">Amma Cooking</span>
            </div>

            {/* Step 3: Out for Delivery */}
            <div className="flex flex-col items-center z-10">
              <div className="w-6 h-6 rounded-full bg-white border border-[#D2C5B6] text-[#7C746E] flex items-center justify-center text-xs shadow-xs">
                <FiTruck size={12} />
              </div>
              <span className="text-[9px] font-bold text-[#7C746E] mt-1">On the Way</span>
            </div>
          </div>
        </div>

        {/* Delivery Partner Details */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF5EE] border border-[#E2D5BE] flex items-center justify-center text-lg">
              🛵
            </div>
            <div>
              <p className="text-[10px] text-[#7C746E] uppercase font-bold">Delivery Partner</p>
              <p className="text-xs font-bold text-[#2C1D14]">{activeOrder.rider.name}</p>
              <p className="text-[10px] text-[#7C746E]">{activeOrder.rider.vehicle}</p>
            </div>
          </div>

          <a
            href={`tel:${activeOrder.rider.phone}`}
            className="w-9 h-9 rounded-full bg-[#FAF5EE] border border-[#E2D5BE] text-[#8C4A32] hover:bg-[#8C4A32] hover:text-white transition flex items-center justify-center shadow-xs"
          >
            <FiPhone size={15} />
          </a>
        </div>

        {/* Order Details */}
        <div className="bg-[#FAF4EB] p-4 rounded-3xl border border-[#E2D5BE] space-y-2 text-xs">
          <div className="flex justify-between border-b border-[#E2D5BE] pb-1.5">
            <span className="font-bold text-[#7C746E]">Delivering to:</span>
            <span className="font-semibold text-[#2C1D14] text-right truncate max-w-[180px]">{activeOrder.deliveryAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-[#7C746E]">Amount to Pay:</span>
            <span className="font-bold text-[#8C4A32]">₹{activeOrder.totalAmount} ({activeOrder.paymentMode || 'COD'})</span>
          </div>
        </div>

      </div>
    </div>
  );
}
