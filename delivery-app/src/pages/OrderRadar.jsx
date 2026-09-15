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
  Volume2, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import DeliveryNavbar from '../components/DeliveryNavbar';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

// Helper function to synthesize a pleasant double-chime using Web Audio API
function playOrderAlertSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Tone 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5
    gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.65);
  } catch (e) {
    console.log("Audio alert blocked by browser autoplay policy:", e);
  }
}

export default function OrderRadar() {
  const { t } = useLanguage();

  // Tab state: 'in_progress' | 'history'
  const [activeTab, setActiveTab] = useState('in_progress');

  // GPS Coordinates & 5km Radius Status
  const [gpsLocation, setGpsLocation] = useState({
    lat: 13.0524,
    lng: 80.2120,
    address: 'Vadapalani, Chennai (5 km Radar Active)'
  });
  const [gpsActive, setGpsActive] = useState(true);

  // Active Order state (Matching Reference Image 2)
  const [activeOrder, setActiveOrder] = useState({
    id: '#HP12345-6789',
    date: '25-Oct-2023',
    kitchenName: "Rupa's Homemade Foods",
    kitchenPhone: '+91 98765 12345',
    pickupAddress: 'No. 12, Main Street, Bengaluru',
    customerName: 'Amit Sharma',
    customerAddress: 'Flat No. 302, Greenview Apts, No. 12, Main Street, Bengaluru',
    items: '1 X Paneer Pulao, 2 X Roti',
    mealType: 'Dinner',
    amount: '₹550',
    paymentMode: 'COD',
    distanceKm: '5 km',
    deliveryFee: '₹65',
    hasEcoTiffin: true,
    status: 'CONFIRMED' // 'CONFIRMED' | 'COOKING' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
  });

  // Available Nearby Orders List (Strictly <= 5 km)
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: '#HP98211-4412',
      kitchenName: "Lakshmi Amma's Kitchen",
      pickupAddress: '2nd Cross, Arcot Road, Vadapalani',
      items: '2 X Sambar Rice, 1 X Poriyal, Appalam',
      distance: 1.8,
      payout: '₹70',
      mealType: 'Lunch'
    },
    {
      id: '#HP77120-9931',
      kitchenName: "Meenakshi Traditional Meals",
      pickupAddress: '15, 4th Avenue, Anna Nagar West',
      items: '3 X Ghee Podi Idli, Chutney',
      distance: 3.4,
      payout: '₹85',
      mealType: 'Dinner'
    }
  ]);

  // Delivery Stage for active order: 1 = Confirmed, 2 = Cooking/Picked Up, 3 = Out for Delivery / At Doorstep
  const [deliveryStage, setDeliveryStage] = useState(2);
  const [timerMinutes, setTimerMinutes] = useState(8);
  const [timerSeconds, setTimerSeconds] = useState(15);

  // Customer OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [customerOtp, setCustomerOtp] = useState('');
  const EXPECTED_OTP = '4821';
  const [otpError, setOtpError] = useState('');

  // Eco-Tiffin Bonus Checkbox
  const [tiffinCollected, setTiffinCollected] = useState(false);

  // Toast message
  const [toast, setToast] = useState('');

  // GPS Tracking effect
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Live GPS Pin Active (5 km Radar)'
          });
          setGpsActive(true);
        },
        () => {
          setGpsActive(true);
        },
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev > 0) return prev - 1;
        if (timerMinutes > 0) {
          setTimerMinutes((m) => m - 1);
          return 59;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerMinutes]);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  // Play audio alert on new available order
  const handleSimulateNewOrder = () => {
    playOrderAlertSound();
    triggerToast('🔔 ' + t('new_order_alert') + ' - 2.1 km away (₹75)');
  };

  // Handle Picked Up Action (Image 2)
  const handlePickedUp = () => {
    setDeliveryStage(3);
    setActiveOrder((prev) => ({ ...prev, status: 'OUT_FOR_DELIVERY' }));
    playOrderAlertSound();
    triggerToast('Order picked up! Navigate to customer drop-off address.');
  };

  // Verify Customer OTP and Hand Over Food
  const handleVerifyCustomerOtp = (e) => {
    e.preventDefault();
    if (customerOtp.trim() !== EXPECTED_OTP && customerOtp.trim() !== '1234') {
      setOtpError(t('invalid_otp'));
      return;
    }

    setShowOtpModal(false);
    setDeliveryStage(4);
    setActiveOrder((prev) => ({ ...prev, status: 'DELIVERED' }));
    playOrderAlertSound();
    
    // Add extra tiffin bonus if collected
    const earnedAmount = tiffinCollected ? 85 : 65;
    triggerToast(`🎉 Order Delivered! ₹${earnedAmount} credited to your Payout Wallet.`);

    setTimeout(() => {
      setActiveTab('history');
    }, 1500);
  };

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24 font-sans">
      
      {/* Top Header with Logo & Controls */}
      <div className="w-full flex flex-col items-center pt-4 px-5">
        <div className="w-full flex justify-between items-center mb-1">
          <button 
            onClick={handleSimulateNewOrder}
            className="w-8 h-8 rounded-full bg-white border border-[#EADBCC] flex items-center justify-center text-[#8C4A32] shadow-xs cursor-pointer hover:bg-white active:scale-95"
            title="Audio Order Alert Simulation"
          >
            <Volume2 size={16} />
          </button>
          <HomepotLogo size="md" showText={false} />
          <LanguageSelector variant="round" />
        </div>

        {/* Live GPS Radar Tag */}
        <div className="flex items-center gap-1.5 bg-white/90 border border-[#EADBCC] px-3 py-1 rounded-full text-[10px] font-bold text-[#6C645E] shadow-xs mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{gpsLocation.address}</span>
        </div>

        {/* Tab Toggle matching Image 2 & 5: In Progress vs History */}
        <div className="w-full max-w-sm flex border-b border-[#EADBCC]">
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`flex-1 py-2 text-center text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'in_progress' ? 'text-[#333C3E]' : 'text-[#7C746E] hover:text-[#333C3E]'
            }`}
          >
            <span>{t('in_progress_tab')}</span>
            {activeTab === 'in_progress' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#333C3E]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-center text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === 'history' ? 'text-[#333C3E]' : 'text-[#7C746E] hover:text-[#333C3E]'
            }`}
          >
            <span>{t('history_tab')}</span>
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C4A32]"></span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 px-4 sm:px-6 py-3 max-w-sm mx-auto w-full">
        
        {/* ======================================================== */}
        {/* TAB 1: IN PROGRESS (Matching Reference Image 2) */}
        {/* ======================================================== */}
        {activeTab === 'in_progress' && (
          <div className="space-y-3">
            {activeOrder.status !== 'DELIVERED' ? (
              <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-5 shadow-sm relative text-[#333C3E] space-y-4">
                
                {/* Top Row: Order ID, Date & Countdown Clock */}
                <div className="flex justify-between items-start border-b border-[#EADBCC] pb-3">
                  <div>
                    <h3 className="font-bold text-xs text-[#6C645E]">Order ID</h3>
                    <p className="font-mono font-bold text-sm text-[#2C231E]">{activeOrder.id}</p>
                    <p className="text-[10px] text-[#7C746E] mt-0.5">Date: {activeOrder.date}</p>
                  </div>

                  {/* Time Remaining Clock matching Image 2 */}
                  <div className="bg-[#8C4A32] text-white px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-xs">
                    <Clock size={16} className="text-amber-200" />
                    <div>
                      <p className="font-mono font-bold text-sm leading-tight">
                        {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                      </p>
                      <p className="text-[8px] uppercase tracking-wider text-orange-200">{t('time_remaining')}</p>
                    </div>
                  </div>
                </div>

                {/* Step Timeline matching Image 2 */}
                <div className="py-1">
                  <div className="flex items-center justify-between relative px-2">
                    <div className="absolute left-6 right-6 top-3 h-0.5 bg-[#D2C5B6] -z-0"></div>

                    {/* Step 1: Confirmed */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-6 h-6 rounded-full bg-[#8C4A32] text-white flex items-center justify-center text-xs shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-[9px] font-bold text-[#8C4A32] mt-1">{t('confirmed')}</span>
                    </div>

                    {/* Step 2: Cooking */}
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs ${
                        deliveryStage >= 2 ? 'bg-[#8C4A32] text-white' : 'bg-white border border-[#D2C5B6] text-[#6C645E]'
                      }`}>
                        <UtensilsCrossed size={12} />
                      </div>
                      <span className="text-[9px] font-bold text-[#6C645E] mt-1">{t('cooking')}</span>
                    </div>

                    {/* Step 3: Out for Delivery */}
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs ${
                        deliveryStage >= 3 ? 'bg-[#8C4A32] text-white' : 'bg-white border border-[#D2C5B6] text-[#6C645E]'
                      }`}>
                        <Truck size={12} />
                      </div>
                      <span className="text-[9px] font-bold text-[#6C645E] mt-1">{t('out_for_delivery')}</span>
                    </div>
                  </div>
                </div>

                {/* 5 km Track Line with Rider Scooter Icon matching Image 2 */}
                <div className="bg-[#EFE7D8]/70 border border-[#EADBCC] rounded-2xl py-2 px-4 relative">
                  <div className="border-t border-dashed border-[#B8AA9A] w-full relative top-3.5"></div>
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-1.5 bg-[#8C4A32] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
                      <span>🛵</span>
                      <span>5 km</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#8C4A32] bg-white/80 px-2 py-0.5 rounded-md border border-[#EADBCC]">
                      5 km Neighborhood Radius
                    </span>
                  </div>
                </div>

                {/* Kitchen Details matching Image 2 */}
                <div className="flex items-center justify-between border-b border-[#EADBCC] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#333C3E] text-white flex items-center justify-center">
                      <UtensilsCrossed size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#7C746E] uppercase font-bold tracking-wider">{t('kitchen_details')}</p>
                      <p className="text-xs font-bold text-[#2C231E]">{activeOrder.kitchenName}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${activeOrder.kitchenPhone}`}
                    className="w-9 h-9 rounded-full bg-white border border-[#EADBCC] text-[#333C3E] hover:bg-[#8C4A32] hover:text-white transition-colors flex items-center justify-center shadow-xs"
                    title="Call Kitchen"
                  >
                    <Phone size={16} />
                  </a>
                </div>

                {/* Pickup Address matching Image 2 */}
                <div className="flex items-center justify-between border-b border-[#EADBCC] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C9982E] text-white flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <div className="max-w-[180px]">
                      <p className="text-[10px] text-[#7C746E] uppercase font-bold tracking-wider">{t('pickup_address')}</p>
                      <p className="text-xs font-medium text-[#2C231E] leading-snug">{activeOrder.pickupAddress}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Opening GPS Navigation to: ${activeOrder.pickupAddress}`)}
                    className="flex flex-col items-center text-[#333C3E] hover:text-[#8C4A32] transition cursor-pointer"
                  >
                    <Navigation size={18} />
                    <span className="text-[9px] font-bold mt-0.5">Navigate</span>
                  </button>
                </div>

                {/* View Order Items matching Image 2 */}
                <div className="bg-white/80 border border-[#EADBCC] rounded-2xl p-3 text-xs">
                  <p className="font-bold text-[#7C746E] text-[10px] uppercase tracking-wider mb-1">
                    {t('view_order_items')}
                  </p>
                  <p className="font-semibold text-[#2C231E]">{activeOrder.items}</p>
                </div>

                {/* Meal Type & COD Amount matching Image 2 */}
                <div className="flex items-center justify-between pt-1">
                  <div className="bg-[#8C4A32] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
                    <span className="text-[9px] block text-orange-200 uppercase tracking-wider">{t('meal_type')}</span>
                    <span>{activeOrder.mealType}</span>
                  </div>

                  <div className="bg-white border border-[#EADBCC] px-3 py-1 rounded-xl flex items-center gap-2 shadow-xs">
                    <div className="text-right">
                      <span className="text-[9px] text-[#7C746E] block">{t('total_amount_collected')}</span>
                      <span className="font-bold text-sm text-[#2C231E]">{activeOrder.amount}</span>
                    </div>
                    <span className="bg-[#A04A26] text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      {activeOrder.paymentMode}
                    </span>
                  </div>
                </div>

                {/* Eco-Tiffin Bonus Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tiffinCollected}
                      onChange={(e) => setTiffinCollected(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                    <div>
                      <p className="font-bold text-emerald-900 text-[11px]">{t('tiffin_return_available')}</p>
                      <p className="text-[10px] text-emerald-700">{t('tiffin_collected')}</p>
                    </div>
                  </label>
                  <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-1 rounded-full">
                    +₹20
                  </span>
                </div>

                {/* Action Buttons matching Image 2 */}
                <div className="pt-2">
                  {deliveryStage < 3 ? (
                    <button
                      onClick={handlePickedUp}
                      className="w-full bg-[#333C3E] hover:bg-[#22292A] text-white font-bold py-3.5 px-6 rounded-full text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <span>{t('picked_up_btn')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowOtpModal(true)}
                      className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3.5 px-6 rounded-full text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 animate-pulse"
                    >
                      <ShieldCheck size={18} />
                      <span>{t('enter_delivery_otp')}</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 text-center shadow-xs">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto mb-2" />
                <h3 className="font-serif font-bold text-base text-[#2C231E]">All Active Deliveries Completed!</h3>
                <p className="text-xs text-[#7C746E] mt-1">Check nearby kitchen orders below to accept your next delivery.</p>
              </div>
            )}

            {/* Available Orders Section (Within 5 km) */}
            <div className="pt-2 space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <h4 className="font-serif font-bold text-xs text-[#8C4A32]">
                  {t('available_orders_radar')}
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {availableOrders.length} Available
                </span>
              </div>

              {availableOrders.map((ord) => (
                <div key={ord.id} className="bg-white border border-[#EADBCC] rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-[#2C231E] truncate">{ord.kitchenName}</p>
                    <p className="text-[11px] text-[#7C746E] truncate">{ord.pickupAddress}</p>
                    <p className="text-[10px] font-bold text-[#8C4A32] mt-1">
                      {ord.distance} {t('km_away')} • {ord.payout} payout
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      playOrderAlertSound();
                      triggerToast(`Accepted order from ${ord.kitchenName}!`);
                      setActiveOrder({
                        id: ord.id,
                        date: 'Today',
                        kitchenName: ord.kitchenName,
                        kitchenPhone: '+91 98765 00000',
                        pickupAddress: ord.pickupAddress,
                        customerName: 'New Customer',
                        customerAddress: 'Apartment 4B, Nearby Street',
                        items: ord.items,
                        mealType: ord.mealType,
                        amount: '₹380',
                        paymentMode: 'COD',
                        distanceKm: `${ord.distance} km`,
                        deliveryFee: ord.payout,
                        hasEcoTiffin: true,
                        status: 'CONFIRMED'
                      });
                      setDeliveryStage(2);
                      setAvailableOrders((prev) => prev.filter((o) => o.id !== ord.id));
                    }}
                    className="bg-[#8C4A32] hover:bg-[#783D29] text-white text-xs font-bold px-3.5 py-2 rounded-xl shrink-0 cursor-pointer shadow-xs active:scale-95"
                  >
                    {t('accept_order_btn')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: HISTORY (Matching Reference Image 5) */}
        {/* ======================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {/* Delivered Order Card matching Image 5 */}
            <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-5 shadow-sm relative text-[#333C3E] space-y-4">
              
              {/* Header: Order ID & Status Badges matching Image 5 */}
              <div className="flex justify-between items-start border-b border-[#EADBCC] pb-3">
                <div>
                  <h3 className="font-bold text-xs text-[#6C645E]">Order ID</h3>
                  <p className="font-mono font-bold text-sm text-[#2C231E]">#HP12345-6789</p>
                  <p className="text-[10px] text-[#7C746E] mt-0.5">Date: 25-Oct-2023</p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#8C4A32] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      DELIVERED
                    </span>
                  </div>
                  <p className="text-[10px] font-mono font-bold text-[#2C231E]">Completed: 26-Oct-2023, 14:30</p>
                </div>
              </div>

              {/* Trip Distance: 15 km matching Image 5 */}
              <div className="bg-[#EFE7D8]/70 border border-[#EADBCC] rounded-2xl py-2 px-4 text-center">
                <span className="text-xs font-bold text-[#8C4A32]">Trip Distance: 15 km</span>
                <div className="border-t border-dashed border-[#B8AA9A] w-full my-2"></div>
                <div className="flex justify-center items-center gap-1 text-[11px] font-bold text-[#333C3E]">
                  <span>🛵</span>
                  <span>Delivered via HomePot Neighborhood Radar</span>
                </div>
              </div>

              {/* Customer Name & Drop-off address matching Image 5 */}
              <div className="flex items-start gap-3 border-b border-[#EADBCC] pb-3">
                <div className="w-10 h-10 rounded-full bg-[#505D61] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2C231E]">Amit Sharma</p>
                  <p className="text-[11px] text-[#6C645E]">Flat No. 302, Greenview Apts,</p>
                </div>
              </div>

              {/* Drop-off address matching Image 5 */}
              <div className="flex items-start gap-3 border-b border-[#EADBCC] pb-3">
                <div className="w-10 h-10 rounded-full bg-[#8C4A32] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-[#7C746E] uppercase font-bold tracking-wider">{t('drop_off_address')}</p>
                  <p className="text-xs font-medium text-[#2C231E] leading-snug">No. 12, Main Street, Bengaluru</p>
                </div>
              </div>

              {/* View Order Items matching Image 5 */}
              <div className="bg-white/80 border border-[#EADBCC] rounded-2xl p-3 text-xs">
                <p className="font-bold text-[#7C746E] text-[10px] uppercase tracking-wider mb-1">
                  {t('view_order_items')}
                </p>
                <p className="font-semibold text-[#2C231E]">1 X Paneer Pulao, 2 X Roti</p>
              </div>

              {/* Meal Type & COD Amount matching Image 5 */}
              <div className="flex items-center justify-between pt-1">
                <div className="bg-[#8C4A32] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
                  <span className="text-[9px] block text-orange-200 uppercase tracking-wider">{t('meal_type')}</span>
                  <span>Dinner</span>
                </div>

                <div className="bg-white border border-[#EADBCC] px-3 py-1 rounded-xl flex items-center gap-2 shadow-xs">
                  <div className="text-right">
                    <span className="text-[9px] text-[#7C746E] block">{t('total_amount_collected')}</span>
                    <span className="font-bold text-sm text-[#2C231E]">₹550</span>
                  </div>
                  <span className="bg-[#A04A26] text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    COD
                  </span>
                </div>
              </div>

              {/* Disabled Delivered Status Button matching Image 5 */}
              <div className="pt-2">
                <button
                  disabled
                  className="w-full bg-[#333C3E] opacity-90 text-white font-bold py-3.5 px-6 rounded-full text-sm tracking-wide shadow-md flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>{t('delivered_btn')}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Floating Toast Notice */}
      {toast && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-[#333C3E] text-white px-4 py-2.5 rounded-2xl text-xs shadow-xl flex items-center gap-2 animate-fadeIn border border-white/20">
          <Sparkles size={14} className="text-amber-300 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* CUSTOMER DELIVERY OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-[#FAF6EE] border border-[#EADBCC] rounded-3xl w-full max-w-xs shadow-2xl p-5 flex flex-col gap-4 text-[#2C231E]">
            <div className="flex justify-between items-center border-b border-[#EADBCC] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#8C4A32]" />
                <h3 className="font-serif font-bold text-base text-[#8C4A32]">
                  {t('verify_otp_modal_title')}
                </h3>
              </div>
              <button 
                onClick={() => { setShowOtpModal(false); setOtpError(''); }}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#6C645E] hover:bg-stone-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-[#6C645E] leading-relaxed">
              {t('customer_otp_hint')}
            </p>

            <form onSubmit={handleVerifyCustomerOtp} className="space-y-3">
              <div>
                <input
                  type="text"
                  maxLength={4}
                  autoFocus
                  value={customerOtp}
                  onChange={(e) => setCustomerOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full text-center tracking-[12px] font-mono text-2xl font-bold bg-white border-2 border-[#8C4A32] rounded-2xl py-2.5 focus:outline-none shadow-sm"
                />
                <p className="text-[10px] text-center text-[#7C746E] mt-1">Demo OTP code: <strong>4821</strong> or <strong>1234</strong></p>
              </div>

              {otpError && (
                <p className="text-xs text-rose-600 text-center font-bold">{otpError}</p>
              )}

              <button
                type="submit"
                disabled={customerOtp.length !== 4}
                className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider transition shadow-md cursor-pointer disabled:opacity-50"
              >
                {t('confirm_and_complete')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Persistent Bottom Navbar matching reference images */}
      <DeliveryNavbar activeTab="home" />

      {/* Footer Notice matching reference images */}
      <div className="w-full text-center pb-2 pt-1">
        <p className="text-[10px] text-[#7C746E]">
          {t('terms_privacy_notice')}
        </p>
      </div>
    </div>
  );
}
