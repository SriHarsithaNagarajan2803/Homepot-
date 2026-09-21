import React from 'react';
import { FiUser, FiPhone, FiMail, FiMapPin, FiClock, FiShoppingBag, FiHelpCircle, FiLogOut, FiArrowRight, FiCheck } from 'react-icons/fi';

export default function Profile({ onBack, onReorder, onTrackOrder, activeOrder, orderHistory = [] }) {
  const defaultHistory = [
    {
      id: '#HP-99824',
      date: 'Today, 1:15 PM',
      dish: 'Authentic Chettinad Chicken Curry + 3 Parottas',
      chef: 'Radha Amma',
      amount: 145,
      status: 'DELIVERED',
      itemsCount: 1
    },
    {
      id: '#HP-88712',
      date: 'Yesterday, 9:30 AM',
      dish: 'Traditional Ghee Podi Idli & Vadai',
      chef: 'Saraswathi Amma',
      amount: 135,
      status: 'DELIVERED',
      itemsCount: 2
    },
    {
      id: '#HP-77610',
      date: '18-Sep-2026, 8:45 PM',
      dish: 'Authentic Egg Curry + Roti',
      chef: 'Radha Amma',
      amount: 145,
      status: 'DELIVERED',
      itemsCount: 1
    }
  ];

  const history = orderHistory.length > 0 ? orderHistory : defaultHistory;

  return (
    <div className="flex flex-col min-h-full bg-[#FAF6EE] text-[#2C1D14] pb-24 relative select-none">
      
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md px-5 py-3 border-b border-[#E2D5BE] flex items-center justify-between">
        <h2 className="font-serif font-bold text-base text-[#2C1D14]">My Profile & Orders</h2>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
          Active Buyer
        </span>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Profile Card Header */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-[#8C4A32] text-white flex items-center justify-center text-xl font-bold font-serif shadow-xs">
            H
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#2C1D14]">Harshitha</h3>
            <p className="text-xs text-[#6B5B4F] flex items-center gap-1 mt-0.5">
              <FiPhone size={12} /> +91 93456 05005
            </p>
            <p className="text-[10px] text-[#A09890] flex items-center gap-1">
              <FiMail size={11} /> harshitha@homepot.com
            </p>
          </div>
        </div>

        {/* Active Order Banner if exists */}
        {activeOrder && (
          <div className="bg-[#FAF4EB] border-2 border-[#8C4A32] p-4 rounded-3xl shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#8C4A32] uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                Active Order in Progress
              </span>
              <span className="font-mono text-xs font-bold text-[#2C1D14]">{activeOrder.id}</span>
            </div>
            <p className="text-xs font-bold text-[#2C1D14]">
              {activeOrder.items?.[0]?.title || 'Hot Home Food'}
            </p>
            <div className="flex justify-between items-center pt-1 border-t border-[#E2D5BE]">
              <span className="text-xs font-bold text-[#8C4A32]">OTP: {activeOrder.deliveryOtp || '4821'}</span>
              <button
                type="button"
                onClick={onTrackOrder}
                className="bg-[#8C4A32] hover:bg-[#783D29] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span>Live Tracking</span>
                <FiArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* Order History Section */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs space-y-3">
          <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-2">
            <div className="flex items-center gap-1.5">
              <FiClock className="text-[#8C4A32]" />
              <h3 className="font-serif font-bold text-xs text-[#2C1D14]">Order History</h3>
            </div>
            <span className="text-[10px] text-[#7C746E]">{history.length} Orders</span>
          </div>

          <div className="space-y-2.5">
            {history.map((order, idx) => (
              <div 
                key={order.id || idx}
                className="p-3 bg-[#FAF6EE] rounded-2xl border border-[#E2D5BE] flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-xs text-[#2C1D14]">{order.id}</span>
                    <p className="text-[10px] text-[#7C746E]">{order.date}</p>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <FiCheck size={10} /> {order.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#2C1D14]">{order.dish}</p>
                <p className="text-[10px] text-[#6B5B4F]">By {order.chef}</p>

                <div className="flex justify-between items-center pt-1 border-t border-[#E8DEC8]">
                  <span className="font-mono font-bold text-xs text-[#8C4A32]">₹{order.amount}</span>
                  <button
                    type="button"
                    onClick={() => onReorder && onReorder(order)}
                    className="bg-white hover:bg-[#FAF4EB] border border-[#8C4A32] text-[#8C4A32] text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition active:scale-95"
                  >
                    Re-Order 🍲
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs space-y-2 text-xs">
          <h3 className="font-serif font-bold text-xs text-[#2C1D14] flex items-center gap-1.5 border-b border-[#F4EFE6] pb-2">
            <FiMapPin className="text-[#8C4A32]" />
            <span>Saved Addresses</span>
          </h3>
          <div className="space-y-1.5 text-[#6B5B4F] text-[11px]">
            <p><b>Home:</b> Anna Nagar, Flat 4B, 2nd Avenue, Chennai</p>
            <p><b>Office:</b> T. Nagar, North Usman Road, Chennai</p>
          </div>
        </div>

        {/* Support & Logout */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => alert('HomePot 24x7 Customer Helpline: 1800-HOMEPOT (1800-466-3768)')}
            className="w-full bg-white border border-[#E2D5BE] text-[#2C1D14] text-xs font-bold py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-[#FAF4EB]"
          >
            <FiHelpCircle />
            <span>24x7 Help & Support</span>
          </button>
        </div>

      </div>
    </div>
  );
}
