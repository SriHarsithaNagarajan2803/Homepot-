import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Navigation, 
  Check, 
  UtensilsCrossed, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Zap, 
  Bike,
  RefreshCw,
  Clock,
  ChevronRight
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

  // Check if an order is already active in progress
  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('homepot_active_delivery_order');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Nearby Available Orders Waiting on Radar (Chef-Accepted & Waiting for Rider)
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: '#HP-48921',
      isLongDistance: false,
      distanceBadge: '🛵 Standard Two-Wheeler (3 to 7 km)',
      distanceBadgeTa: '🛵 இருசக்கர வாகனம் (3 முதல் 7 கி.மீ)',
      chefName: 'Radha Amma',
      chefRoughArea: 'Anna Nagar West',
      chefFullAddress: 'Flat 3B, Plot 42, 2nd Cross Street, Anna Nagar West, Chennai',
      chefPhone: '+91 98765 12345',
      customerName: 'Kavitha R.',
      customerRoughArea: 'Near Vadapalani Metro',
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
      mealType: 'Lunch Special',
      amount: '₹310',
      payout: '₹75'
    },
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
      itemList: [
        { name: 'Special South Indian Full Meals', qty: 4, price: '₹520' },
        { name: 'Traditional Filter Coffee Flask', qty: 1, price: '₹100' }
      ],
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
      itemList: [
        { name: 'Traditional Ghee Podi Idli (4 pcs)', qty: 3, price: '₹210' },
        { name: 'Crispy Medu Vadai (2 pcs)', qty: 2, price: '₹60' }
      ],
      mealType: 'Snack & Dinner',
      amount: '₹270',
      payout: '₹70'
    }
  ]);

  // Completed Orders History
  const [completedOrders, setCompletedOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('homepot_completed_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
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
    ];
  });

  // Accept Order -> Save & Navigate to Chef Pickup Page
  const handleAcceptOrder = (order) => {
    const fullOrder = {
      ...order,
      status: 'HEADING_TO_KITCHEN',
      foodPickedUp: false,
      acceptedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    localStorage.setItem('homepot_active_delivery_order', JSON.stringify(fullOrder));
    localStorage.setItem('homepot_delivery_stage', '1');
    setActiveOrder(fullOrder);

    // Notify Chef & Customer
    try {
      const riderProfile = JSON.parse(localStorage.getItem('homepot_rider_profile') || '{}');
      const notif = {
        id: Date.now(),
        orderId: order.id,
        recipient: 'all',
        title: '🛵 Delivery Partner Assigned!',
        message: `Delivery Partner accepted order ${order.id} and is heading to Amma's kitchen for pickup.`,
        riderName: riderProfile.name || 'Delivery Partner',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      localStorage.setItem('homepot_live_notification', JSON.stringify(notif));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}

    // Navigate to Chef Pickup Page immediately
    navigate('/chef-pickup');
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
            <span>{isTamil ? 'செயலில் உள்ள ஆர்டர்கள்' : 'Available Radar Orders'}</span>
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
        
        {/* TAB 1: RADAR WAITING ORDERS */}
        {activeTab === 'in_progress' && (
          <div className="space-y-3.5">
            
            {/* If an order is already in progress, show resume shortcut */}
            {activeOrder && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-[#8C4A32] rounded-3xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#8C4A32] uppercase tracking-wider block">
                    {isTamil ? 'தற்போது செல்லும் ஆர்டர்' : 'Active Delivery In Progress'}
                  </span>
                  <p className="font-mono font-bold text-sm text-[#2C231E]">{activeOrder.id} • {activeOrder.chefName}</p>
                  <p className="text-[11px] text-[#6C645E]">
                    {activeOrder.foodPickedUp 
                      ? (isTamil ? 'வாடிக்கையாளருக்கு டெலிவரி' : 'Heading to Customer') 
                      : (isTamil ? 'சமையலறை பிக்அப்' : 'Heading to Kitchen')}
                  </p>
                </div>
                <button
                  onClick={() => navigate(activeOrder.foodPickedUp ? '/customer-drop' : '/chef-pickup')}
                  className="bg-[#8C4A32] hover:bg-[#783D29] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <span>{isTamil ? 'தொடர' : 'Resume'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            {/* RADAR AVAILABLE ORDERS (FIRST THING USER SEES) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="font-serif font-bold text-xs text-[#8C4A32]">
                    {isTamil ? 'காத்திருக்கும் ஆர்டர்கள் (Waiting Orders)' : 'Active Waiting Orders on Radar'}
                  </h3>
                  <p className="text-[10px] text-[#7C746E]">
                    {isTamil ? 'ஆர்டரை ஏற்றவுடன் சமையலறை முகவரி திறக்கப்படும்' : 'Chef address will reveal once accepted'}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {availableOrders.length} {isTamil ? 'ஆர்டர்கள்' : 'Waiting'}
                </span>
              </div>

              {availableOrders.map(order => (
                <div
                  key={order.id}
                  className={`bg-white rounded-3xl p-4 shadow-xs flex flex-col gap-3 border-2 transition-all ${
                    order.isLongDistance ? 'border-amber-400 bg-amber-50/20' : 'border-[#EADBCC]'
                  }`}
                >
                  {/* Card Header: Chef Name, Distance Badge, Payout */}
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
                        ✓ {isTamil ? 'சமையல்காரர் ஏற்றுக் கொண்டார்' : 'Chef Accepted & Ready for Pickup'}
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

                  {/* Distance Breakdown & Approximate Area */}
                  <div className="bg-[#FAF6EE] p-3 rounded-2xl border border-[#E8DEC8] space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#6C645E]">🛵 {isTamil ? 'ரைடர் ➔ சமையலறை:' : 'Rider to Kitchen:'} <b>{order.distRiderToChef}</b></span>
                      <span className="text-[#6C645E]">🍳 {isTamil ? 'சமையலறை ➔ வாடிக்கையாளர்:' : 'Kitchen to Drop:'} <b>{order.distChefToCustomer}</b></span>
                    </div>
                    
                    <div className="flex justify-between items-center text-[11px] pt-1 border-t border-[#E8DEC8] font-bold">
                      <span>{isTamil ? 'மொத்த தூரம்:' : 'Total Distance:'}</span>
                      <span className={order.isLongDistance ? 'text-amber-800' : 'text-emerald-700'}>
                        {order.totalDistance}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-[#2C231E]">
                      📍 {isTamil ? 'தோராயமான பாதை:' : 'Approximate Route:'} {order.chefRoughArea} ➔ {order.customerRoughArea}
                    </p>
                    
                    <p className="text-[9px] text-[#8C4A32] italic flex items-center gap-1">
                      <Lock size={10} />
                      <span>
                        {isTamil 
                          ? 'துல்லியமான சமையலறை முகவரி நீங்கள் ஆர்டரை ஏற்றவுடன் அடுத்த பக்கத்தில் திறக்கப்படும்.' 
                          : 'Exact chef address will reveal on the next page once you accept.'}
                      </span>
                    </p>
                  </div>

                  <div className="text-[11px] text-[#6C645E]">
                    {order.items}
                  </div>

                  {/* Accept Button -> Navigates to Chef Pickup */}
                  <button
                    onClick={() => handleAcceptOrder(order)}
                    className={`w-full text-white text-xs font-bold py-3 rounded-2xl transition shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-2 ${
                      order.isLongDistance 
                        ? 'bg-[#B45309] hover:bg-[#92400E]' 
                        : 'bg-[#8C4A32] hover:bg-[#783D29]'
                    }`}
                  >
                    <span>
                      {isTamil ? `ஆர்டரை ஏற்கவும் (${order.payout}) ➔` : `Accept Delivery Order (${order.payout}) ➔`}
                    </span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
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
                    <p className="text-[10px] text-[#7C746E]">{order.date} • {order.distance || '4.0 km'}</p>
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
                  <span className="text-[#6C645E]">{isTamil ? 'பெறப்பட்ட ரொக்கம்:' : 'Cash Collected:'} <b>{order.amountCollected}</b></span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl">
                    +{order.earnedForOrder} {isTamil ? 'வரவு' : 'Earned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Persistent Bottom Delivery Navigation */}
      <DeliveryNavbar activeTab="home" />

    </div>
  );
}
