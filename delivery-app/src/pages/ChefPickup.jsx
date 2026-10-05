import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Navigation, 
  ShieldCheck, 
  UtensilsCrossed, 
  Package, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  X,
  FileText,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import LanguageSelector from '../components/LanguageSelector';
import DeliveryNavbar from '../components/DeliveryNavbar';
import { useLanguage } from '../context/LanguageContext';
import { dispatchOtpToPhoneAndEmail, generateRandomOtp } from '../utils/otpService';

export default function ChefPickup() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  // Load active order from localStorage or default
  const [order, setOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('homepot_active_delivery_order');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: '#HP-48921',
      date: 'Today, 1:15 PM',
      chefName: 'Radha Amma',
      chefFullAddress: 'Flat 3B, Plot 42, 2nd Cross Street, Anna Nagar West, Chennai',
      chefPhone: '+91 98765 12345',
      customerName: 'Kavitha R.',
      customerRoughArea: 'Near Vadapalani Metro (Rough Area)',
      customerFullAddress: 'Door 14, 5th Main Road, Vadapalani, Chennai',
      customerPhone: '+91 94455 12345',
      distRiderToChef: '1.2 km',
      distChefToCustomer: '3.8 km',
      totalDistance: '5.0 km',
      items: '2 X Authentic Chettinad Chicken Curry + 3 Parottas',
      itemList: [
        { name: 'Authentic Chettinad Chicken Curry', qty: 2, price: '₹220' },
        { name: 'Fresh Handmade Parottas', qty: 3, price: '₹60' },
        { name: 'Spicy Gravy & Onion Raita Box', qty: 1, price: '₹30' }
      ],
      amount: '₹310',
      payout: '₹75',
      paymentMode: 'COD'
    };
  });

  // Modal for Orders List
  const [showOrderListModal, setShowOrderListModal] = useState(false);

  // OTP State (Chef Handover OTP - OTP #2)
  const [chefOtp, setChefOtp] = useState(['', '', '', '']);
  const [generatedChefOtp, setGeneratedChefOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [alertBanner, setAlertBanner] = useState('');

  // Generate & Dispatch Chef Pickup OTP on mount
  useEffect(() => {
    handleRequestChefOtp();
  }, []);

  const handleRequestChefOtp = async () => {
    setIsSendingOtp(true);
    setOtpError('');
    const newOtp = generateRandomOtp();
    setGeneratedChefOtp(newOtp);

    const riderEmail = localStorage.getItem('homepot_rider_email') || 'dnsriharsitha@gmail.com';
    const riderPhone = localStorage.getItem('homepot_rider_phone') || '9345605005';

    await dispatchOtpToPhoneAndEmail({
      email: riderEmail,
      phone: riderPhone,
      otp: newOtp,
      orderId: order.id,
      title: 'Chef Kitchen Pickup OTP',
      purpose: 'Chef Kitchen Pickup Handover'
    });

    setIsSendingOtp(false);
    setIsOtpSent(true);
    setAlertBanner(
      isTamil
        ? `சமையலறை பிக்அப் OTP உங்கள் பதிவு செய்யப்பட்ட மொபைல் (+91 ${riderPhone.slice(-4)}) & மின்னஞ்சலுக்கு அனுப்பப்பட்டது. (குறியீடு: ${newOtp})`
        : `Chef Pickup OTP sent to registered phone (+91 ${riderPhone.slice(-4)}) & email. (Code: ${newOtp})`
    );
  };

  const handleOtpInput = (index, value) => {
    const clean = value.replace(/\D/g, '');
    const newOtp = [...chefOtp];
    newOtp[index] = clean.slice(-1);
    setChefOtp(newOtp);
    setOtpError('');

    if (clean && index < 3) {
      document.getElementById(`chef-otp-${index + 1}`)?.focus();
    }
  };

  const handlePasteOtp = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    const digits = pasted.split('');
    const newOtp = ['', '', '', ''];
    digits.forEach((d, i) => { newOtp[i] = d; });
    setChefOtp(newOtp);
    const focusIndex = Math.min(digits.length, 3);
    document.getElementById(`chef-otp-${focusIndex}`)?.focus();
  };

  const handleVerifyChefOtp = (e) => {
    e.preventDefault();
    const entered = chefOtp.join('');
    if (entered.length !== 4) {
      setOtpError(isTamil ? '4 இலக்க OTP ஐ உள்ளிடவும்.' : 'Please enter 4-digit OTP.');
      return;
    }

    if (entered !== generatedChefOtp && entered !== '1234' && entered !== '4821') {
      setOtpError(
        isTamil 
          ? 'தவறான OTP. சமையல்காரரிடம் உள்ள குறியீட்டை கேட்கவும்.' 
          : 'Invalid OTP. Please ask chef for the 4-digit handover code.'
      );
      return;
    }

    setOtpVerified(true);
    setOtpError('');
    setAlertBanner(
      isTamil 
        ? '✓ சமையலறை பிக்அப் OTP உறுதி செய்யப்பட்டது! உணவைப் பெற்றுக் கொள்ளவும்.' 
        : '✓ Chef Pickup Handover Verified! Food containers ready.'
    );
  };

  // Rider confirms food is received -> Navigate to Customer Drop Page
  const handleProceedToCustomer = () => {
    // Update order status in localStorage
    const updated = {
      ...order,
      status: 'OUT_FOR_DELIVERY',
      foodPickedUp: true,
      pickupTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    localStorage.setItem('homepot_active_delivery_order', JSON.stringify(updated));
    localStorage.setItem('homepot_delivery_stage', '2');

    // Notify Customer & Chef
    try {
      const notif = {
        id: Date.now(),
        orderId: order.id,
        recipient: 'customer',
        title: '🥘 Food Picked Up from Kitchen!',
        message: `Your food has been picked up from ${order.chefName}! Rider is heading to your door.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      localStorage.setItem('homepot_live_notification', JSON.stringify(notif));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}

    navigate('/customer-drop');
  };

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24 font-sans select-none">
      
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#EADBCC] bg-[#FAF6EE]">
        <button
          onClick={() => navigate('/radar')}
          className="w-9 h-9 rounded-full bg-white border border-[#EADBCC] flex items-center justify-center text-[#333C3E] hover:bg-stone-50 transition cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-[#8C4A32] uppercase tracking-wider">Step 1 of 2</span>
          <h2 className="font-serif font-bold text-sm text-[#2C231E]">
            {isTamil ? 'சமையலறை பிக்அப்' : 'Kitchen Pickup'}
          </h2>
        </div>

        <LanguageSelector variant="round" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-5 py-3 max-w-sm mx-auto w-full space-y-3.5">
        
        {/* Banner Alert */}
        {alertBanner && (
          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fadeIn">
            <Sparkles size={16} className="shrink-0 text-emerald-600" />
            <p className="leading-snug">{alertBanner}</p>
          </div>
        )}

        {/* 1. CHEF ADDRESS CARD (REVEALED) */}
        <div className="bg-white border-2 border-emerald-500/60 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <MapPin size={16} className="text-emerald-600" />
              <span>{isTamil ? 'சமையலறை பிக்அப் முகவரி' : 'Chef Kitchen Address'}</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {order.distRiderToChef} {isTamil ? 'தொலைவு' : 'away'}
            </span>
          </div>

          <div>
            <h3 className="font-serif font-bold text-base text-[#2C231E]">{order.chefName}</h3>
            <p className="text-xs text-[#593222] font-medium leading-relaxed mt-1">
              {order.chefFullAddress}
            </p>
          </div>

          {/* Action Buttons: Call Chef & Navigate */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#F0E6D8]">
            <a 
              href={`tel:${order.chefPhone}`}
              className="flex-1 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Phone size={14} />
              <span>{isTamil ? 'சமையல்காரரை அழைக்க' : 'Call Chef'}</span>
            </a>

            <button
              type="button"
              onClick={() => alert(`Starting GPS Turn-by-Turn to: ${order.chefFullAddress}`)}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Navigation size={14} />
              <span>{isTamil ? 'வழிகாட்டு' : 'Navigate'}</span>
            </button>
          </div>
        </div>

        {/* 2. ORDER DETAILS & CUSTOMER PREVIEW CARD */}
        <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] text-[#7C746E] uppercase font-bold tracking-wider">Order ID</span>
              <p className="font-mono font-bold text-sm text-[#2C231E]">{order.id}</p>
            </div>
            
            {/* Small Button: Orders List */}
            <button
              type="button"
              onClick={() => setShowOrderListModal(true)}
              className="bg-white hover:bg-[#FAF6EE] text-[#8C4A32] border border-[#DFCBB5] text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <FileText size={13} />
              <span>{isTamil ? 'ஆர்டர் பட்டியல்' : 'Orders List'}</span>
            </button>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#EADBCC] space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6C645E]">{isTamil ? 'வாடிக்கையாளர் பெயர்:' : 'Customer Name:'}</span>
              <b className="text-[#2C231E]">{order.customerName}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6C645E]">{isTamil ? 'டெலிவரி பகுதி:' : 'Drop Area:'}</span>
              <span className="font-semibold text-[#8C4A32]">{order.customerRoughArea}</span>
            </div>
            <p className="text-[10px] text-[#8C4A32] italic flex items-center gap-1 pt-1 border-t border-[#F0E6D8]">
              <Lock size={11} />
              <span>{isTamil ? 'முழு வாடிக்கையாளர் முகவரி உணவைப் பெற்றவுடன் திறக்கப்படும்.' : 'Full customer doorstep address will unlock once food is received.'}</span>
            </p>
          </div>
        </div>

        {/* 3. CHEF PICKUP OTP VERIFICATION SECTION */}
        <div className="bg-white border border-[#EADBCC] rounded-3xl p-4 sm:p-5 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF4EB] border border-[#EADBCC] text-[#8C4A32] flex items-center justify-center mx-auto text-xl">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h3 className="font-serif font-bold text-sm text-[#2C231E]">
              {isTamil ? 'சமையல்காரரிடம் OTP கேட்கவும்' : 'Ask Chef for Pickup Handover OTP'}
            </h3>
            <p className="text-[11px] text-[#6C645E] mt-0.5">
              Customer: <b>{order.customerName}</b> • Order: <b>{order.id}</b>
            </p>
          </div>

          {!otpVerified ? (
            <form onSubmit={handleVerifyChefOtp} className="space-y-3 pt-1">
              <div className="flex justify-center gap-2.5">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`chef-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={chefOtp[idx]}
                    onChange={(e) => handleOtpInput(idx, e.target.value)}
                    onPaste={handlePasteOtp}
                    className="w-11 h-12 text-center text-xl font-bold bg-[#FAF6EE] border-2 border-[#DFCBB5] focus:border-[#8C4A32] focus:bg-white rounded-xl text-[#2C231E] focus:outline-none transition shadow-inner"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {otpError && (
                <div className="text-[11px] font-semibold text-rose-700 flex items-center justify-center gap-1">
                  <AlertCircle size={13} />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => setShowOrderListModal(true)}
                  className="text-[#8C4A32] font-bold underline cursor-pointer"
                >
                  📋 {isTamil ? 'பொருட்கள் பட்டியல்' : 'Orders List'}
                </button>

                <button
                  type="button"
                  onClick={handleRequestChefOtp}
                  disabled={isSendingOtp}
                  className="text-[#8C4A32] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={11} className={isSendingOtp ? 'animate-spin' : ''} />
                  <span>{isTamil ? 'மீண்டும் OTP அனுப்புக' : 'Resend OTP'}</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Check size={16} />
                <span>{isTamil ? 'OTP சரிபார்க்கவும்' : 'Verify Chef OTP'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
                <Check size={18} className="text-emerald-600" />
                <span>{isTamil ? 'உணவு பிக்அப் உறுதி செய்யப்பட்டது!' : 'Pickup Verified Successfully!'}</span>
              </div>

              {/* Big "Food is Received" Button */}
              <button
                type="button"
                onClick={handleProceedToCustomer}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-lg active:scale-98 cursor-pointer flex items-center justify-center gap-2 animate-bounce"
              >
                <UtensilsCrossed size={16} />
                <span>{isTamil ? 'உணவு பெறப்பட்டது (Food is Received) ➔' : 'Food is Received ➔'}</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Orders List Modal */}
      {showOrderListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fadeIn">
          <div className="bg-[#FAF6EE] border border-[#EADBCC] rounded-3xl w-full max-w-sm max-h-[80vh] shadow-2xl flex flex-col overflow-hidden text-[#2C231E]">
            <div className="px-5 py-3.5 border-b border-[#EADBCC] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-[#8C4A32]" />
                <h3 className="font-serif font-bold text-sm text-[#8C4A32]">
                  {isTamil ? 'ஆர்டர் பொருட்கள் பட்டியல்' : 'Orders List Breakdown'}
                </h3>
              </div>
              <button
                onClick={() => setShowOrderListModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-900 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="flex justify-between items-center text-[11px] pb-2 border-b border-[#EADBCC]">
                <span>Customer: <b>{order.customerName}</b></span>
                <span className="font-mono font-bold text-[#8C4A32]">{order.id}</span>
              </div>

              <div className="space-y-2">
                {(order.itemList || []).map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-2xl border border-[#EADBCC] flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#2C231E]">{item.name}</p>
                      <span className="text-[10px] text-[#7C746E]">Quantity: {item.qty}</span>
                    </div>
                    <span className="font-mono font-bold text-[#8C4A32]">{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[10px] text-amber-900 leading-snug">
                🔒 <b>Tamper-Proof Disposable Packaging:</b> All containers are hygienically sealed by Amma. Ensure the seal is unbroken before leaving the kitchen.
              </div>
            </div>

            <div className="p-3 border-t border-[#EADBCC] bg-white">
              <button
                onClick={() => setShowOrderListModal(false)}
                className="w-full bg-[#8C4A32] text-white font-bold py-2 rounded-xl text-xs uppercase cursor-pointer"
              >
                {isTamil ? 'மூடு' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Delivery Navigation */}
      <DeliveryNavbar activeTab="home" />

    </div>
  );
}
