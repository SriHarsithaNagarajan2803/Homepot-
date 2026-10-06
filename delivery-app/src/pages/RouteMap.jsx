import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Navigation, Phone, ShieldCheck, AlertTriangle, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function RouteMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const [riderProgress, setRiderProgress] = useState(48); // % along the route
  const [etaMins, setEtaMins] = useState(11);

  // Simulate rider moving along route
  useEffect(() => {
    const timer = setInterval(() => {
      setRiderProgress(prev => (prev < 90 ? prev + 1 : 90));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen h-full flex flex-col justify-between bg-[#EFECE6] text-[#2C231E] font-sans select-none overflow-hidden">
      
      {/* Top Floating Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => navigate('/radar')}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/95 border border-[#EADBCC] flex items-center justify-center text-[#2C231E] shadow-md hover:bg-white active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Live ETA Pill + Language Selector */}
        <div className="pointer-events-auto flex items-center gap-2">
          <LanguageSelector variant="round" />
          <div className="bg-[#8C4A32] text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 border border-white/20">
            <Clock size={16} className="text-amber-200 animate-pulse" />
            <div>
              <p className="text-[10px] text-orange-200 font-bold uppercase tracking-wider">
                {isTamil ? 'மதிப்பிடப்பட்ட நேரம்' : 'Estimated Drop'}
              </p>
              <p className="text-xs font-bold font-mono">{etaMins} {isTamil ? 'நிமிடம்' : 'mins'} • 2.4 km</p>
            </div>
          </div>
        </div>
      </div>

      {/* GOOGLE MAPS STYLE INTERACTIVE CANVAS */}
      <div className="relative w-full h-[65vh] bg-[#E8E4DA] overflow-hidden flex items-center justify-center">
        
        {/* Map Streets Background Grid */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#DCD6C8" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="#E8E4DA" />
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Secondary Roads */}
          <path d="M 0 140 Q 180 150 420 120" stroke="#FFFFFF" strokeWidth="16" fill="none" />
          <path d="M 0 140 Q 180 150 420 120" stroke="#D1C9BA" strokeWidth="1" fill="none" />

          <path d="M 120 0 Q 110 240 130 500" stroke="#FFFFFF" strokeWidth="18" fill="none" />
          <path d="M 120 0 Q 110 240 130 500" stroke="#D1C9BA" strokeWidth="1" fill="none" />

          <path d="M 280 0 Q 300 280 290 500" stroke="#FFFFFF" strokeWidth="16" fill="none" />
          <path d="M 280 0 Q 300 280 290 500" stroke="#D1C9BA" strokeWidth="1" fill="none" />

          {/* MAIN DELIVERY ROUTE PATH */}
          {/* Segment 1: Kitchen to 2nd Avenue (Clear Road - Green) */}
          <path 
            d="M 60 380 L 120 280 L 120 220" 
            stroke="#10B981" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />

          {/* Segment 2: TRAFFIC BOTTLENECK SECTION (Light Red / Traffic Jam like Google Maps) */}
          <path 
            d="M 120 220 L 220 220 L 280 200" 
            stroke="#EA4335" 
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
            filter="drop-shadow(0 0 6px rgba(234, 67, 53, 0.6))"
          />

          {/* Segment 3: 2nd Avenue to Customer Drop (Clear Road - Blue/Green) */}
          <path 
            d="M 280 200 L 280 130 L 350 90" 
            stroke="#10B981" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />
        </svg>

        {/* Street Name Labels */}
        <div className="absolute top-[28%] left-[28%] bg-white/90 border border-[#D2C5B6] px-2 py-0.5 rounded text-[9px] font-bold text-[#593222] shadow-xs pointer-events-none">
          2nd Avenue Junction
        </div>
        <div className="absolute top-[16%] left-[64%] bg-white/90 border border-[#D2C5B6] px-2 py-0.5 rounded text-[9px] font-bold text-[#593222] shadow-xs pointer-events-none">
          Vadapalani 5th Main
        </div>

        {/* Start Point: Chef Radha Amma's Kitchen */}
        <div className="absolute bottom-[24%] left-[10%] flex flex-col items-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg border-2 border-white text-xs">
            🍳
          </div>
          <span className="bg-white/95 px-1.5 py-0.5 rounded text-[9px] font-bold text-[#2C231E] shadow-xs mt-1">
            Amma's Kitchen
          </span>
        </div>

        {/* TRAFFIC JAM CALLOUT (Light Red Google Maps Style) */}
        <div className="absolute top-[32%] left-[42%] flex flex-col items-center pointer-events-none z-20">
          <div className="bg-[#EA4335] text-white px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-lg flex items-center gap-1.5 animate-bounce border border-white">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>Heavy Traffic Slowdown (+4m)</span>
          </div>
          <div className="w-2 h-2 bg-[#EA4335] rotate-45 -mt-1"></div>
        </div>

        {/* Active Rider Position Marker (Motorcycle Icon) */}
        <div 
          className="absolute z-20 transition-all duration-1000 flex flex-col items-center"
          style={{ top: '35%', left: '46%' }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#8C4A32] text-white flex items-center justify-center text-lg shadow-xl border-2 border-white animate-pulse">
              🛵
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white"></div>
          </div>
          <span className="bg-[#2C231E] text-white px-1.5 py-0.2 rounded text-[8px] font-bold shadow-xs mt-0.5">
            You (Rider)
          </span>
        </div>

        {/* Destination: Customer Kavitha R. */}
        <div className="absolute top-[10%] right-[10%] flex flex-col items-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-[#EA4335] text-white flex items-center justify-center shadow-lg border-2 border-white text-xs">
            🏡
          </div>
          <span className="bg-white/95 px-1.5 py-0.5 rounded text-[9px] font-bold text-[#2C231E] shadow-xs mt-1">
            Customer Drop
          </span>
        </div>

      </div>

      {/* BOTTOM DETAIL CARD */}
      <div className="flex-1 bg-[#FAF6EE] border-t-2 border-[#EADBCC] rounded-t-3xl p-5 shadow-2xl flex flex-col justify-between -mt-6 z-30 space-y-3">
        
        {/* Turn-by-Turn Instruction Bar */}
        <div className="bg-white border border-[#EADBCC] p-3 rounded-2xl flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#8C4A32] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Navigation size={20} className="rotate-45" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#7C746E] uppercase font-bold tracking-wider">
              {isTamil ? 'அடுத்த திசை' : 'Next Direction'}
            </p>
            <p className="text-xs font-bold text-[#2C231E] truncate">
              {isTamil ? '200 மீட்டரில், 5வது பிரதான சாலையில் இடதுபுறம் திரும்பவும்' : 'In 200m, turn left onto 5th Main Road'}
            </p>
          </div>
        </div>

        {/* Prominent Traffic Alert Explanation */}
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 flex items-start gap-2.5 text-xs shadow-xs">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-bold text-rose-950 text-xs">
              {isTamil 
                ? '2வது அவென்யூவில் போக்குவரத்து நெரிசல் (வரைபடத்தில் சிவப்பு நிறத்தில் குறிக்கப்பட்டுள்ளது)' 
                : 'Traffic Bottleneck on 2nd Avenue (Marked in Red on Map)'}
            </p>
            <p className="text-[11px] text-rose-800 leading-snug mt-0.5">
              {isTamil
                ? 'நேரலை சிவப்பு போக்குவரத்து அறிகுறி மூலம் வாடிக்கையாளருக்கு தகவல் தெரிவிக்கப்பட்டுள்ளது. எனவே நீங்கள் சிக்னலில் காத்திருப்பதை அவர்கள் அறிவார்கள். சேதமடையாத பேக்கேஜிங் உணவின் சூட்டைப் பாதுகாக்கிறது.'
                : 'The customer has been notified with the live red traffic indicator so they know you are waiting at the signal with their food. Tamper-proof food packaging preserves meal heat.'}
            </p>
          </div>
        </div>

        {/* Customer Address Details & Call */}
        <div className="bg-white border border-[#EADBCC] p-3 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              KR
            </div>
            <div>
              <p className="text-xs font-bold text-[#2C231E]">Kavitha R. ({isTamil ? 'வாடிக்கையாளர்' : 'Customer'})</p>
              <p className="text-[10px] text-[#7C746E]">Door 14, 5th Main Road, Vadapalani</p>
            </div>
          </div>

          <a 
            href="tel:9445512345"
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 cursor-pointer shadow-xs transition"
            title="Call Customer"
          >
            <Phone size={16} />
          </a>
        </div>

        {/* Return to Dashboard */}
        <button
          onClick={() => navigate('/radar')}
          className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>{isTamil ? 'ஆர்டர் நடவடிக்கைகளுக்குத் திரும்புக' : 'Return to Order Actions'}</span>
          <span>➔</span>
        </button>

      </div>

    </div>
  );
}
