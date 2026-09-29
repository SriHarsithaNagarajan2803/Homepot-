import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Navigation, 
  Check, 
  UtensilsCrossed, 
  Truck, 
  MapPin, 
  Volume2, 
  ShieldCheck, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  PackageCheck,
  Lock,
  Eye,
  EyeOff,
  Map,
  ArrowRight
} from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import DeliveryNavbar from '../components/DeliveryNavbar';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function OrderRadar() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('in_progress'); // 'in_progress' | 'history'

  const [toast, setToast] = useState('');

  // Delivery Stages:
  // 0 = Available on Radar (Pending Acceptance - Addresses Locked)
  // 1 = Accepted by Rider (Heading to Kitchen - Chef Full Address Revealed, Customer Address Locked)
  // 2 = Food Taken / Picked Up from Chef (Chef Address Hidden, Customer Full Address Revealed, Live Traffic Map Active)
  // 3 = Delivered (Completed via Customer OTP)
  const [deliveryStage, setDeliveryStage] = useState(1);

  // Active Order Object
  const [activeOrder, setActiveOrder] = useState({
    id: '#HP-48921',
    date: 'Today, 1:15 PM',
    chefName: 'Radha Amma',
    chefRoughArea: 'Near Anna Nagar 2nd Avenue (Rough Area)',
    chefFullAddress: 'Flat 3B, Plot 42, 2nd Cross Street, Anna Nagar West, Chennai',
    chefPhone: '+91 98765 12345',
    customerName: 'Kavitha R.',
    customerRoughArea: 'Near Vadapalani Metro (Rough Area)',
    customerFullAddress: 'Door 14, 5th Main Road, Vadapalani, Chennai',
    customerPhone: '+91 94455 12345',
    distRiderToChef: '1.2 km',
    distChefToCustomer: '2.8 km',
    totalDistance: '4.0 km',
    items: '2 X Authentic Chettinad Chicken Curry + 3 Parottas',
    mealType: 'Lunch',
    amount: '₹280',
    deliveryFee: '₹75',
    paymentMode: 'COD',
    status: 'RIDER_ACCEPTED'
  });

  // Nearby Orders in Radar (Only orders accepted by Chef appear here)
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: '#HP-55102',
      chefName: "Saraswathi Amma's Kitchen",
      chefRoughArea: 'Near Shanthi Colony (Rough Area)',
      chefFullAddress: 'Door 8, 3rd Avenue, Anna Nagar East',
      chefPhone: '+91 98401 23456',
      customerName: 'Senthil Kumar',
      customerRoughArea: 'Near Vadapalani Signal (Rough Area)',
      customerFullAddress: 'Plot 18, 2nd Main Road, Vadapalani',
      customerPhone: '+91 98409 87654',
      distRiderToChef: '1.4 km',
      distChefToCustomer: '2.1 km',
      totalDistance: '3.5 km',
      items: '3 X Traditional Ghee Podi Idli & Vadai',
      mealType: 'Dinner',
      amount: '₹270',
      payout: '₹70'
    }
  ]);

  // Customer Handover OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const EXPECTED_OTP = '4821';
  const [otpError, setOtpError] = useState('');

  // Completed Orders History
  const [completedOrders, setCompletedOrders] = useState([
    {
      id: '#HP-99841',
      date: 'Today, 12:45 PM',
      chefName: "Radha Amma's Kitchen",
      customerName: 'Suresh V.',
      address: 'Door 19, 4th Avenue, Anna Nagar',
      amountCollected: '₹290',
      earnedForOrder: '₹75.00',
      status: 'DELIVERED',
      items: '1 X Mutton Sukka + Parotta'
    }
  ]);

  // Dispatch live shared notification across apps via localStorage
  const broadcastOrderNotification = (recipient, title, message) => {
    try {
      const riderProfile = (() => {
        try {
          return JSON.parse(localStorage.getItem('homepot_rider_profile')) || {};
        } catch {
          return {};
        }
      })();

      const notifData = {
        id: Date.now(),
        orderId: activeOrder?.id,
        recipient, // 'chef' | 'customer' | 'all'
        title,
        message,
        isPwd: Boolean(riderProfile.isPwd),
        pwdCategory: riderProfile.pwdCategory || '',
        riderName: riderProfile.name || 'Delivery Partner',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      localStorage.setItem('homepot_live_notification', JSON.stringify(notifData));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.warn('Notification broadcast note:', e);
    }
  };

  // 1. Rider Accepts Available Order
  const handleAcceptOrder = (order) => {
    const riderProfile = (() => {
      try {
        return JSON.parse(localStorage.getItem('homepot_rider_profile')) || {};
      } catch {
        return {};
      }
    })();

    // Synchronize assigned rider across apps
    localStorage.setItem('homepot_live_assigned_rider', JSON.stringify({
      orderId: order.id,
      name: riderProfile.name || 'Delivery Partner',
      phone: riderProfile.phone || '9876543210',
      vehicle: riderProfile.vehicle || 'Hero Splendor • TN 09 BK 4102',
      gender: riderProfile.gender || 'male',
      isPwd: Boolean(riderProfile.isPwd),
      pwdCategory: riderProfile.pwdCategory || ''
    }));

    setActiveOrder({
      id: order.id,
      date: 'Today',
      chefName: order.chefName,
      chefRoughArea: order.chefRoughArea,
      chefFullAddress: order.chefFullAddress,
      chefPhone: order.chefPhone,
      customerName: order.customerName,
      customerRoughArea: order.customerRoughArea,
      customerFullAddress: order.customerFullAddress,
      customerPhone: order.customerPhone,
      distRiderToChef: order.distRiderToChef,
      distChefToCustomer: order.distChefToCustomer,
      totalDistance: order.totalDistance,
      items: order.items,
      mealType: order.mealType,
      amount: order.amount,
      deliveryFee: order.payout,
      paymentMode: 'COD',
      status: 'RIDER_ACCEPTED'
    });

    setDeliveryStage(1);
    setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
    setActiveTab('in_progress');

    // Notify Chef & Customer
    broadcastOrderNotification(
      'all',
      '🛵 Delivery Partner Assigned!',
      `Delivery Partner accepted order ${order.id} and is heading to Amma's kitchen for pickup.`
    );

    setToast(`Order ${order.id} accepted! Chef's address is now revealed. Head to kitchen.`);
    setTimeout(() => setToast(''), 4500);
  };

  // 2. Rider Picks Up Food from Chef
  const handleFoodPickedUp = () => {
    setDeliveryStage(2);
    setActiveOrder(prev => ({ ...prev, status: 'OUT_FOR_DELIVERY' }));

    // Notify Customer & Chef
    broadcastOrderNotification(
      'customer',
      '🥘 Food Picked Up from Kitchen!',
      `Your food has been picked up from ${activeOrder.chefName}! Rider is on the way to your door.`
    );

    broadcastOrderNotification(
      'chef',
      '✅ Food Handed Over to Rider',
      `Food for order ${activeOrder.id} safely handed over to Delivery Partner.`
    );

    setToast('Food Picked Up! Chef address hidden. Customer address & live route revealed.');
    setTimeout(() => setToast(''), 4500);
  };

  // 3. Verify Customer OTP & Complete Delivery
  const handleVerifyCustomerOtp = (e) => {
    e.preventDefault();
    if (enteredOtp !== EXPECTED_OTP && enteredOtp !== '1234') {
      setOtpError('Invalid OTP code. Please ask customer for the 4-digit handover code.');
      return;
    }

    const earned = activeOrder.deliveryFee || '₹75';

    setCompletedOrders(prev => [
      {
        id: activeOrder.id,
        date: 'Just now',
        chefName: activeOrder.chefName,
        customerName: activeOrder.customerName,
        address: activeOrder.customerFullAddress,
        amountCollected: activeOrder.amount,
        earnedForOrder: `${earned}.00`,
        status: 'DELIVERED',
        items: activeOrder.items
      },
      ...prev
    ]);

    setDeliveryStage(3);
    setShowOtpModal(false);
    setEnteredOtp('');
    setOtpError('');
    setActiveTab('history');

    broadcastOrderNotification(
      'customer',
      '🎉 Order Delivered!',
      `Order ${activeOrder.id} has been safely delivered. Enjoy your hot homemade meal!`
    );

    setToast(`Delivery Handover Verified! You earned ${earned} for this order.`);
    setTimeout(() => setToast(''), 5000);
  };

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24 font-sans select-none">
      
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#EADBCC]">
        <HomepotLogo size="md" showText={false} />
        
        {/* Radar Status Badge */}
        <div className="bg-[#EFE7D8] border border-[#EADBCC] rounded-full py-1 px-3 flex items-center gap-1.5 text-xs font-bold text-[#8C4A32]">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>5 km Delivery Radar Active</span>
        </div>

        <LanguageSelector variant="round" />
      </div>

      {toast && (
        <div className="px-5 py-2">
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
            <span>{t('history_tab')} ({completedOrders.length})</span>
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8C4A32]"></span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 px-4 sm:px-5 py-3 max-w-sm mx-auto w-full">
        
        {/* TAB 1: IN PROGRESS */}
        {activeTab === 'in_progress' && (
          <div className="space-y-3.5">
            
            {deliveryStage < 3 ? (
              <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-4 sm:p-5 shadow-sm text-[#333C3E] space-y-4">
                
                {/* Order ID & Status Banner */}
                <div className="flex justify-between items-start border-b border-[#EADBCC] pb-3">
                  <div>
                    <span className="text-[10px] text-[#7C746E] uppercase font-bold tracking-wider">Current Order</span>
                    <p className="font-mono font-bold text-sm text-[#2C231E]">{activeOrder.id}</p>
                  </div>

                  <div className="bg-[#8C4A32] text-white px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="font-bold text-xs">
                      {deliveryStage === 1 ? 'Heading to Kitchen' : 'Out for Delivery'}
                    </span>
                  </div>
                </div>

                {/* DISTANCE OVERVIEW CARD (Always Visible) */}
                <div className="bg-white border border-[#EADBCC] p-3 rounded-2xl shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6C645E] font-medium">🛵 Rider to Kitchen:</span>
                    <span className="font-bold text-[#8C4A32]">{activeOrder.distRiderToChef}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6C645E] font-medium">🍳 Kitchen to Customer:</span>
                    <span className="font-bold text-[#8C4A32]">{activeOrder.distChefToCustomer}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-[#F0E6D8] font-bold">
                    <span>Total Distance:</span>
                    <span className="text-emerald-700">{activeOrder.totalDistance} (Within 5km)</span>
                  </div>
                </div>

                {/* STAGE 1: CHEF ADDRESS REVEALED / STAGE 2: CHEF ADDRESS HIDDEN */}
                {deliveryStage === 1 ? (
                  <div className="bg-white border-2 border-emerald-500/60 p-3.5 rounded-2xl shadow-xs space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                        <MapPin size={14} className="text-emerald-600" />
                        <span>Kitchen Pickup Address (Revealed)</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Active Pickup
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#2C231E]">{activeOrder.chefName}</p>
                      <p className="text-[11px] text-[#593222] font-medium leading-snug mt-0.5">
                        {activeOrder.chefFullAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-[#F0E6D8]">
                      <a 
                        href={`tel:${activeOrder.chefPhone}`}
                        className="flex-1 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition"
                      >
                        <Phone size={13} />
                        <span>Call Chef</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => alert(`Starting GPS Turn-by-Turn to: ${activeOrder.chefFullAddress}`)}
                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
                      >
                        <Navigation size={13} />
                        <span>Navigate</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FAF6EE] border border-[#EADBCC] p-3 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <div>
                        <span className="font-bold text-[#2C231E]">Food Picked Up from {activeOrder.chefName}</span>
                        <p className="text-[10px] text-[#7C746E]">Kitchen address archived for privacy</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      ✓ Done
                    </span>
                  </div>
                )}

                {/* STAGE 1: CUSTOMER ADDRESS LOCKED / STAGE 2: CUSTOMER ADDRESS REVEALED */}
                {deliveryStage === 1 ? (
                  <div className="bg-[#EFE7D8]/80 border border-dashed border-[#D2C5B6] p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[#7C746E] text-[10px] font-bold uppercase tracking-wider">
                      <Lock size={12} className="text-[#8C4A32]" />
                      <span>Customer Drop Address (Privacy Protected)</span>
                    </div>
                    <p className="text-xs font-semibold text-[#2C231E]">
                      {activeOrder.customerRoughArea}
                    </p>
                    <p className="text-[10px] text-[#8C4A32] italic">
                      🔒 Full door & street address will unlock immediately once you pick up food from Amma.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-[#8C4A32] p-3.5 rounded-2xl shadow-xs space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-[#8C4A32] text-[10px] font-bold uppercase tracking-wider">
                        <MapPin size={14} className="text-[#8C4A32]" />
                        <span>Customer Delivery Address (Revealed)</span>
                      </div>
                      <span className="bg-[#8C4A32]/10 text-[#8C4A32] text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Drop Location
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#2C231E]">{activeOrder.customerName}</p>
                      <p className="text-[11px] text-[#593222] font-medium leading-snug mt-0.5">
                        {activeOrder.customerFullAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-[#F0E6D8]">
                      <a 
                        href={`tel:${activeOrder.customerPhone}`}
                        className="flex-1 bg-white hover:bg-[#FAF4EB] border border-[#8C4A32] text-[#8C4A32] text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition"
                      >
                        <Phone size={13} />
                        <span>Call Customer</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => navigate('/route')}
                        className="flex-1 bg-[#8C4A32] hover:bg-[#783D29] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition"
                      >
                        <Navigation size={13} />
                        <span>View Live Route</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* GOOGLE MAPS TRAFFIC PREVIEW (STAGE 2 - OUT FOR DELIVERY) */}
                {deliveryStage === 2 && (
                  <div className="bg-white border border-[#EADBCC] rounded-2xl p-3 shadow-xs space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-xs text-[#2C231E] flex items-center gap-1">
                        <span>🗺️ Live Route & Traffic Map</span>
                      </span>
                      <button
                        onClick={() => navigate('/route')}
                        className="text-[10px] font-bold text-[#8C4A32] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Fullscreen</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>

                    {/* Mini SVG Route representation */}
                    <div className="relative h-24 bg-[#E8E4DA] rounded-xl overflow-hidden border border-[#D2C5B6] flex items-center justify-center">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        {/* Clear route segment */}
                        <path d="M 20 60 L 90 60" stroke="#10B981" strokeWidth="6" strokeLinecap="round" fill="none" />
                        
                        {/* LIGHT RED TRAFFIC SECTION */}
                        <path d="M 90 60 L 220 60" stroke="#EA4335" strokeWidth="8" strokeLinecap="round" fill="none" filter="drop-shadow(0 0 4px rgba(234, 67, 53, 0.7))" />
                        
                        {/* Clear route segment */}
                        <path d="M 220 60 L 300 60" stroke="#10B981" strokeWidth="6" strokeLinecap="round" fill="none" />
                      </svg>

                      {/* Traffic Label */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#EA4335] text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        <span>2nd Avenue Traffic Slowdown (+4m)</span>
                      </div>

                      {/* Rider Icon on Traffic Road */}
                      <div className="absolute top-[48%] left-[45%] -translate-y-1/2 text-base">
                        🛵
                      </div>
                      <div className="absolute bottom-1 right-2 text-[8px] font-bold text-[#593222] bg-white/80 px-1 rounded">
                        Drop: Vadapalani
                      </div>
                    </div>

                    {/* Traffic Alert Banner */}
                    <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-start gap-2 text-[10px] text-rose-900 leading-snug">
                      <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                      <span>
                        <b>Slow Traffic Detected:</b> Marked in light red on the route. The customer is automatically informed so they know you are waiting in traffic with their food.
                      </span>
                    </div>
                  </div>
                )}

                {/* Items & Payout */}
                <div className="bg-white border border-[#EADBCC] p-3 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-[#2C231E]">{activeOrder.items}</span>
                    <span className="text-emerald-700 font-mono text-sm">{activeOrder.deliveryFee} Earning</span>
                  </div>
                  <p className="text-[10px] text-[#7C746E]">Payment: {activeOrder.paymentMode} • Collect {activeOrder.amount} at doorstep</p>
                </div>

                {/* PRIMARY LIFECYCLE ACTION BUTTON */}
                <div className="pt-1">
                  {deliveryStage === 1 ? (
                    <button
                      onClick={handleFoodPickedUp}
                      className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UtensilsCrossed size={16} />
                      <span>Food Picked Up / Taken from Chef</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowOtpModal(true)}
                      className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 animate-pulse"
                    >
                      <ShieldCheck size={16} />
                      <span>Enter Customer Handover OTP</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 text-center shadow-xs space-y-2">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h3 className="font-serif font-bold text-base text-[#2C231E]">All Active Deliveries Completed!</h3>
                <p className="text-xs text-[#7C746E]">Check the radar below to accept your next nearby delivery.</p>
              </div>
            )}

            {/* RADAR AVAILABLE ORDERS (Only Chef-Accepted Orders) */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-serif font-bold text-xs text-[#8C4A32]">
                  Nearby Kitchen Orders Ready for Pickup (5 km Radar)
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {availableOrders.length} Ready
                </span>
              </div>

              {availableOrders.length === 0 ? (
                <div className="p-4 bg-white border border-[#EADBCC] rounded-2xl text-center text-xs text-[#7C746E]">
                  Waiting for chefs to accept fresh orders in your 5 km area...
                </div>
              ) : (
                <div className="space-y-3">
                  {availableOrders.map(order => (
                    <div
                      key={order.id}
                      className="bg-white border-2 border-[#EADBCC] rounded-2xl p-3.5 shadow-xs flex flex-col gap-2.5"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-xs text-[#2C231E]">{order.chefName}</p>
                          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            ✓ Chef Accepted & Cooking
                          </span>
                        </div>
                        <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200">
                          {order.payout} Earning
                        </span>
                      </div>

                      {/* DISTANCE & ROUGH LOCATION (STRICT PRIVACY BEFORE ACCEPTANCE) */}
                      <div className="bg-[#FAF6EE] p-2.5 rounded-xl border border-[#E8DEC8] space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#6C645E]">Rider to Kitchen: <b>{order.distRiderToChef}</b></span>
                          <span className="text-[#6C645E]">Kitchen to Drop: <b>{order.distChefToCustomer}</b></span>
                        </div>
                        <p className="text-[11px] font-semibold text-[#2C231E]">
                          📍 Route: {order.chefRoughArea} ➔ {order.customerRoughArea}
                        </p>
                        <p className="text-[9px] text-[#8C4A32] italic flex items-center gap-1">
                          <Lock size={10} />
                          <span>Exact house & flat addresses locked until you accept the order.</span>
                        </p>
                      </div>

                      <div className="text-[11px] text-[#6C645E]">
                        {order.items}
                      </div>

                      <button
                        onClick={() => handleAcceptOrder(order)}
                        className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white text-xs font-bold py-2.5 rounded-xl transition shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
                      >
                        <span>Accept Delivery Order ({order.payout})</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: COMPLETED DELIVERIES HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1 pb-1">
              <h3 className="font-serif font-bold text-sm text-[#8C4A32]">Delivery Earnings History</h3>
              <span className="text-xs text-[#7C746E]">{completedOrders.length} Completed</span>
            </div>

            {completedOrders.map((order, index) => (
              <div
                key={order.id || index}
                className="bg-white border border-[#EADBCC] rounded-3xl p-4 shadow-xs text-xs space-y-2.5"
              >
                <div className="flex justify-between items-start border-b border-[#F0E6D8] pb-2">
                  <div>
                    <span className="font-mono font-bold text-[#2C231E] text-xs">{order.id}</span>
                    <p className="text-[10px] text-[#7C746E]">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <Check size={12} />
                    <span>Delivered</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px]">
                  <p><b>Kitchen:</b> {order.chefName}</p>
                  <p><b>Customer:</b> {order.customerName} ({order.address})</p>
                  <p className="text-[10px] text-[#7C746E]">{order.items}</p>
                </div>

                <div className="border-t border-[#F0E6D8] pt-2 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-[#7C746E] block">Collected</span>
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

      {/* Customer Handover OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] border-2 border-[#8C4A32] rounded-3xl p-6 max-w-xs w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-[#8C4A32]">
                Customer Handover OTP
              </h3>
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-7 h-7 rounded-full bg-white border border-[#EADBCC] flex items-center justify-center text-[#6C645E] cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-[#6C645E] leading-relaxed">
              Ask the customer for their 4-digit delivery handover OTP to confirm handover.
            </p>

            <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-2 text-center text-xs font-mono font-bold text-amber-900">
              Customer's Code: {EXPECTED_OTP}
            </div>

            <form onSubmit={handleVerifyCustomerOtp} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                required
                value={enteredOtp}
                onChange={(e) => {
                  setEnteredOtp(e.target.value.replace(/\D/g, ''));
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
                Confirm & Complete Delivery
              </button>
            </form>
          </div>
        </div>
      )}

      <DeliveryNavbar activeTab="radar" />
    </div>
  );
}
