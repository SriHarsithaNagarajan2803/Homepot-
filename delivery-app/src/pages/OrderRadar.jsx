import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Navigation, 
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
  X,
  PackageCheck
} from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import DeliveryNavbar from '../components/DeliveryNavbar';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

function playOrderAlertSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.3);

    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, ctx.currentTime);
      gain2.gain.setValueAtTime(0.35, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.4);
    }, 180);
  } catch (err) {
    console.log('Audio alert fallback:', err);
  }
}

export default function OrderRadar() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('in_progress');

  const [gpsLocation, setGpsLocation] = useState({
    lat: 13.0524,
    lng: 80.2120,
    address: 'Vadapalani, Chennai (5 km Radar Active)'
  });
  const [gpsActive, setGpsActive] = useState(true);

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
    status: 'CONFIRMED'
  });

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

  const [deliveryStage, setDeliveryStage] = useState(2);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [customerOtp, setCustomerOtp] = useState('');
  const EXPECTED_OTP = '4821';
  const [otpError, setOtpError] = useState('');
  const [toast, setToast] = useState('');

  // History list with per-order earnings explicitly displayed
  const [completedOrders, setCompletedOrders] = useState([
    {
      id: '#HP99841-3321',
      date: 'Today, 1:45 PM',
      kitchenName: "Amma's Kitchen",
      customerName: 'Kavitha R.',
      address: 'Flat 4A, Orchid Enclave, Vadapalani',
      distanceKm: '3.8 km',
      amountCollected: '₹480',
      earnedForOrder: '₹65.00',
      status: 'DELIVERED',
      items: '1 X Special Veg Thali, 2 X Chapatis'
    },
    {
      id: '#HP99102-1209',
      date: 'Today, 12:15 PM',
      kitchenName: "Murugan Tiffin Center",
      customerName: 'Senthil K.',
      address: 'Plot 22, 5th Main Rd, Anna Nagar',
      distanceKm: '2.4 km',
      amountCollected: '₹320',
      earnedForOrder: '₹55.00',
      status: 'DELIVERED',
      items: '4 X Mini Idlis, 2 X Medu Vada'
    }
  ]);

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
        (error) => {
          console.log('Location watch notice:', error.message);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handlePickedUp = () => {
    setDeliveryStage(3);
    setActiveOrder(prev => ({ ...prev, status: 'OUT_FOR_DELIVERY' }));
    setToast('Parcel Picked Up from Kitchen! Heading to customer location.');
    setTimeout(() => setToast(''), 4000);
  };

  const handleVerifyCustomerOtp = (e) => {
    e.preventDefault();
    if (customerOtp !== EXPECTED_OTP && customerOtp !== '1234') {
      setOtpError(t('invalid_otp'));
      return;
    }

    const earned = activeOrder.deliveryFee || '₹65';

    setCompletedOrders(prev => [
      {
        id: activeOrder.id,
        date: 'Just now',
        kitchenName: activeOrder.kitchenName,
        customerName: activeOrder.customerName,
        address: activeOrder.customerAddress,
        distanceKm: activeOrder.distanceKm,
        amountCollected: activeOrder.amount,
        earnedForOrder: `${earned}.00`,
        status: 'DELIVERED',
        items: activeOrder.items
      },
      ...prev
    ]);

    setActiveOrder(prev => ({ ...prev, status: 'DELIVERED' }));
    setShowOtpModal(false);
    setCustomerOtp('');
    setOtpError('');
    setActiveTab('history');
    setToast(`Delivery Handover Verified! You earned ${earned} for this order.`);
    setTimeout(() => setToast(''), 5000);
  };

  const handleAcceptNearbyOrder = (order) => {
    playOrderAlertSound();
    setActiveOrder({
      id: order.id,
      date: 'Today',
      kitchenName: order.kitchenName,
      kitchenPhone: '+91 98765 99887',
      pickupAddress: order.pickupAddress,
      customerName: 'Nearby Customer',
      customerAddress: 'Within 5 km radius',
      items: order.items,
      mealType: order.mealType,
      amount: '₹420',
      paymentMode: 'COD',
      distanceKm: `${order.distance} km`,
      deliveryFee: order.payout,
      status: 'CONFIRMED'
    });
    setDeliveryStage(1);
    setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
    setActiveTab('in_progress');
    setToast(`Order ${order.id} accepted! Navigate to kitchen for pickup.`);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24 font-sans">
      
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={playOrderAlertSound}
          className="w-9 h-9 rounded-full bg-white/80 border border-[#EADBCC] flex items-center justify-center text-[#333C3E] hover:bg-white cursor-pointer"
          title="Test Order Alert Sound"
        >
          <Volume2 size={18} />
        </button>

        <HomepotLogo size="md" showText={false} />
        <LanguageSelector variant="round" />
      </div>

      {/* GPS Radar Pill */}
      <div className="w-full px-5 py-1">
        <div className="bg-[#EFE7D8]/80 border border-[#EADBCC] rounded-full py-1.5 px-3 flex items-center justify-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span className="font-semibold text-[#2C231E] truncate max-w-[280px]">
            {gpsLocation.address}
          </span>
        </div>
      </div>

      {toast && (
        <div className="px-5 py-1">
          <div className="bg-[#8C4A32] text-white text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-md animate-bounce">
            <Sparkles size={16} className="shrink-0 text-amber-200" />
            <p className="font-semibold">{toast}</p>
          </div>
        </div>
      )}

      {/* Tabs Header */}
      <div className="w-full px-5 pt-2">
        <div className="flex border-b border-[#D2C5B6] text-sm font-semibold">
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`flex-1 py-2.5 text-center transition-all cursor-pointer relative ${
              activeTab === 'in_progress' ? 'text-[#8C4A32] font-bold' : 'text-[#7C746E]'
            }`}
          >
            <span>{t('in_progress_tab')}</span>
            {activeTab === 'in_progress' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C4A32]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-center transition-all cursor-pointer relative ${
              activeTab === 'history' ? 'text-[#8C4A32] font-bold' : 'text-[#7C746E]'
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
        
        {/* TAB 1: IN PROGRESS */}
        {activeTab === 'in_progress' && (
          <div className="space-y-3">
            {activeOrder.status !== 'DELIVERED' ? (
              <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-5 shadow-sm relative text-[#333C3E] space-y-4">
                
                {/* Top Row: Order ID, Date & Calm Status Badge (No countdown timer) */}
                <div className="flex justify-between items-start border-b border-[#EADBCC] pb-3">
                  <div>
                    <h3 className="font-bold text-xs text-[#6C645E]">Order ID</h3>
                    <p className="font-mono font-bold text-sm text-[#2C231E]">{activeOrder.id}</p>
                    <p className="text-[10px] text-[#7C746E] mt-0.5">Date: {activeOrder.date}</p>
                  </div>

                  {/* Calm Status Badge */}
                  <div className="bg-[#8C4A32] text-white px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-xs">
                    <Sparkles size={16} className="text-amber-200" />
                    <div>
                      <p className="font-bold text-xs leading-tight">
                        {t('order_status_active')}
                      </p>
                      <p className="text-[9px] text-orange-200">{t('est_delivery_time')}</p>
                    </div>
                  </div>
                </div>

                {/* Step Timeline */}
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

                {/* 5 km Track Line */}
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

                {/* Kitchen Details */}
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

                {/* Pickup Address */}
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

                {/* View Order Items */}
                <div className="bg-white/80 border border-[#EADBCC] rounded-2xl p-3 text-xs">
                  <p className="font-bold text-[#7C746E] text-[10px] uppercase tracking-wider mb-1">
                    {t('view_order_items')}
                  </p>
                  <p className="font-semibold text-[#2C231E]">{activeOrder.items}</p>
                </div>

                {/* Meal Type & COD Amount */}
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

                {/* Pure Plastic Container Sealed Assurance (No tiffin collection) */}
                <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <PackageCheck size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-950 text-[11px]">{t('sealed_container_title')}</p>
                    <p className="text-[10px] text-emerald-800 leading-snug">{t('sealed_container_desc')}</p>
                  </div>
                </div>

                {/* Action Buttons */}
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

            {/* Nearby Available Orders Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-serif font-bold text-xs text-[#8C4A32]">
                  {t('available_orders_radar')}
                </h3>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  {availableOrders.length} Ready
                </span>
              </div>

              <div className="space-y-2.5">
                {availableOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#EADBCC] rounded-2xl p-3.5 shadow-xs flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-xs text-[#2C231E]">{order.kitchenName}</p>
                        <p className="text-[10px] text-[#7C746E] mt-0.5">{order.pickupAddress}</p>
                      </div>
                      <span className="bg-[#8C4A32]/10 text-[#8C4A32] font-bold text-[10px] px-2 py-0.5 rounded-full">
                        {order.distance} {t('km_away')}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#6C645E] bg-[#FAF6EE] p-2 rounded-xl">
                      {order.items}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-700">{order.payout}</span>
                        <span className="text-[10px] text-[#7C746E]">Earning</span>
                      </div>

                      <button
                        onClick={() => handleAcceptNearbyOrder(order)}
                        className="bg-[#8C4A32] hover:bg-[#783D29] text-white text-xs font-bold py-1.5 px-4 rounded-xl transition shadow-xs cursor-pointer active:scale-98"
                      >
                        {t('accept_order_btn')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: HISTORY (Shows Per-Order Earning explicitly) */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1 pb-1">
              <h3 className="font-serif font-bold text-sm text-[#8C4A32]">Completed Orders</h3>
              <span className="text-xs text-[#7C746E]">{completedOrders.length} Deliveries</span>
            </div>

            {completedOrders.map((order, index) => (
              <div
                key={order.id || index}
                className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-4 shadow-xs text-xs space-y-2.5"
              >
                <div className="flex justify-between items-start border-b border-[#EADBCC] pb-2">
                  <div>
                    <span className="font-mono font-bold text-[#2C231E] text-xs">{order.id}</span>
                    <p className="text-[10px] text-[#7C746E]">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <Check size={12} />
                    <span>{t('delivered')}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#7C746E]">FROM:</span>
                    <span className="font-semibold text-[#2C231E]">{order.kitchenName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#7C746E]">TO:</span>
                    <span className="text-[#6C645E]">{order.customerName} ({order.address})</span>
                  </div>
                  <p className="text-[10px] text-[#7C746E] italic">{order.items}</p>
                </div>

                {/* Per-Order Earning Breakdown */}
                <div className="border-t border-[#EADBCC] pt-2 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-[#7C746E] block">Customer COD</span>
                    <span className="font-mono font-bold text-xs text-[#2C231E]">{order.amountCollected}</span>
                  </div>

                  <div className="text-right bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                    <span className="text-[9px] font-bold text-emerald-800 block">Your Earning</span>
                    <span className="font-mono font-bold text-xs text-emerald-700">+{order.earnedForOrder}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Customer OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] border-2 border-[#8C4A32] rounded-3xl p-6 max-w-xs w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-[#8C4A32]">
                {t('verify_otp_modal_title')}
              </h3>
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-7 h-7 rounded-full bg-white border border-[#EADBCC] flex items-center justify-center text-[#6C645E] cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-[#6C645E] leading-relaxed">
              {t('customer_otp_hint')}
            </p>

            <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-2 text-center text-xs font-mono font-bold text-amber-900">
              Demo Code: {EXPECTED_OTP}
            </div>

            <form onSubmit={handleVerifyCustomerOtp} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                required
                value={customerOtp}
                onChange={(e) => {
                  setCustomerOtp(e.target.value.replace(/\D/g, ''));
                  setOtpError('');
                }}
                placeholder="4-digit OTP"
                className="w-full text-center font-mono font-bold text-2xl tracking-widest bg-white border border-[#EADBCC] rounded-2xl py-3 focus:outline-none focus:border-[#8C4A32]"
              />

              {otpError && (
                <p className="text-red-600 text-xs font-semibold text-center">{otpError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
              >
                {t('confirm_and_complete')}
              </button>
            </form>
          </div>
        </div>
      )}

      <DeliveryNavbar activeTab="radar" />
    </div>
  );
}
