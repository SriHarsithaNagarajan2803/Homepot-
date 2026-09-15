import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  HelpCircle, 
  User, 
  CheckCircle2, 
  Settings, 
  Wallet, 
  ShieldAlert, 
  FileText, 
  LogOut,
  ChevronRight,
  Phone,
  AlertTriangle,
  X,
  CreditCard
} from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import DeliveryNavbar from '../components/DeliveryNavbar';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function RiderProfile() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Load rider details from localStorage
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('homepot_rider_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: localStorage.getItem('homepot_rider_name') || 'Kumar V.',
      phone: localStorage.getItem('homepot_rider_phone') || '+91 98765 43210',
      email: localStorage.getItem('homepot_rider_email') || 'kumar.delivery@gmail.com',
      vehicle: 'Electric Scooter (TN 09 BX 4521)',
      bank: {
        accountNumber: '98765432101234',
        ifsc: 'HDFC0001234',
        upiId: 'kumar@okaxis'
      }
    };
  });

  // Modals
  const [showSOS, setShowSOS] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Bank Form States
  const [tempUpi, setTempUpi] = useState(profile.bank?.upiId || 'kumar@okaxis');
  const [tempAc, setTempAc] = useState(profile.bank?.accountNumber || '98765432101234');
  const [tempIfsc, setTempIfsc] = useState(profile.bank?.ifsc || 'HDFC0001234');

  const handleSaveBank = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      bank: {
        ...profile.bank,
        upiId: tempUpi,
        accountNumber: tempAc,
        ifsc: tempIfsc
      }
    };
    setProfile(updated);
    localStorage.setItem('homepot_rider_profile', JSON.stringify(updated));
    setShowBankModal(false);
    alert('Bank and UPI details updated successfully!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of your rider session?')) {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24 font-sans">
      {/* Top Header Bar matching Image 1 */}
      <div className="w-full flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => navigate('/radar')}
          className="w-9 h-9 rounded-full bg-white/80 border border-[#EADBCC] flex items-center justify-center text-[#333C3E] hover:bg-white transition-colors cursor-pointer"
          title="Back to Orders"
        >
          <ArrowLeft size={18} />
        </button>

        <HomepotLogo size="md" showText={false} />

        <button
          onClick={() => alert('Support helpline: 1800-HOMEPOT-HELP (Available 24/7)')}
          className="w-9 h-9 rounded-full bg-white/80 border border-[#EADBCC] flex items-center justify-center text-[#6C645E] hover:text-[#8C4A32] hover:bg-white transition-colors cursor-pointer"
          title="Help & Support"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* Main Content Area matching Image 1 */}
      <div className="flex-1 px-4 sm:px-6 py-2 max-w-sm mx-auto w-full space-y-4">
        
        {/* Rider Profile Card Header matching Image 1 */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#505D61] text-white flex items-center justify-center shadow-md border-4 border-white">
            <User size={40} className="text-[#F3ECE0]" />
          </div>

          <h2 className="font-serif text-xl font-bold text-[#8C4A32] mt-2">
            {profile.name}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-[#6C645E] font-medium mt-0.5">
            <span className="text-[#D99436] font-bold">★ 4.8</span>
            <span>/</span>
            <span className="text-[#16A34A] font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>Verified</span>
            </span>
          </div>
        </div>

        {/* Big White Rounded Card with Profile Sections matching Image 1 */}
        <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-5 shadow-sm space-y-4 text-xs text-[#333C3E]">
          
          {/* 1. Account Details matching Image 1 */}
          <div className="border-b border-[#EADBCC] pb-3">
            <h3 className="font-bold text-[#8C4A32] text-xs">
              {t('account_details')}
            </h3>
            <p className="text-[11px] text-[#6C645E] mt-0.5 font-medium">
              {profile.phone} • {profile.email}
            </p>
            <p className="text-[11px] text-[#7C746E] mt-0.5">
              Vehicle: {profile.vehicle || 'Electric Scooter (TN 09 BX 4521)'}
            </p>
          </div>

          {/* 2. Documents matching Image 1 */}
          <div 
            onClick={() => setShowDocumentsModal(true)}
            className="border-b border-[#EADBCC] pb-3 flex items-center justify-between cursor-pointer hover:opacity-80"
          >
            <div>
              <h3 className="font-bold text-[#8C4A32] text-xs">
                {t('documents')}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-[11px]">
                <span className="flex items-center gap-1 font-semibold text-[#16A34A]">
                  <span>{t('driving_license')}</span>
                  <CheckCircle2 size={13} />
                </span>
                <span className="flex items-center gap-1 font-semibold text-[#16A34A]">
                  <span>{t('rc_book')}</span>
                  <CheckCircle2 size={13} />
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#6C645E]" />
          </div>

          {/* 3. Preferences matching Image 1 */}
          <div className="border-b border-[#EADBCC] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#8C4A32] text-xs">
                {t('preferences')}
              </h3>
              <p className="text-[11px] text-[#6C645E] mt-0.5 font-medium">
                {t('preferences_sub')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector variant="pill" />
            </div>
          </div>

          {/* 4. Bank Details matching Image 1 */}
          <div 
            onClick={() => setShowBankModal(true)}
            className="border-b border-[#EADBCC] pb-3 flex items-center justify-between cursor-pointer hover:opacity-80"
          >
            <div>
              <h3 className="font-bold text-[#8C4A32] text-xs">
                {t('bank_details')}
              </h3>
              <p className="text-[11px] text-[#6C645E] mt-0.5 font-medium">
                A/C: ****{profile.bank?.accountNumber?.slice(-4) || '1234'} • UPI: {profile.bank?.upiId || 'kumar@okaxis'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-[#8C4A32]/10 text-[#8C4A32] flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>

          {/* 5. Support & SOS Button matching Image 1 */}
          <div className="border-b border-[#EADBCC] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#8C4A32] text-xs">
                {t('support')}
              </h3>
              <p className="text-[11px] text-[#6C645E] mt-0.5">
                {t('contact_us')} 1800-HOMEPOT
              </p>
            </div>

            {/* Red Pill SOS Button matching Image 1 */}
            <button
              onClick={() => setShowSOS(true)}
              className="bg-[#C85250]/15 text-[#B91C1C] border border-[#B91C1C]/40 px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#B91C1C] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
            >
              <AlertTriangle size={13} />
              <span>{t('sos_button')}</span>
            </button>
          </div>

          {/* 6. Terms of Service matching Image 1 */}
          <div 
            onClick={() => setShowTermsModal(true)}
            className="border-b border-[#EADBCC] pb-3 flex items-center justify-between cursor-pointer hover:text-[#8C4A32]"
          >
            <span className="font-bold text-xs text-[#333C3E]">{t('terms_of_service')}</span>
            <ChevronRight size={16} className="text-[#6C645E]" />
          </div>

          {/* 7. Logout matching Image 1 */}
          <div 
            onClick={handleLogout}
            className="pt-1 flex items-center justify-between cursor-pointer text-[#8C4A32] hover:text-rose-600 font-bold"
          >
            <span className="text-xs">{t('logout')}</span>
            <LogOut size={16} />
          </div>

        </div>

      </div>

      {/* SOS EMERGENCY MODAL */}
      {showSOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-white border-2 border-rose-300 rounded-3xl w-full max-w-xs shadow-2xl p-5 flex flex-col gap-4 text-[#2C231E]">
            <div className="flex justify-between items-center border-b border-rose-100 pb-2">
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <AlertTriangle size={20} />
                <h3>{t('sos_emergency_modal')}</h3>
              </div>
              <button 
                onClick={() => setShowSOS(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {t('sos_warning')}
            </p>

            <button
              onClick={() => {
                alert('🚨 EMERGENCY SOS BROADCASTED! GPS Coordinates sent to police control and HomePot emergency helpline.');
                setShowSOS(false);
              }}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-md cursor-pointer animate-pulse"
            >
              {t('trigger_sos')}
            </button>
          </div>
        </div>
      )}

      {/* BANK DETAILS MODAL */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-[#FAF6EE] border border-[#EADBCC] rounded-3xl w-full max-w-xs shadow-2xl p-5 flex flex-col gap-3 text-[#2C231E]">
            <div className="flex justify-between items-center border-b border-[#EADBCC] pb-2">
              <h3 className="font-serif font-bold text-sm text-[#8C4A32]">{t('bank_details')}</h3>
              <button onClick={() => setShowBankModal(false)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center cursor-pointer">
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveBank} className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-[#6C645E] block mb-1">UPI ID</label>
                <input
                  type="text"
                  required
                  value={tempUpi}
                  onChange={(e) => setTempUpi(e.target.value)}
                  className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#6C645E] block mb-1">{t('bank_account_number')}</label>
                <input
                  type="text"
                  required
                  value={tempAc}
                  onChange={(e) => setTempAc(e.target.value)}
                  className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#6C645E] block mb-1">{t('ifsc_code')}</label>
                <input
                  type="text"
                  required
                  value={tempIfsc}
                  onChange={(e) => setTempIfsc(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 font-mono uppercase text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8C4A32] text-white font-bold py-2.5 rounded-xl mt-2 cursor-pointer shadow-xs"
              >
                {t('save_changes')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENTS MODAL */}
      {showDocumentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="bg-[#FAF6EE] border border-[#EADBCC] rounded-3xl w-full max-w-xs shadow-2xl p-5 flex flex-col gap-3 text-[#2C231E]">
            <div className="flex justify-between items-center border-b border-[#EADBCC] pb-2">
              <h3 className="font-serif font-bold text-sm text-[#8C4A32]">{t('documents')}</h3>
              <button onClick={() => setShowDocumentsModal(false)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center cursor-pointer">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-white border border-[#EADBCC] p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C231E]">{t('driving_license')}</p>
                  <p className="text-[10px] text-[#7C746E]">DL-0420110012345</p>
                </div>
                <span className="text-emerald-700 bg-emerald-100 font-bold text-[10px] px-2 py-0.5 rounded-md">Verified ✓</span>
              </div>

              <div className="bg-white border border-[#EADBCC] p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2C231E]">{t('rc_book')}</p>
                  <p className="text-[10px] text-[#7C746E]">TN 09 BX 4521</p>
                </div>
                <span className="text-emerald-700 bg-emerald-100 font-bold text-[10px] px-2 py-0.5 rounded-md">Verified ✓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Navbar matching reference images */}
      <DeliveryNavbar activeTab="profile" />

      {/* Footer Notice matching reference images */}
      <div className="w-full text-center pb-2 pt-1">
        <p className="text-[10px] text-[#7C746E]">
          {t('terms_privacy_notice')}
        </p>
      </div>
    </div>
  );
}
