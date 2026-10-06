import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Fingerprint, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowDownLeft,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomepotLogo from '../components/HomepotLogo';
import DeliveryNavbar from '../components/DeliveryNavbar';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function RiderPayout() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  // Confidential State: Locked by default
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [biometricStatus, setBiometricStatus] = useState('');

  // Total Earned Figures (Confidential)
  const earningsData = {
    today: 680.00,
    todayDeliveries: 8,
    week: 4250.00,
    weekDeliveries: 52,
    month: 18600.00,
    monthDeliveries: 224,
    recentOrders: [
      { 
        id: 'ORD-#HP12345-6789', 
        desc: 'Dinner Delivery to Amit S.', 
        descTa: 'இரவு உணவு டெலிவரி - அமித் எஸ்.',
        amount: 65.00, 
        time: 'Today, 2:30 PM', 
        timeTa: 'இன்று, 2:30 PM',
        dist: '4.2 km',
        distTa: '4.2 கி.மீ'
      },
      { 
        id: 'ORD-#HP99102-1209', 
        desc: 'Lunch Delivery to Senthil K.', 
        descTa: 'மதிய உணவு டெலிவரி - செந்தில் கே.',
        amount: 55.00, 
        time: 'Today, 1:15 PM', 
        timeTa: 'இன்று, 1:15 PM',
        dist: '2.4 km',
        distTa: '2.4 கி.மீ'
      },
      { 
        id: 'ORD-#HP88201-3312', 
        desc: 'Breakfast Delivery to Priya M.', 
        descTa: 'காலை உணவு டெலிவரி - பிரியா எம்.',
        amount: 75.00, 
        time: 'Today, 9:45 AM', 
        timeTa: 'இன்று, 9:45 AM',
        dist: '5.0 km',
        distTa: '5.0 கி.மீ'
      },
      { 
        id: 'ORD-#HP77192-5510', 
        desc: 'Dinner Delivery to Rajesh R.', 
        descTa: 'இரவு உணவு டெலிவரி - ராஜேஷ் ஆர்.',
        amount: 70.00, 
        time: 'Yesterday, 8:30 PM', 
        timeTa: 'நேற்று, 8:30 PM',
        dist: '3.6 km',
        distTa: '3.6 கி.மீ'
      }
    ]
  };

  const [availableToWithdraw, setAvailableToWithdraw] = useState(680.00);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Biometric Authentication simulation
  const handleBiometricAuth = async () => {
    setBiometricStatus(isTamil ? 'கைரேகை / முகம் சரிபார்க்கப்படுகிறது...' : 'Scanning fingerprint / face...');
    setTimeout(() => {
      setIsUnlocked(true);
      setShowAuthModal(false);
      setBiometricStatus('');
      setPinError('');
    }, 600);
  };

  // PIN Authentication
  const handlePinAuth = (e) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput.length >= 4) {
      setIsUnlocked(true);
      setShowAuthModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError(isTamil ? 'தவறான PIN. இயல்புநிலை 1234 ஐப் பயன்படுத்தவும்.' : 'Invalid PIN. Use default 1234 or your security PIN.');
    }
  };

  const handleWithdraw = () => {
    if (availableToWithdraw <= 0) return;
    setIsWithdrawing(true);

    setTimeout(() => {
      setIsWithdrawing(false);
      setAvailableToWithdraw(0);
      setSuccessMsg(isTamil ? 'UPI கணக்கிற்கு உடனடியாக மாற்றப்பட்டது!' : 'Successfully transferred to UPI!');
      setTimeout(() => setSuccessMsg(''), 4500);
    }, 1200);
  };

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24 font-sans select-none text-[15px]">
      
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-5 pt-4 pb-2.5 border-b border-[#EADBCC] bg-[#FAF6EE]">
        <button
          onClick={() => navigate('/radar')}
          className="w-9 h-9 rounded-full bg-white border border-[#EADBCC] flex items-center justify-center text-[#333C3E] hover:bg-stone-50 transition cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex flex-col items-center">
          <h2 className="font-serif font-bold text-base text-[#2C231E]">
            {isTamil ? 'மொத்த வருமானம்' : t('payout')}
          </h2>
          <span className="text-[10px] text-[#7C746E]">
            {isTamil ? 'பாதுகாக்கப்பட்ட பணப்பை' : 'Confidential Wallet'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Lock / Unlock Toggle */}
          <button
            onClick={() => {
              if (isUnlocked) {
                setIsUnlocked(false);
              } else {
                setShowAuthModal(true);
              }
            }}
            className="w-9 h-9 rounded-full bg-white border border-[#EADBCC] flex items-center justify-center text-[#8C4A32] shadow-xs cursor-pointer hover:bg-orange-50"
            title={isUnlocked ? (isTamil ? 'மறைக்க' : 'Lock') : (isTamil ? 'திறக்க' : 'Unlock')}
          >
            {isUnlocked ? <Unlock size={17} /> : <Lock size={17} />}
          </button>
          <LanguageSelector variant="round" />
        </div>
      </div>

      {/* Main Content - Zoomed Container (max-w-[480px]) */}
      <div className="flex-1 px-4 sm:px-6 py-3.5 max-w-[480px] mx-auto w-full space-y-4">
        
        {/* Main Earnings Card */}
        <div className="bg-gradient-to-br from-[#8C4A32] to-[#683220] text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-orange-200">
                {isTamil ? 'மொத்த வருமானம் (இன்று)' : `${t('total_earned')} (Day)`}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-1">
                {isUnlocked ? `₹${earningsData.today.toFixed(2)}` : '₹ ••••••'}
              </h2>
            </div>

            {/* Privacy Status Badge */}
            <button
              onClick={() => {
                if (isUnlocked) {
                  setIsUnlocked(false);
                } else {
                  setShowAuthModal(true);
                }
              }}
              className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition cursor-pointer"
            >
              {isUnlocked ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{isUnlocked ? (isTamil ? 'மறை' : t('lock_again')) : (isTamil ? 'திறக்க' : 'Unlock')}</span>
            </button>
          </div>

          {/* Locked State Warning / Unlock CTA */}
          {!isUnlocked && (
            <div className="mt-4 bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-amber-300 shrink-0" />
                <p className="text-[11px] text-orange-100 font-medium leading-tight">
                  {isTamil ? 'வருமானத்தைக் காண கைரேகை அல்லது PIN உள்ளிடவும்.' : t('confidential_sub')}
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-amber-300 hover:bg-amber-200 text-stone-900 font-bold text-[11px] px-3 py-1.5 rounded-xl shrink-0 cursor-pointer shadow-xs whitespace-nowrap"
              >
                {isTamil ? 'திறக்க' : t('unlock_earnings_btn')}
              </button>
            </div>
          )}

          {successMsg && (
            <div className="mt-3 bg-emerald-500 text-white text-xs p-2.5 rounded-xl font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Withdraw Section */}
          {isUnlocked && (
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-orange-200">
                  {isTamil ? 'வரவு:' : 'Available:'} ₹{availableToWithdraw.toFixed(2)}
                </p>
                <p className="text-xs text-white font-bold">
                  {isTamil ? 'உடனடி UPI பரிமாற்றம்' : 'Instant UPI Transfer'}
                </p>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={availableToWithdraw <= 0 || isWithdrawing}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                  availableToWithdraw > 0 ? 'bg-amber-300 text-stone-900 hover:bg-amber-200' : 'bg-stone-600 text-stone-300 cursor-not-allowed'
                }`}
              >
                {isWithdrawing 
                  ? (isTamil ? 'பரிமாற்றம் செய்யப்படுகிறது...' : 'Transferring...') 
                  : (isTamil ? 'உடனடியாக பணத்தை எடுக்க' : t('withdraw_instantly'))}
              </button>
            </div>
          )}
        </div>

        {/* Multi-Period Total Earned Grid: Today, Week, Month */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Day */}
          <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-3 text-center">
            <p className="text-[10px] text-[#7C746E] uppercase font-bold">{isTamil ? 'இன்று (நாள்)' : t('per_day_earned')}</p>
            <p className="text-sm sm:text-base font-serif font-bold text-[#8C4A32] mt-0.5">
              {isUnlocked ? `₹${earningsData.today}` : '₹ •••'}
            </p>
            <span className="text-[10px] text-[#7C746E]">
              {earningsData.todayDeliveries} {isTamil ? 'ஆர்டர்கள்' : 'Orders'}
            </span>
          </div>

          {/* Week */}
          <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-3 text-center">
            <p className="text-[10px] text-[#7C746E] uppercase font-bold">{isTamil ? 'இந்த வாரம்' : t('per_week_earned')}</p>
            <p className="text-sm sm:text-base font-serif font-bold text-[#8C4A32] mt-0.5">
              {isUnlocked ? `₹${earningsData.week}` : '₹ ••••'}
            </p>
            <span className="text-[10px] text-[#7C746E]">
              {earningsData.weekDeliveries} {isTamil ? 'ஆர்டர்கள்' : 'Orders'}
            </span>
          </div>

          {/* Month */}
          <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-3 text-center">
            <p className="text-[10px] text-[#7C746E] uppercase font-bold">{isTamil ? 'இந்த மாதம்' : t('per_month_earned')}</p>
            <p className="text-sm sm:text-base font-serif font-bold text-[#8C4A32] mt-0.5">
              {isUnlocked ? `₹${earningsData.month}` : '₹ •••••'}
            </p>
            <span className="text-[10px] text-[#7C746E]">
              {earningsData.monthDeliveries} {isTamil ? 'ஆர்டர்கள்' : 'Orders'}
            </span>
          </div>
        </div>

        {/* Per-Order Earnings List */}
        <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs sm:text-sm text-[#8C4A32] font-serif">
              {isTamil ? 'சமீபத்திய ஆர்டர் வருமானங்கள்' : t('recent_earnings')}
            </h3>
            {!isUnlocked && (
              <span className="text-[10px] font-semibold text-[#8C4A32] flex items-center gap-1">
                <Lock size={11} /> {isTamil ? 'பூட்டப்பட்டுள்ளது' : 'Locked'}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {earningsData.recentOrders.map((ord, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-[#EADBCC] rounded-2xl p-3 sm:p-3.5 flex justify-between items-center text-xs"
              >
                <div>
                  <p className="font-bold text-[#2C231E] text-xs sm:text-sm">{ord.id}</p>
                  <p className="text-[11px] text-[#7C746E] mt-0.5">
                    {isTamil ? ord.descTa : ord.desc} ({isTamil ? ord.distTa : ord.dist})
                  </p>
                  <p className="text-[10px] text-[#A09890] mt-0.5">
                    {isTamil ? ord.timeTa : ord.time}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#7C746E] block">
                    {isTamil ? 'இந்த ஆர்டருக்கான வருமானம்' : t('per_order_earned')}
                  </span>
                  <span className="font-mono font-bold text-sm sm:text-base text-emerald-700">
                    {isUnlocked ? `+₹${ord.amount.toFixed(2)}` : '+₹ •••'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Confidential Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] border-2 border-[#8C4A32] rounded-3xl p-6 max-w-xs w-full shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#8C4A32]">
                <ShieldCheck size={20} />
                <h3 className="font-serif font-bold text-base text-[#8C4A32]">
                  {isTamil ? 'வருமான பாதுகாப்பு பூட்டு' : t('confidential_title')}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setPinError('');
                }}
                className="w-7 h-7 rounded-full bg-white border border-[#EADBCC] flex items-center justify-center text-[#6C645E] cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-[#6C645E]">
              {isTamil 
                ? 'உங்கள் வருமானத்தைக் காண கைரேகை அல்லது 4-இலக்க பாதுகாப்பு PIN ஐப் பயன்படுத்தவும்.' 
                : t('confidential_sub')}
            </p>

            {/* Biometric Button */}
            <button
              onClick={handleBiometricAuth}
              className="w-full bg-[#333C3E] hover:bg-[#22292A] text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer"
            >
              <Fingerprint size={18} className="text-emerald-400" />
              <span>{biometricStatus || (isTamil ? 'கைரேகை / Face ID சரிபார்ப்பு' : t('biometric_btn'))}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#D2C5B6] w-full"></div>
              <span className="bg-[#FAF6EE] px-2 text-[10px] text-[#7C746E] uppercase font-bold absolute">
                {isTamil ? 'அல்லது' : 'OR'}
              </span>
            </div>

            {/* PIN / Password Form */}
            <form onSubmit={handlePinAuth} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
                  {isTamil ? '4-இலக்க PIN ஐ உள்ளிடவும்' : t('or_enter_pin')}
                </label>
                <div className="relative flex items-center">
                  <KeyRound size={16} className="absolute left-3 text-[#7C746E]" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder={isTamil ? 'PIN (இயல்புநிலை: 1234)' : t('pin_placeholder')}
                    className="w-full bg-white border border-[#D2C5B6] rounded-xl py-2 pl-9 pr-3 text-xs text-center font-mono font-bold tracking-widest focus:outline-none focus:border-[#8C4A32]"
                    autoFocus
                  />
                </div>
                {pinError && (
                  <p className="text-[10px] text-rose-600 mt-1 font-semibold">{pinError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
              >
                {isTamil ? 'சரிபார்த்து திறக்கவும்' : t('unlock_now')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Persistent Bottom Delivery Navigation */}
      <DeliveryNavbar activeTab="payout" />

    </div>
  );
}
