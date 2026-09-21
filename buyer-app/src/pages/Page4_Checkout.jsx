import React, { useState } from 'react';
import { FiArrowLeft, FiMapPin, FiCreditCard, FiDollarSign, FiCheck, FiShield, FiShoppingBag } from 'react-icons/fi';
import { PackageCheck, Truck, ShoppingBag } from 'lucide-react';

export default function Checkout({ cart = [], selectedLocation = 'Choose delivery location', onBack, onOrderPlaced }) {
  const [paymentMode, setPaymentMode] = useState('COD');
  
  // Fulfillment Preference: 'delivery' vs 'pickup'
  const [fulfillmentType, setFulfillmentType] = useState('delivery'); // 'delivery' | 'pickup'

  // Packaging Preference for Pickup: 'own_box' (₹0 FREE) vs 'packed' (+₹15)
  const [containerOption, setContainerOption] = useState('own_box');

  const defaultItems = [
    {
      id: 1,
      title: 'Authentic Chettinad Chicken Curry + 3 Parottas',
      price: 100,
      quantity: 1,
      chef: 'Radha Amma'
    }
  ];

  const items = cart.length > 0 ? cart : defaultItems;
  const itemsTotal = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  // Delivery fee: ₹25 if delivery, ₹0 if pickup
  const deliveryFee = fulfillmentType === 'delivery' ? 25 : 0;

  // Packaging fee: ₹15 if delivery; if pickup: ₹15 if packed, ₹0 if own box
  const packagingFee = fulfillmentType === 'delivery' ? 15 : (containerOption === 'packed' ? 15 : 0);

  const grandTotal = itemsTotal + deliveryFee + packagingFee;

  const handleConfirmOrder = () => {
    const orderData = {
      id: `#HP-${Math.floor(10000 + Math.random() * 90000)}`,
      items,
      totalAmount: grandTotal,
      fulfillmentType,
      containerOption,
      deliveryFee,
      packagingFee,
      location: fulfillmentType === 'delivery' ? selectedLocation : "Amma's Neighborhood Kitchen (Direct Pickup)",
      paymentMode,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'CONFIRMED'
    };

    onOrderPlaced(orderData);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#FAF6EE] text-[#2C1D14] pb-28 relative select-none">
      
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md px-4 py-3 border-b border-[#E2D5BE] flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2D5BE] text-[#8C4A32] font-bold text-xs shadow-xs hover:bg-[#F4EFE6] cursor-pointer active:scale-95"
        >
          <FiArrowLeft className="text-sm font-bold" />
          <span>Back</span>
        </button>

        <h2 className="font-serif font-bold text-sm text-[#2C1D14]">Checkout & Confirm</h2>
        <div className="w-8" />
      </div>

      <div className="p-4 space-y-3.5">
        
        {/* CUSTOMER PREFERENCE: RIDER DELIVERY VS SELF PICKUP */}
        <div className="bg-white p-4 rounded-3xl border border-[#E2D5BE] shadow-xs space-y-3">
          <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-2">
            <span className="font-serif font-bold text-xs text-[#2C1D14]">Delivery or Self-Pickup</span>
            <span className="text-[10px] font-bold text-[#8C4A32]">Your Choice</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFulfillmentType('delivery')}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                fulfillmentType === 'delivery'
                  ? 'bg-amber-50 border-[#8C4A32] text-[#8C4A32] font-bold shadow-2xs'
                  : 'bg-[#FAF6EE] border-[#E2D5BE] text-[#6B5B4F]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#8C4A32]" />
                <span className="text-xs font-bold">Rider Delivery</span>
              </div>
              <p className="text-[9px] text-[#7C746E] mt-1">Doorstep delivery • ₹25 fee</p>
            </button>

            <button
              type="button"
              onClick={() => setFulfillmentType('pickup')}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                fulfillmentType === 'pickup'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold shadow-2xs'
                  : 'bg-[#FAF6EE] border-[#E2D5BE] text-[#6B5B4F]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold">Self-Pickup</span>
              </div>
              <p className="text-[9px] text-[#7C746E] mt-1">Reach kitchen • ₹0 free</p>
            </button>
          </div>

          {/* Destination / Address Card */}
          {fulfillmentType === 'delivery' ? (
            <div className="p-3 bg-[#FAF6EE] rounded-2xl border border-[#E8DEC8]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8C4A32] uppercase tracking-wider mb-0.5">
                <FiMapPin />
                <span>Delivering To Your Address</span>
              </div>
              <p className="text-xs font-bold text-[#2C1D14]">{selectedLocation}</p>
              <p className="text-[10px] text-[#7C746E] mt-0.5">Est. Delivery: 25-30 mins from neighborhood kitchen</p>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                <FiMapPin />
                <span>Pickup Directly from Amma's Kitchen</span>
              </div>
              <p className="text-xs font-bold text-emerald-950">
                Radha Amma's Kitchen, Plot 42, 2nd Cross Street (0.6 km from you)
              </p>
              
              {/* Packaging Choice for Self-Pickup */}
              <div className="pt-2 border-t border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-900 block mb-1.5">
                  Packaging Option:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setContainerOption('own_box')}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition text-xs ${
                      containerOption === 'own_box'
                        ? 'bg-emerald-700 text-white font-bold border-emerald-700'
                        : 'bg-white text-emerald-900 border-emerald-300'
                    }`}
                  >
                    <span className="block font-bold">🥘 Bring Own Dabba</span>
                    <span className="text-[9px] opacity-90">₹0 Free • Eco friendly</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContainerOption('packed')}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition text-xs ${
                      containerOption === 'packed'
                        ? 'bg-[#8C4A32] text-white font-bold border-[#8C4A32]'
                        : 'bg-white text-[#593222] border-emerald-300'
                    }`}
                  >
                    <span className="block font-bold">📦 Need Packed Box</span>
                    <span className="text-[9px] opacity-90">+₹15 packaging</span>
                  </button>
                </div>
              </div>
            </div>
          )}

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

        {/* Packaging Notice Banner */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2.5 text-xs">
          <PackageCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="text-[10px] text-emerald-950 font-medium">
            {fulfillmentType === 'pickup' && containerOption === 'own_box'
              ? '🌿 Eco-friendly choice: Bring your own clean dabba to the kitchen.'
              : 'Tamper-Proof Packaging: Hot food packed in hygienic food-grade disposable container.'}
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
              <p className="text-xs font-bold">{fulfillmentType === 'pickup' ? 'Cash at Kitchen' : 'Cash on Delivery'}</p>
              <p className="text-[9px] text-[#7C746E]">Pay cash on handover</p>
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

        {/* Dynamic Bill Details */}
        <div className="bg-[#FAF4EB] p-4 rounded-3xl border border-[#E2D5BE] space-y-2 text-xs">
          <div className="flex justify-between text-[#6B5B4F]">
            <span>Item Total</span>
            <span>₹{itemsTotal}</span>
          </div>

          <div className="flex justify-between text-[#6B5B4F]">
            <span>Delivery Fee</span>
            <span className={deliveryFee === 0 ? 'text-emerald-700 font-bold' : ''}>
              {deliveryFee === 0 ? 'FREE (Self-Pickup)' : `₹${deliveryFee}`}
            </span>
          </div>

          <div className="flex justify-between text-[#6B5B4F]">
            <span>Packaging & Container</span>
            <span className={packagingFee === 0 ? 'text-emerald-700 font-bold' : ''}>
              {packagingFee === 0 ? 'FREE (Own Dabba)' : `₹${packagingFee}`}
            </span>
          </div>

          <div className="flex justify-between font-bold text-sm text-[#2C1D14] pt-2 border-t border-[#E8DEC8]">
            <span>Grand Total</span>
            <span className="text-[#8C4A32] font-mono font-extrabold text-base">₹{grandTotal}</span>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Order Button */}
      <div className="sticky bottom-0 left-0 right-0 bg-[#FAF6EE]/95 backdrop-blur-md border-t border-[#E2D5BE] p-3 px-4 z-50 shadow-lg">
        <button
          type="button"
          onClick={handleConfirmOrder}
          className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold text-xs py-3.5 rounded-2xl shadow-md cursor-pointer transition active:scale-98 flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-1.5">
            <FiShield size={14} />
            <span>Confirm & Book Order</span>
          </div>
          <span className="font-mono font-bold text-sm">₹{grandTotal} ➔</span>
        </button>
      </div>

    </div>
  );
}
