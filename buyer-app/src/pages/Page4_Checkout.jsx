import React, { useState } from 'react';
import { FiArrowLeft, FiMapPin, FiCheckCircle, FiShield, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { PackageCheck } from 'lucide-react';

export default function Checkout({ onBack, onOrderPlaced, cart = [], selectedLocation = 'Anna Nagar, Flat 4B' }) {
  const [paymentMode, setPaymentMode] = useState('COD'); // 'COD' or 'UPI'

  // Default fallback if cart empty
  const items = cart.length > 0 ? cart : [
    { id: 1, title: 'Authentic Chettinad Chicken Curry + 3 Parottas', price: 100, quantity: 1, chef: 'Radha Amma' }
  ];

  const itemsTotal = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = 30;
  const packagingFee = 15; // food-grade sealed plastic container
  const grandTotal = itemsTotal + deliveryFee + packagingFee;

  const handlePlaceOrder = () => {
    const orderData = {
      id: `#HP-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: items,
      totalAmount: grandTotal,
      paymentMode,
      deliveryOtp: '4821', // Given to buyer to share with rider upon handover
      deliveryAddress: selectedLocation,
      rider: { name: 'Kumar V.', phone: '+91 98765 43210', vehicle: 'Electric Scooter (TN 09 BX 4521)' },
      status: 'COOKING'
    };

    if (onOrderPlaced) onOrderPlaced(orderData);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FAF6EE] text-[#2C1D14] pb-24 relative select-none">
      
      {/* Sticky Top Header with Back Button */}
      <div className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md px-4 py-3 border-b border-[#E2D5BE] flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2D5BE] text-[#8C4A32] font-bold text-xs shadow-xs hover:bg-[#F4EFE6] cursor-pointer active:scale-95"
        >
          <FiArrowLeft className="text-sm font-bold" />
          <span>Back</span>
        </button>

        <h2 className="font-serif font-bold text-sm text-[#2C1D14]">
          Checkout & Book Order
        </h2>

        <div className="w-12"></div>
      </div>

      <div className="p-4 space-y-3.5">
        
        {/* Delivery Address Card */}
        <div className="bg-white p-3.5 rounded-3xl border border-[#E2D5BE] shadow-xs">
          <div className="flex items-center gap-2 text-[#8C4A32] font-bold text-xs mb-1">
            <FiMapPin />
            <span>Delivering To</span>
          </div>
          <p className="text-xs font-bold text-[#2C1D14]">{selectedLocation}</p>
          <p className="text-[10px] text-[#7C746E] mt-0.5">Est. Delivery: 25-30 mins from neighborhood home kitchen</p>
        </div>

        {/* Order Items List */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-xs text-[#2C1D14] border-b border-[#F4EFE6] pb-2">
            Selected Dishes in Pot
          </h3>

          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-[#2C1D14]">{item.title}</p>
                  <p className="text-[10px] text-[#7C746E]">
                    Qty: {item.quantity || 1} • By {item.chef || 'Radha Amma'}
                  </p>
                </div>
                <span className="font-mono font-bold text-[#8C4A32]">
                  ₹{item.price * (item.quantity || 1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sealed Packaging Guarantee */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2.5 text-xs">
          <PackageCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="text-[10px] text-emerald-950 font-medium">
            <b>Tamper-Proof Plastic Packaging:</b> Food delivered in clean sealed containers. No dabbas to return.
          </p>
        </div>

        {/* Payment Mode Selection */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs space-y-2.5">
          <h3 className="font-serif font-bold text-xs text-[#2C1D14]">Payment Method</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMode('COD')}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                paymentMode === 'COD' 
                  ? 'bg-amber-50 border-[#8C4A32] text-[#8C4A32] font-bold' 
                  : 'bg-[#FAF5EE] border-[#E2D5BE] text-[#6B5B4F]'
              }`}
            >
              <FiDollarSign className="text-base mb-1" />
              <p className="text-xs font-bold">Cash on Delivery</p>
              <p className="text-[9px] text-[#7C746E]">Pay cash upon delivery</p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode('UPI')}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                paymentMode === 'UPI' 
                  ? 'bg-amber-50 border-[#8C4A32] text-[#8C4A32] font-bold' 
                  : 'bg-[#FAF5EE] border-[#E2D5BE] text-[#6B5B4F]'
              }`}
            >
              <FiCreditCard className="text-base mb-1" />
              <p className="text-xs font-bold">UPI / GPay</p>
              <p className="text-[9px] text-[#7C746E]">Scan & Pay via UPI</p>
            </button>
          </div>
        </div>

        {/* Bill Details */}
        <div className="bg-[#FAF4EB] p-4 rounded-3xl border border-[#E2D5BE] space-y-2 text-xs">
          <div className="flex justify-between text-[#6B5B4F]">
            <span>Item Total</span>
            <span>₹{itemsTotal}</span>
          </div>
          <div className="flex justify-between text-[#6B5B4F]">
            <span>Delivery Fee (Within 5 km)</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between text-[#6B5B4F]">
            <span>Sealed Container Packaging</span>
            <span>₹{packagingFee}</span>
          </div>
          <div className="border-t border-[#E2D5BE] pt-2 flex justify-between font-extrabold text-sm text-[#2C1D14]">
            <span>Grand Total</span>
            <span className="text-[#8C4A32] font-mono">₹{grandTotal}</span>
          </div>
        </div>

      </div>

      {/* Sticky Book Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#FAF6EE] border-t border-[#E2D5BE] flex items-center justify-center z-50 shadow-2xl">
        <div className="w-full max-w-md px-2">
          <button 
            type="button"
            onClick={handlePlaceOrder}
            className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#256829] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <FiCheckCircle className="text-base" />
            <span>Confirm & Book Order • ₹{grandTotal}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
