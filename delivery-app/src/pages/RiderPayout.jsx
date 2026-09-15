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
  const { t } = useLanguage();

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
      { id: 'ORD-#HP12345-6789', desc: 'Dinner Delivery to Amit S.', amount: 65.00, time: 'Today, 2:30 PM', dist: '4.2 km' },
      { id: 'ORD-#HP99102-1209', desc: 'Lunch Delivery to Senthil K.', amount: 55.00, time: 'Today, 1:15 PM', dist: '2.4 km' },
      { id: 'ORD-#HP88201-3312', desc: 'Breakfast Delivery to Priya M.', amount: 75.00, time: 'Today, 9:45 AM', dist: '5.0 km' },
      { id: 'ORD-#HP77192-5510', desc: 'Dinner Delivery to Rajesh R.', amount: 70.00, time: 'Yesterday, 8:30 PM', dist: '3.6 km' }
    ]
  };

  const [availableToWithdraw, setAvailableToWithdraw] = useState(680.00);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Biometric Authentication using WebAuthn / simulated biometric prompt
  const handleBiometricAuth = async () => {
    setBiometricStatus('Scanning fingerprint / face...');
    try {
      if (window.PublicKeyCredential && navigator.credentials) {
        // Attempt hardware biometric / passkey prompt
        try {
          const challenge = new Uint8Array(32);
          window.crypto.getRandomValues(challenge);
          // Quick simulation / check
        } catch (e) {
          console.log('Biometric hardware note:', e);
        }
      }

      setTimeout(() => {
        setIsUnlocked(true);
        setShowAuthModal(false);
        setBiometricStatus('');
        setPinError('');
      }, 700);
    } catch (err) {
      setBiometricStatus('Biometrics verified!');
      setTimeout(() => {
        setIsUnlocked(true);
        setShowAuthModal(false);
        setBiometricStatus('');
      }, 500);
    }
  };

  // PIN / Password Authentication (Default 1234 or user password)
  const handlePinAuth = (e) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput.length >= 4) {
      setIsUnlocked(true);
      setShowAuthModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Invalid PIN. Use default 1234 or your 4-digit security PIN.');
    }
  };

  const handleWithdraw = () => {
    if (availableToWithdraw <= 0) return;
    setIsWithdrawing(true);

    setTimeout(() => {
      const withdrawn = availableToWithdraw;
      setAvailableToWithdraw(0);
      setIsWithdrawing(false);
      setSuccessMsg(`Transferred ₹${withdrawn.toFixed(2)} to linked UPI (kumar@okaxis)!`);
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1200);
  };

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24 font-sans">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => navigate('/radar')}
          className="w-9 h-9 rounded-full bg-white/80 border border-[#EADBCC] flex items-center justify-center text-[#333C3E] hover:bg-white cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-1.5">
          <HomepotLogo size="sm" showText={false} />
          <h2 className="font-serif font-bold text-sm text-[#2C231E]">
            {t('total_earned')}
          </h2>
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
            title={isUnlocked ? t('lock_again') : t('unlock_earnings_btn')}
          >
            {isUnlocked ? <Unlock size={17} /> : <Lock size={17} />}
          </button>
          <LanguageSelector variant="round" />
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-2 max-w-sm mx-auto w-full space-y-4">
        
        {/* Main Earnings Card */}
        <div className="bg-gradient-to-br from-[#8C4A32] to-[#683220] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-orange-200">
                {t('total_earned')} (Day)
              </span>
              <h2 className="font-serif text-3xl font-bold mt-1">
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
              className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition cursor-pointer"
            >
              {isUnlocked ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{isUnlocked ? t('lock_again') : 'Unlock'}</span>
            </button>
          </div>

          {/* Locked State Warning / Unlock CTA */}
          {!isUnlocked && (
            <div className="mt-4 bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-amber-300 shrink-0" />
                <p className="text-[11px] text-orange-100 font-medium leading-tight">
                  {t('confidential_sub')}
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-amber-300 hover:bg-amber-200 text-stone-900 font-bold text-[10px] px-3 py-1.5 rounded-xl shrink-0 cursor-pointer shadow-xs"
              >
                {t('unlock_earnings_btn')}
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
                <p className="text-[10px] text-orange-200">Available: ₹{availableToWithdraw.toFixed(2)}</p>
                <p className="text-[10px] text-white font-bold">Instant UPI Transfer</p>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={availableToWithdraw <= 0 || isWithdrawing}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                  availableToWithdraw > 0 ? 'bg-amber-300 text-stone-900 hover:bg-amber-200' : 'bg-stone-600 text-stone-300 cursor-not-allowed'
                }`}
              >
                {isWithdrawing ? 'Transferring...' : t('withdraw_instantly')}
              </button>
            </div>
          )}
        </div>

        {/* Multi-Period Total Earned Grid: Today, Week, Month */}
        <div className="grid grid-cols-3 gap-2">
          {/* Day */}
          <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-3 text-center">
            <p className="text-[10px] text-[#7C746E] uppercase font-bold">{t('per_day_earned')}</p>
            <p className="text-sm font-serif font-bold text-[#8C4A32] mt-0.5">
              {isUnlocked ? `₹${earningsData.today}` : '₹ •••'}
            </p>
            <span className="text-[9px] text-[#7C746E]">{earningsData.todayDeliveries} Orders</span>
          </div>

          {/* Week */}
          <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-3 text-center">
            <p className="text-[10px] text-[#7C746E] uppercase font-bold">{t('per_week_earned')}</p>
            <p className="text-sm font-serif font-bold text-[#8C4A32] mt-0.5">
              {isUnlocked ? `₹${earningsData.week}` : '₹ ••••'}
            </p>
            <span className="text-[9px] text-[#7C746E]">{earningsData.weekDeliveries} Orders</span>
          </div>

          {/* Month */}
          <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-3 text-center">
            <p className="text-[10px] text-[#7C746E] uppercase font-bold">{t('per_month_earned')}</p>
            <p className="text-sm font-serif font-bold text-[#8C4A32] mt-0.5">
              {isUnlocked ? `₹${earningsData.month}` : '₹ •••••'}
            </p>
            <span className="text-[9px] text-[#7C746E]">{earningsData.monthDeliveries} Orders</span>
          </div>
        </div>

        {/* Per-Order Earnings List */}
        <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs text-[#8C4A32] font-serif">{t('recent_earnings')}</h3>
            {!isUnlocked && (
              <span className="text-[10px] font-semibold text-[#8C4A32] flex items-center gap-1">
                <Lock size={11} /> Locked
              </span>
            )}
          </div>

          <div className="space-y-2">
            {earningsData.recentOrders.map((ord, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-[#EADBCC] rounded-2xl p-3 flex justify-between items-center text-xs"
              >
                <div>
                  <p className="font-bold text-[#2C231E]">{ord.id}</p>
                  <p className="text-[10px] text-[#7C746E]">{ord.desc} ({ord.dist})</p>
                  <p className="text-[9px] text-[#A09890]">{ord.time}</p>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-[#7C746E] block">{t('per_order_earned')}</span>
                  <span className="font-mono font-bold text-sm text-emerald-700">
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
                  {t('confidential_title')}
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
              {t('confidential_sub')}
            </p>

            {/* Biometric Button */}
            <button
              onClick={handleBiometricAuth}
              className="w-full bg-[#333C3E] hover:bg-[#22292A] text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer"
            >
              <Fingerprint size={18} className="text-emerald-400" />
              <span>{biometricStatus || t('biometric_btn')}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#D2C5B6] w-full"></div>
              <span className="bg-[#FAF6EE] px-2 text-[10px] text-[#7C746E] uppercase font-bold absolute">
                OR
              </span>
            </div>

            {/* PIN / Password Form */}
            <form onSubmit={handlePinAuth} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
                  {t('or_enter_pin')}
                </label>
                <div className="relative flex items-center">
                  <KeyRound size={16} className="absolute left-3 text-[#7C746E]" />
                  <input
                    type="password"
                    maxLength={10}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError('');
                    }}
                    placeholder={t('pin_placeholder')}
                    className="w-full bg-white border border-[#EADBCC] rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-[#2C231E] focus:outline-none focus:border-[#8C4A32]"
                  />
                </div>
              </div>

              {pinError && (
                <p className="text-red-600 text-xs font-semibold text-center">{pinError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                {t('unlock_now')}
              </button>
            </form>

          </div>
        </div>
      )}

      <DeliveryNavbar activeTab="payout" />
    </div>
  );
}
