import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Navigation, 
  Clock, 
  Check, 
  UtensilsCrossed, 
  Truck, 
  MapPin, 
  User, 
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import DeliveryNavbar from '../components/DeliveryNavbar';

export default function OrderRadar() {
  // Tab state: 'in_progress' | 'history'
  const [activeTab, setActiveTab] = useState('in_progress');

  // Interactive delivery stage for active order:
  // 1: Confirmed / Preparing
  // 2: Picked Up (Ready to Deliver)
  // 3: Delivered (Moves to History!)
  const [deliveryStage, setDeliveryStage] = useState(1);

  // Remaining timer for delivery
  const [minutes, setMinutes] = useState(8);
  const [seconds, setSeconds] = useState(15);

  // Interactive slider state
  const [isPickedUp, setIsPickedUp] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSec) => {
        if (prevSec > 0) return prevSec - 1;
        if (minutes > 0) {
          setMinutes((prevMin) => prevMin - 1);
          return 59;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleActionClick = () => {
    if (deliveryStage === 1) {
      setDeliveryStage(2);
      setIsPickedUp(true);
      triggerToast('Order marked as Picked Up! Head to drop-off address.');
    } else if (deliveryStage === 2) {
      setDeliveryStage(3);
      triggerToast('Order Delivered Successfully! Added to History.');
      setTimeout(() => {
        setActiveTab('history');
      }, 1200);
    }
  };

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24">
      {/* Top Section with Logo */}
      <div className="w-full flex flex-col items-center pt-5 px-5">
        <HomepotLogo size="md" />

        {/* Tab Toggle: In Progress vs History */}
        <div className="w-full max-w-sm mt-3 flex border-b border-[#EADBCC]">
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`flex-1 pb-2.5 text-center text-sm font-semibold transition-all relative ${
              activeTab === 'in_progress'
                ? 'text-[#333C3E]'
                : 'text-[#8C847E] hover:text-[#5C544E]'
            }`}
          >
            In Progress
            {activeTab === 'in_progress' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#333C3E] rounded-t-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 pb-2.5 text-center text-sm font-semibold transition-all relative ${
              activeTab === 'history'
                ? 'text-[#333C3E]'
                : 'text-[#8C847E] hover:text-[#5C544E]'
            }`}
          >
            History
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#9C4A28] rounded-t-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 sm:px-6 py-4 max-w-sm mx-auto w-full">
        {activeTab === 'in_progress' ? (
          /* ======================== IN PROGRESS VIEW (page3.jpeg) ======================== */
          <div className="bg-[#FFFDF8] rounded-3xl border border-[#EADBCC] shadow-soft p-4 sm:p-5 flex flex-col space-y-4">
            {/* Header: Order ID & Live Remaining Countdown */}
            <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-3">
              <div>
                <p className="text-xs text-[#7C746E] font-medium leading-none">Order ID</p>
                <h3 className="font-bold text-sm text-[#333C3E] tracking-tight mt-0.5">#HP12345-6789</h3>
                <p className="text-[11px] text-[#8C847E] mt-0.5">Date: 25-Oct-2023</p>
              </div>

              {/* Time Remaining Badge */}
              <div className="flex items-center gap-2 pl-3 border-l border-[#EADBCC]">
                <div className="w-8 h-8 rounded-full bg-[#9C4A28] text-white flex items-center justify-center shadow-xs">
                  <Clock size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold text-[#8B3A1C] leading-none">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-[#8C847E] font-medium tracking-tight mt-0.5">
                    Time Remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="py-1">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-[#EADBCC] -z-0">
                  <div 
                    className="h-full bg-[#9C4A28] transition-all duration-500"
                    style={{ width: deliveryStage === 1 ? '50%' : '100%' }}
                  ></div>
                </div>

                {/* Step 1: Confirmed */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-7 h-7 rounded-full bg-[#9C4A28] text-white flex items-center justify-center shadow-xs">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-[11px] font-semibold text-[#9C4A28] mt-1.5">Confirmed</span>
                </div>

                {/* Step 2: Cooking */}
                <div className="flex flex-col items-center z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-colors ${
                    deliveryStage >= 2 ? 'bg-[#9C4A28] text-white' : 'bg-[#7C746E] text-white'
                  }`}>
                    <UtensilsCrossed size={13} />
                  </div>
                  <span className={`text-[11px] font-medium mt-1.5 ${deliveryStage >= 2 ? 'text-[#9C4A28] font-semibold' : 'text-[#6C645E]'}`}>
                    Cooking
                  </span>
                </div>

                {/* Step 3: Out for Delivery */}
                <div className="flex flex-col items-center z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-colors ${
                    deliveryStage >= 3 ? 'bg-[#16A34A] text-white' : 'bg-[#A8A098] text-white'
                  }`}>
                    <Truck size={13} />
                  </div>
                  <span className="text-[11px] font-medium text-[#7C746E] mt-1.5">Out for Delivery</span>
                </div>
              </div>
            </div>

            {/* Distance Track Road Graphic */}
            <div className="bg-[#FAF6EE] rounded-2xl p-3 border border-[#EADBCC] relative overflow-hidden">
              <div className="w-full flex items-center justify-center relative py-1">
                {/* Dashed Road Line */}
                <div className="w-full border-b-2 border-dashed border-[#C8BFB5] absolute"></div>

                {/* Scooter Marker with 5km tag */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="bg-white border border-[#DAC9B4] text-[#333C3E] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs mb-1">
                    5 km
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#9C4A28]">
                    🛵
                  </div>
                </div>
              </div>
            </div>

            {/* Kitchen Details Section */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#333C3E] text-white flex items-center justify-center mt-0.5 shadow-xs">
                  <UtensilsCrossed size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-[#7C746E] font-medium leading-none">Kitchen details</p>
                  <p className="text-sm font-bold text-[#333C3E] mt-1">Rupa's Homemade Foods</p>
                </div>
              </div>

              <a
                href="tel:+919876543210"
                className="w-9 h-9 rounded-full bg-[#333C3E] text-white flex items-center justify-center shadow-sm hover:bg-[#22292A] transition-colors"
                title="Call Kitchen"
              >
                <Phone size={15} />
              </a>
            </div>

            <div className="h-px bg-[#F0E6D8] w-full"></div>

            {/* Pickup Address Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D99436] text-white flex items-center justify-center mt-0.5 shadow-xs">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[11px] text-[#7C746E] font-medium leading-none">Pickup address</p>
                  <p className="text-xs font-semibold text-[#333C3E] mt-1 leading-snug">
                    No. 12, Main Street,<br />Bengaluru
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.open('https://maps.google.com', '_blank')}
                className="flex flex-col items-center group"
                title="Open Navigation"
              >
                <div className="w-9 h-9 rounded-full bg-[#333C3E] text-white flex items-center justify-center shadow-sm group-hover:bg-[#22292A] transition-colors">
                  <Navigation size={15} />
                </div>
                <span className="text-[10px] font-medium text-[#7C746E] mt-0.5">Navigate</span>
              </button>
            </div>

            <div className="h-px bg-[#F0E6D8] w-full"></div>

            {/* Order Items Breakdown */}
            <div>
              <p className="text-[11px] text-[#7C746E] font-semibold">View order items</p>
              <p className="text-xs font-medium text-[#333C3E] mt-1">1 X Paneer Pulao, 2 X Roti</p>
            </div>

            {/* Meal Type Tag & Payment Info */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="bg-[#9C4A28] text-white px-3 py-1.5 rounded-xl text-center shadow-xs">
                <span className="block text-[9px] text-[#F5E5DC] leading-none">Meal Type</span>
                <span className="text-xs font-bold leading-tight">Dinner</span>
              </div>

              <div className="flex-1 bg-[#FAF6EE] border border-[#EADBCC] rounded-xl px-3 py-1.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#7C746E] leading-none">Total amount to be collected:</p>
                  <p className="text-sm font-bold text-[#333C3E] mt-0.5">₹550</p>
                </div>
                <span className="bg-[#8B3A1C] text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                  COD
                </span>
              </div>
            </div>

            {/* Interactive Swipe / Action Button */}
            <div className="pt-2">
              <button
                onClick={handleActionClick}
                className="w-full py-3.5 px-4 rounded-full bg-[#333C3E] hover:bg-[#22292A] active:scale-[0.98] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-3 group"
              >
                <div className="w-7 h-7 rounded-full bg-white text-[#333C3E] flex items-center justify-center font-bold text-xs shadow-xs group-hover:translate-x-1 transition-transform">
                  &gt;&gt;
                </div>
                <span>
                  {deliveryStage === 1 ? '→ Picked Up' : '→ Delivered'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================== ORDER HISTORY VIEW (page4.jpeg) ======================== */
          <div className="space-y-4">
            {/* Card 1: Completed / Delivered Order (Matching page4.jpeg) */}
            <div className="bg-[#FFFDF8] rounded-3xl border border-[#EADBCC] shadow-soft overflow-hidden">
              {/* Dark Charcoal Header Bar with Delivered Tag */}
              <div className="bg-[#333C3E] text-white p-3.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#E4E7E9] font-medium">Order ID</span>
                    <span className="font-bold text-xs">#HP12345-6789</span>
                  </div>
                  <p className="text-[11px] text-[#BAC0C2] mt-0.5">Date: 25-Oct-2023</p>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-sm tracking-wider text-white">DELIVERED</span>
                  <p className="text-[10px] text-[#BAC0C2] mt-0.5">Completed: 26-Oct-2023, 14:30</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3.5">
                {/* Stepper Status (Completed) */}
                <div className="flex items-center justify-between px-2 pt-1 relative">
                  <div className="absolute left-6 right-6 top-3 h-0.5 bg-[#8B3A1C] -z-0"></div>

                  <div className="flex flex-col items-center z-10">
                    <div className="w-6 h-6 rounded-full bg-[#8B3A1C] text-white flex items-center justify-center text-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-semibold text-[#8B3A1C] mt-1">Confirmed</span>
                  </div>

                  <div className="flex flex-col items-center z-10">
                    <div className="w-6 h-6 rounded-full bg-[#8B3A1C] text-white flex items-center justify-center text-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-semibold text-[#8B3A1C] mt-1">Cooking</span>
                  </div>

                  <div className="flex flex-col items-center z-10">
                    <div className="w-6 h-6 rounded-full bg-[#8B3A1C] text-white flex items-center justify-center text-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-semibold text-[#8B3A1C] mt-1">Out for Delivery</span>
                  </div>
                </div>

                {/* Trip Distance Metric */}
                <div className="bg-[#FAF6EE] rounded-2xl p-2.5 border border-[#EADBCC] text-center">
                  <p className="text-xs font-semibold text-[#333C3E]">
                    Trip Distance: <span className="font-bold text-[#9C4A28]">15 km</span>
                  </p>
                  <div className="w-full border-b border-dashed border-[#C8BFB5] my-1 relative">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 text-sm">🛵</div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#333C3E] text-white flex items-center justify-center mt-0.5">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#333C3E]">Amit Sharma</p>
                    <p className="text-xs text-[#7C746E]">Flat No. 302, Greenview Apts,</p>
                  </div>
                </div>

                {/* Drop-off Address */}
                <div className="flex items-start gap-3 border-t border-[#F0E6D8] pt-3">
                  <div className="w-9 h-9 rounded-full bg-[#8B3A1C] text-white flex items-center justify-center mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#7C746E] font-medium">Drop-off address</p>
                    <p className="text-xs font-semibold text-[#333C3E]">
                      No. 12, Main Street,<br />Bengaluru
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-[#F0E6D8] pt-2">
                  <p className="text-[11px] text-[#7C746E] font-semibold">View order items</p>
                  <p className="text-xs font-medium text-[#333C3E] mt-0.5">1 X Paneer Pulao, 2 X Roti</p>
                </div>

                {/* Payment Breakdown */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="bg-[#8B3A1C] text-white px-3 py-1.5 rounded-xl text-center shadow-xs">
                    <span className="block text-[9px] text-[#F5E5DC] leading-none">Meal Type</span>
                    <span className="text-xs font-bold leading-tight">Dinner</span>
                  </div>

                  <div className="flex-1 bg-[#FAF6EE] border border-[#EADBCC] rounded-xl px-3 py-1.5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#7C746E] leading-none">Total amount collected:</p>
                      <p className="text-sm font-bold text-[#333C3E] mt-0.5">₹550</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#7C746E] block leading-none">COD</span>
                      <span className="text-xs font-bold text-[#8B3A1C]">₹550</span>
                    </div>
                  </div>
                </div>

                {/* Delivered Status Button */}
                <div className="pt-2">
                  <div className="w-full py-3 rounded-full bg-[#333C3E] text-white font-semibold text-xs tracking-wider text-center flex items-center justify-center gap-2">
                    <Check size={14} />
                    <span>Delivered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Cancelled Order Sample (as seen in mockup red CANCELLED tag) */}
            <div className="bg-[#FFFDF8] rounded-3xl border border-[#EADBCC] shadow-soft overflow-hidden opacity-90">
              <div className="bg-[#333C3E] text-white p-3.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#E4E7E9] font-medium">Order ID</span>
                    <span className="font-bold text-xs">#HP12345-6740</span>
                  </div>
                  <p className="text-[11px] text-[#BAC0C2] mt-0.5">Date: 24-Oct-2023</p>
                </div>

                <div className="text-right">
                  <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    CANCELLED
                  </span>
                </div>
              </div>
              <div className="p-4 text-xs text-[#7C746E]">
                <p>Order was cancelled by customer prior to kitchen preparation.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#333C3E] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-medium flex items-center gap-2 animate-bounce">
          <Sparkles size={14} className="text-[#D99436]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Bottom Navigation Bar */}
      <DeliveryNavbar activeTab="home" />
    </div>
  );
}
