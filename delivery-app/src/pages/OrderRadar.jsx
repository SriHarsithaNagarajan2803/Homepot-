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
  ArrowRight,
  Zap,
  Bike
} from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import DeliveryNavbar from '../components/DeliveryNavbar';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function OrderRadar() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const [activeTab, setActiveTab] = useState('in_progress'); // 'in_progress' | 'history'

  const [toast, setToast] = useState('');

  // Delivery Stages:
  // 0 = Available on Radar (Pending Acceptance - Full Addresses Locked)
  // 1 = Accepted by Rider (Heading to Kitchen - Chef Full Address Revealed, Customer Address Locked)
  // 2 = Food Taken / Picked Up from Chef (Chef Address Hidden, Customer Full Address Revealed, Live Traffic Map Active)
  // 3 = Delivered (Completed via Customer OTP)
  const [deliveryStage, setDeliveryStage] = useState(1);

  // Active Order Object
  const [activeOrder, setActiveOrder] = useState({
    id: '#HP-48921',
    date: 'Today, 1:15 PM',
    isLongDistance: false,
    distanceType: '3 to 7 km (Standard)',
    chefName: 'Radha Amma',
    chefRoughArea: 'Anna Nagar West (Rough Area)',
    chefFullAddress: 'Flat 3B, Plot 42, 2nd Cross Street, Anna Nagar West, Chennai',
    chefPhone: '+91 98765 12345',
    customerName: 'Kavitha R.',
    customerRoughArea: 'Vadapalani Metro Area (Rough Area)',
    customerFullAddress: 'Door 14, 5th Main Road, Vadapalani, Chennai',
    customerPhone: '+91 94455 12345',
    distRiderToChef: '1.2 km',
    distChefToCustomer: '3.8 km',
    totalDistance: '5.0 km',
    items: '2 X Authentic Chettinad Chicken Curry + 3 Parottas',
    mealType: 'Lunch',
    amount: '₹310',
    deliveryFee: '₹75',
    paymentMode: 'COD',
    status: 'RIDER_ACCEPTED'
  });

  // Nearby Orders in Radar (Chef-Accepted Orders: Standard 3-7km & Long Distance 10-15km)
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: '#HP-78219',
      isLongDistance: true,
      distanceBadge: '⚡ Long Distance Delivery (10 to 15 km)',
      distanceBadgeTa: '⚡ நீண்ட தூர டெலிவரி (10 முதல் 15 கி.மீ)',
      chefName: "Meenakshi Amma's Kitchen",
      chefRoughArea: 'Anna Nagar East',
      chefFullAddress: 'Villa 12, 1st Cross, Anna Nagar East, Chennai',
      chefPhone: '+91 98402 11223',
      customerName: 'Karthik Subramanian',
      customerRoughArea: 'Tambaram / Chromepet Area',
      customerFullAddress: 'Tower 4, Flat 602, Grand Residency, Tambaram GST Road, Chennai',
      customerPhone: '+91 97910 88990',
      distRiderToChef: '1.9 km',
      distChefToCustomer: '11.6 km',
      totalDistance: '13.5 km',
      items: '4 X South Indian Traditional Meals + Filter Coffee Flask',
      mealType: 'Lunch Special',
      amount: '₹620',
      payout: '₹175'
    },
    {
      id: '#HP-55102',
      isLongDistance: false,
      distanceBadge: '🛵 Standard Two-Wheeler (3 to 7 km)',
      distanceBadgeTa: '🛵 இருசக்கர வாகனம் (3 முதல் 7 கி.மீ)',
      chefName: "Saraswathi Amma's Kitchen",
      chefRoughArea: 'Shanthi Colony',
      chefFullAddress: 'Door 8, 3rd Avenue, Shanthi Colony, Anna Nagar East',
      chefPhone: '+91 98401 23456',
      customerName: 'Senthil Kumar',
      customerRoughArea: 'RS Puram / Vadapalani Signal',
      customerFullAddress: 'Plot 18, 2nd Main Road, Vadapalani, Chennai',
      customerPhone: '+91 98409 87654',
      distRiderToChef: '1.4 km',
      distChefToCustomer: '3.1 km',
      totalDistance: '4.5 km',
      items: '3 X Traditional Ghee Podi Idli & Medu Vadai',
      mealType: 'Snack & Dinner',
      amount: '₹270',
      payout: '₹70'
    },
    {
      id: '#HP-61044',
      isLongDistance: false,
      distanceBadge: '🛵 Standard Two-Wheeler (3 to 7 km)',
      distanceBadgeTa: '🛵 இருசக்கர வாகனம் (3 முதல் 7 கி.மீ)',
      chefName: "Lakshmi Amma's Kitchen",
      chefRoughArea: 'Shenoy Nagar',
      chefFullAddress: 'New No. 27, 4th Street, Shenoy Nagar, Chennai',
      chefPhone: '+91 94440 98765',
      customerName: 'Ananya Raghavan',
      customerRoughArea: 'Kilpauk Garden',
      customerFullAddress: 'Apartment 2A, Green Park, Kilpauk Garden Road, Chennai',
      customerPhone: '+91 98840 54321',
      distRiderToChef: '0.9 km',
      distChefToCustomer: '2.8 km',
      totalDistance: '3.7 km',
      items: '2 X Pesarattu Upma + Sambar & Chutney Box',
      mealType: 'Breakfast',
      amount: '₹240',
      payout: '₹65'
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
      distance: '4.8 km',
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
      isLongDistance: order.isLongDistance,
      distanceType: order.isLongDistance ? '10 to 15 km (Long Distance)' : '3 to 7 km (Standard)',
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

    // Notify Chef & Customer immediately
    broadcastOrderNotification(
      'all',
      '🛵 Delivery Partner Assigned!',
      `Delivery Partner accepted order ${order.id} and is heading to Amma's kitchen for pickup.`
    );

    setToast(
      isTamil 
        ? `ஆர்டர் ${order.id} ஏற்கப்பட்டது! சமையலறை முழு முகவரி திறக்கப்பட்டது.` 
        : `Order ${order.id} accepted! Chef's address is now revealed. Head to kitchen.`
    );
    setTimeout(() => setToast(''), 4500);
  };

  // 2. Rider Picks Up Food from Chef (Food is Taken)
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

    setToast(
      isTamil
        ? 'உணவு எடுக்கப்பட்டது! சமையலறை முகவரி மறைக்கப்பட்டது. வாடிக்கையாளர் முகவரி திறக்கப்பட்டது.'
        : 'Food Picked Up! Chef address hidden. Customer address & live route revealed.'
    );
    setTimeout(() => setToast(''), 4500);
  };

  // 3. Verify Customer OTP & Complete Delivery
  const handleVerifyCustomerOtp = (e) => {
    e.preventDefault();
    if (enteredOtp !== EXPECTED_OTP && enteredOtp !== '1234') {
      setOtpError(
        isTamil 
          ? 'தவறான OTP குறியீடு. வாடிக்கையாளரிடம் உள்ள 4-இலக்க ஒப்படைப்பு குறியீட்டை கேட்கவும்.' 
          : 'Invalid OTP code. Please ask customer for the 4-digit handover code.'
      );
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
        distance: activeOrder.totalDistance,
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

    setToast(
      isTamil 
        ? `டெலிவரி முடிந்தது! இந்த ஆர்டருக்கு நீங்கள் ${earned} சம்பாதித்துள்ளீர்கள்.` 
        : `Delivery Handover Verified! You earned ${earned} for this order.`
    );
    setTimeout(() => setToast(''), 5000);
  };

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24 font-sans select-none">
      
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#EADBCC]">
        <HomepotLogo size="md" showText={false} />
        
        {/* Dynamic Smart Radar Status Badge */}
        <div className="bg-[#EFE7D8] border border-[#EADBCC] rounded-full py-1 px-3 flex items-center gap-1.5 text-[11px] font-bold text-[#8C4A32] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>{isTamil ? 'ஸ்மார்ட் ரேடார் (3-7 & 10-15 கி.மீ)' : 'Smart Radar (3-7 & 10-15 km)'}</span>
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
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-[#7C746E] uppercase font-bold tracking-wider">Current Order</span>
                      {activeOrder.isLongDistance && (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                          ⚡ Long Distance
                        </span>
                      )}
                    </div>
                    <p className="font-mono font-bold text-sm text-[#2C231E]">{activeOrder.id}</p>
                  </div>

                  <div className="bg-[#8C4A32] text-white px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="font-bold text-xs">
                      {deliveryStage === 1 
                        ? (isTamil ? 'சமையலறைக்குச் செல்கிறார்' : 'Heading to Kitchen') 
                        : (isTamil ? 'டெலிவரிக்கு புறப்பட்டது' : 'Out for Delivery')}
                    </span>
                  </div>
                </div>

                {/* DISTANCE OVERVIEW CARD (Always Visible) */}
                <div className="bg-white border border-[#EADBCC] p-3 rounded-2xl shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6C645E] font-medium">🛵 {isTamil ? 'ரைடர் ➔ சமையலறை:' : 'Rider to Kitchen:'}</span>
                    <span className="font-bold text-[#8C4A32]">{activeOrder.distRiderToChef}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6C645E] font-medium">🍳 {isTamil ? 'சமையலறை ➔ வாடிக்கையாளர்:' : 'Kitchen to Customer:'}</span>
                    <span className="font-bold text-[#8C4A32]">{activeOrder.distChefToCustomer}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-[#F0E6D8] font-bold">
                    <span>{isTamil ? 'மொத்த தூரம்:' : 'Total Distance:'}</span>
                    <span className="text-emerald-700">{activeOrder.totalDistance} ({activeOrder.distanceType})</span>
                  </div>
                </div>

                {/* STAGE 1: CHEF ADDRESS REVEALED / STAGE 2: CHEF ADDRESS HIDDEN */}
                {deliveryStage === 1 ? (
                  <div className="bg-white border-2 border-emerald-500/60 p-3.5 rounded-2xl shadow-xs space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                        <MapPin size={14} className="text-emerald-600" />
                        <span>{isTamil ? 'சமையலறை பிக்அப் முகவரி (திறக்கப்பட்டது)' : 'Kitchen Pickup Address (Revealed)'}</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {isTamil ? 'பிக்அப்' : 'Active Pickup'}
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
                        <span>{isTamil ? 'அழைக்க' : 'Call Chef'}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => alert(`Starting GPS Turn-by-Turn to: ${activeOrder.chefFullAddress}`)}
                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <Navigation size={13} />
                        <span>{isTamil ? 'வழிகாட்டு' : 'Navigate'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FAF6EE] border border-[#EADBCC] p-3 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <div>
                        <span className="font-bold text-[#2C231E]">
                          {isTamil ? `உணவு பெறப்பட்டது (${activeOrder.chefName})` : `Food Picked Up from ${activeOrder.chefName}`}
                        </span>
                        <p className="text-[10px] text-[#7C746E]">
                          {isTamil ? 'சமையலறை முகவரி மறைக்கப்பட்டது' : 'Kitchen address archived for privacy'}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={`tel:${activeOrder.chefPhone}`}
                      className="text-[10px] font-bold text-stone-700 bg-white border border-[#DFCBB5] px-2 py-1 rounded-md flex items-center gap-1"
                    >
                      <Phone size={11} />
                      <span>{isTamil ? 'அவசர அழைப்பு' : 'SOS Call'}</span>
                    </a>
                  </div>
                )}

                {/* STAGE 1: CUSTOMER ADDRESS LOCKED / STAGE 2: CUSTOMER ADDRESS REVEALED */}
                {deliveryStage === 1 ? (
                  <div className="bg-[#EFE7D8]/80 border border-dashed border-[#D2C5B6] p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[#7C746E] text-[10px] font-bold uppercase tracking-wider">
                      <Lock size={12} className="text-[#8C4A32]" />
                      <span>{isTamil ? 'வாடிக்கையாளர் டெலிவரி பகுதி (பாதுகாக்கப்பட்டது)' : 'Customer Drop Address (Privacy Protected)'}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#2C231E]">
                      📍 {activeOrder.customerRoughArea}
                    </p>
                    <p className="text-[10px] text-[#8C4A32] italic">
                      {isTamil 
                        ? '🔒 நீங்கள் சமையலறையில் உணவை எடுத்தவுடன் வாடிக்கையாளரின் முழு முகவரி திறக்கப்படும்.' 
                        : '🔒 Full door & street address will unlock immediately once you pick up food from Amma.'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-[#8C4A32] p-3.5 rounded-2xl shadow-xs space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-[#8C4A32] text-[10px] font-bold uppercase tracking-wider">
                        <MapPin size={14} className="text-[#8C4A32]" />
                        <span>{isTamil ? 'வாடிக்கையாளர் டெலிவரி முகவரி (திறக்கப்பட்டது)' : 'Customer Delivery Address (Revealed)'}</span>
                      </div>
                      <span className="bg-[#8C4A32]/10 text-[#8C4A32] text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {isTamil ? 'டெலிவரி இடம்' : 'Drop Location'}
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
                        <span>{isTamil ? 'வாடிக்கையாளரை அழைக்க' : 'Call Customer'}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => navigate('/route')}
                        className="flex-1 bg-[#8C4A32] hover:bg-[#783D29] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <Navigation size={13} />
                        <span>{isTamil ? 'நேரடி பாதை' : 'View Live Route'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* FOOD ITEMS CARD */}
                <div className="bg-white border border-[#EADBCC] rounded-2xl p-3 shadow-xs space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#2C231E]">{activeOrder.items}</span>
                    <span className="text-[#8C4A32]">{activeOrder.amount}</span>
                  </div>
                  <p className="text-[10px] text-[#7C746E]">
                    Payment: {activeOrder.paymentMode} • Collect {activeOrder.amount} at doorstep
                  </p>
                </div>

                {/* PRIMARY LIFECYCLE ACTION BUTTON */}
                <div className="pt-1">
                  {deliveryStage === 1 ? (
                    <button
                      onClick={handleFoodPickedUp}
                      className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <UtensilsCrossed size={16} />
                      <span>{isTamil ? 'உணவு எடுக்கப்பட்டது (Food is Taken)' : 'Food Picked Up / Taken from Chef'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowOtpModal(true)}
                      className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 animate-pulse"
                    >
                      <ShieldCheck size={16} />
                      <span>{isTamil ? 'வாடிக்கையாளர் ஒப்படைப்பு OTP உள்ளிடவும்' : 'Enter Customer Handover OTP'}</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 text-center shadow-xs space-y-2">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h3 className="font-serif font-bold text-base text-[#2C231E]">
                  {isTamil ? 'அனைத்து டெலிவரிகளும் முடிந்தது!' : 'All Active Deliveries Completed!'}
                </h3>
                <p className="text-xs text-[#7C746E]">
                  {isTamil ? 'அடுத்த டெலிவரியை ஏற்க கீழே உள்ள ரேடாரை சரிபார்க்கவும்.' : 'Check the radar below to accept your next nearby delivery.'}
                </p>
              </div>
            )}

            {/* RADAR AVAILABLE ORDERS (3-7 km & 10-15 km Long Distance) */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="font-serif font-bold text-xs text-[#8C4A32]">
                    {isTamil ? 'அருகிலுள்ள மற்றும் நீண்ட தூர ஆர்டர்கள்' : 'Available Delivery Radar (3-7 km & 10-15 km)'}
                  </h3>
                  <p className="text-[10px] text-[#7C746E]">
                    {isTamil ? 'சமையல்காரரால் ஏற்கப்பட்ட ஆர்டர்கள் மட்டுமே தோன்றும்' : 'Ready for pickup once chef confirms cooking'}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {availableOrders.length} {isTamil ? 'தயார்' : 'Ready'}
                </span>
              </div>

              {availableOrders.length === 0 ? (
                <div className="p-4 bg-white border border-[#EADBCC] rounded-2xl text-center text-xs text-[#7C746E]">
                  {isTamil ? 'உங்கள் பகுதியில் புதிய ஆர்டர்களுக்கு காத்திருக்கிறது...' : 'Scanning for chef-confirmed orders in your zone...'}
                </div>
              ) : (
                <div className="space-y-3">
                  {availableOrders.map(order => (
                    <div
                      key={order.id}
                      className={`bg-white rounded-2xl p-3.5 shadow-xs flex flex-col gap-2.5 border-2 ${
                        order.isLongDistance ? 'border-amber-400 bg-amber-50/20' : 'border-[#EADBCC]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-bold text-xs text-[#2C231E]">{order.chefName}</p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              order.isLongDistance 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              {isTamil ? order.distanceBadgeTa : order.distanceBadge}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-1 inline-block">
                            ✓ {isTamil ? 'சமையல்காரர் ஏற்றுக் கொண்டார்' : 'Chef Accepted & Cooking'}
                          </span>
                        </div>
                        
                        <div className="text-right">
                          <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 block">
                            {order.payout} {isTamil ? 'வருமானம்' : 'Payout'}
                          </span>
                          {order.isLongDistance && (
                            <span className="text-[9px] font-bold text-amber-700 block mt-0.5">
                              {isTamil ? 'அதிக கட்டணம்' : 'High Payout'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* DISTANCE & ROUGH LOCATION (STRICT PRIVACY BEFORE ACCEPTANCE) */}
                      <div className="bg-[#FAF6EE] p-2.5 rounded-xl border border-[#E8DEC8] space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#6C645E]">🛵 {isTamil ? 'ரைடர் ➔ சமையலறை:' : 'Rider to Kitchen:'} <b>{order.distRiderToChef}</b></span>
                          <span className="text-[#6C645E]">🍳 {isTamil ? 'சமையலறை ➔ டெலிவரி:' : 'Kitchen to Drop:'} <b>{order.distChefToCustomer}</b></span>
                        </div>
                        
                        <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#E8DEC8] font-bold">
                          <span>{isTamil ? 'மொத்த தூரம்:' : 'Total Distance:'}</span>
                          <span className={order.isLongDistance ? 'text-amber-800' : 'text-emerald-700'}>
                            {order.totalDistance}
                          </span>
                        </div>

                        <p className="text-[11px] font-semibold text-[#2C231E]">
                          📍 {isTamil ? 'தோராயமான பகுதி:' : 'Approximate Zone:'} {order.chefRoughArea} ➔ {order.customerRoughArea}
                        </p>
                        
                        <p className="text-[9px] text-[#8C4A32] italic flex items-center gap-1">
                          <Lock size={10} />
                          <span>
                            {isTamil 
                              ? 'சமையலறை மற்றும் வாடிக்கையாளரின் துல்லியமான முகவரி நீங்கள் ஆர்டரை ஏற்ற பின்னரே திறக்கப்படும்.' 
                              : 'Exact house & flat addresses locked until you accept the order.'}
                          </span>
                        </p>
                      </div>

                      <div className="text-[11px] text-[#6C645E]">
                        {order.items}
                      </div>

                      <button
                        onClick={() => handleAcceptOrder(order)}
                        className={`w-full text-white text-xs font-bold py-2.5 rounded-xl transition shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 ${
                          order.isLongDistance 
                            ? 'bg-[#B45309] hover:bg-[#92400E]' 
                            : 'bg-[#8C4A32] hover:bg-[#783D29]'
                        }`}
                      >
                        <span>
                          {isTamil ? `ஆர்டரை ஏற்கவும் (${order.payout})` : `Accept Delivery Order (${order.payout})`}
                        </span>
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
              <h3 className="font-serif font-bold text-sm text-[#8C4A32]">
                {isTamil ? 'டெலிவரி வருமான வரலாறு' : 'Delivery Earnings History'}
              </h3>
              <span className="text-xs text-[#7C746E]">
                {completedOrders.length} {isTamil ? 'முடிந்தது' : 'Completed'}
              </span>
            </div>

            {completedOrders.map((order, index) => (
              <div
                key={order.id || index}
                className="bg-white border border-[#EADBCC] rounded-3xl p-4 shadow-xs text-xs space-y-2.5"
              >
                <div className="flex justify-between items-start border-b border-[#F0E6D8] pb-2">
                  <div>
                    <span className="font-mono font-bold text-[#2C231E] text-xs">{order.id}</span>
                    <p className="text-[10px] text-[#7C746E]">{order.date} • {order.distance}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <Check size={12} />
                    <span>{isTamil ? 'வழங்கப்பட்டது' : 'Delivered'}</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px]">
                  <p><b>{isTamil ? 'சமையலறை:' : 'Kitchen:'}</b> {order.chefName}</p>
                  <p><b>{isTamil ? 'வாடிக்கையாளர்:' : 'Customer:'}</b> {order.customerName} ({order.address})</p>
                  <p className="text-[10px] text-[#7C746E]">{order.items}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#F0E6D8] text-xs">
                  <span className="text-[#6C645E]">{isTamil ? 'பெறப்பட்ட தொகை:' : 'Cash Collected:'} <b>{order.amountCollected}</b></span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl">
                    +{order.earnedForOrder} {isTamil ? 'வரவு' : 'Earned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Customer Handover OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF6EE] border border-[#EADBCC] rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-xl">
              <ShieldCheck size={26} />
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[#2C231E]">
                {isTamil ? 'வாடிக்கையாளர் OTP சரிபார்ப்பு' : 'Verify Handover OTP'}
              </h3>
              <p className="text-xs text-[#6C645E] mt-1">
                {isTamil 
                  ? 'உணவை ஒப்படைக்கும் முன் வாடிக்கையாளரிடம் உள்ள 4-இலக்க குறியீட்டை கேட்கவும் (Default: 4821)' 
                  : 'Ask the customer for the 4-digit code shown on their HomePot app before handing over food.'}
              </p>
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
                placeholder="• • • •"
                className="w-full text-center text-2xl font-mono font-bold tracking-widest bg-white border-2 border-[#DFCBB5] focus:border-[#8C4A32] rounded-2xl py-3 focus:outline-none"
                autoFocus
              />

              {otpError && (
                <p className="text-[11px] font-semibold text-rose-700">{otpError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#D2C5B6] text-xs font-semibold text-[#6C645E] hover:bg-white cursor-pointer"
                >
                  {isTamil ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  {isTamil ? 'சரிபார்' : 'Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Persistent Bottom Delivery Navigation */}
      <DeliveryNavbar activeTab="home" />

    </div>
  );
}
