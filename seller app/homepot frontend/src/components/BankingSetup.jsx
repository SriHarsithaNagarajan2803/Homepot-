import React, { useState } from 'react';
import { Building2, CreditCard, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import logoImg from '../assets/HomePot-logo.jpeg';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export function HomePotBankingSetup({ initialData = {}, onCompleteOnboarding, onBack }) {
  const { t } = useLanguage();
  const [accountHolder, setAccountHolder] = useState(initialData.ownerName || initialData.accountHolder || '');
  const [accountNumber, setAccountNumber] = useState(initialData.accountNumber || '');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(initialData.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(initialData.ifscCode || '');
  const [upiId, setUpiId] = useState(initialData.upiId || '');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Restrict Account Number: only digits, max 18 length
  const handleAccountNumberChange = (val, isConfirm = false) => {
    const digits = val.replace(/\D/g, '').slice(0, 18);
    if (isConfirm) {
      setConfirmAccountNumber(digits);
    } else {
      setAccountNumber(digits);
    }
  };

  const handleIfscChange = (val) => {
    // IFSC is typically 11 alphanumeric characters (e.g., SBIN0001234)
    const upperVal = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    setIfscCode(upperVal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountHolder || !accountNumber || !ifscCode) {
      setMessage({ text: 'Please fill in Account Holder Name, Account Number and IFSC Code.', type: 'red' });
      return;
    }
    if (accountNumber.length < 9) {
      setMessage({ text: 'Bank account number is too short (minimum 9 digits required).', type: 'red' });
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      setMessage({ text: 'Account numbers do not match. Please re-check.', type: 'red' });
      return;
    }
    if (ifscCode.length !== 11) {
      setMessage({ text: 'IFSC Code must be exactly 11 characters.', type: 'red' });
      return;
    }
    
    // UPI validation: checks that it contains '@' and has valid text/characters following it (e.g., @oksbi, @hdfc, @axis)
    const upiRegex = /^[\w.-]+@[a-zA-Z0-9.-]+$/;
    if (upiId && !upiRegex.test(upiId)) {
      setMessage({ text: 'Please enter a valid UPI ID (e.g., username@okaxis)', type: 'red' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    setTimeout(() => {
      setLoading(false);
      if (onCompleteOnboarding) {
        onCompleteOnboarding({
          ...initialData,
          accountHolder,
          accountNumber,
          ifscCode,
          upiId
        });
      }
    }, 700);
  };

  return (
    <div 
      className="min-h-screen w-full flex justify-center items-center py-4 px-2 sm:px-4"
      style={{ backgroundColor: '#EFE9DF', colorScheme: 'light' }}
    >
      {/* Mobile Card Frame */}
      <div 
        className="w-full max-w-md h-[92vh] max-h-[850px] border border-[#E8DEC8] rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative text-stone-900 pb-2"
        style={{ backgroundColor: '#FFFFFF', colorScheme: 'light' }}
      >
        
        {/* Soft Grey Dot Pattern Overlay */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#D6C7B2 1.2px, transparent 1.2px)',
            backgroundSize: '20px 20px'
          }}
        ></div>

        {/* Content Container */}
        <div className="flex flex-col justify-between h-full p-5 sm:p-6 relative z-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
          <div className="flex flex-col items-center text-center">
            <div className="w-full flex justify-end mb-1">
              <LanguageSelector variant="pill" />
            </div>
            
            {/* Top Logo Badge */}
            <div className="w-12 h-12 rounded-full bg-white border border-[#E2D5BE] shadow-xs flex items-center justify-center overflow-hidden mb-1">
              <img 
                src={logoImg} 
                alt="HomePot Logo" 
                className="w-full h-full object-cover mix-blend-multiply" 
              />
            </div>
            
            {/* Title */}
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C1D14] tracking-tight">
              {t('Bank Details') || 'Banking & Payouts'}
            </h1>
            <p className="text-xs text-[#6B5B4F] mt-0.5">
              {t('step_3_title') || 'Where should we send your daily earnings?'}
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-3 mt-3 text-left" autoComplete="off">
              
              {/* Account Holder Name */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">
                  {t('account_holder_name') || 'Account Holder Name'}
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8C4A32] shrink-0" />
                  <input
                    type="text"
                    required
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder={t('holder_name_placeholder') || 'As per bank passbook'}
                    className="w-full text-xs sm:text-sm text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium"
                  />
                </div>
              </div>

              {/* Bank Account Number */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">
                  {t('account_number') || 'Bank Account Number'} 
                </label>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#8C4A32] shrink-0" />
                  <input
                    type="text"
                    required
                    maxLength={18}
                    value={accountNumber}
                    onChange={(e) => handleAccountNumberChange(e.target.value, false)}
                    placeholder="Enter account number"
                    className="w-full text-xs sm:text-sm text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium tracking-wider"
                  />
                </div>
              </div>

              {/* Confirm Bank Account Number */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">
                  {t('confirm_account_number') || 'Re-enter Account Number'}
                </label>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#8C4A32] shrink-0" />
                  <input
                    type="text"
                    required
                    maxLength={18}
                    value={confirmAccountNumber}
                    onChange={(e) => handleAccountNumberChange(e.target.value, true)}
                    placeholder="Re-enter account number"
                    className="w-full text-xs sm:text-sm text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium tracking-wider"
                  />
                </div>
                {confirmAccountNumber && accountNumber === confirmAccountNumber && (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Account numbers match
                  </span>
                )}
              </div>

              {/* IFSC Code */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">
                  {t('ifsc_code') || 'IFSC Code'} 
                </label>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#8C4A32] shrink-0" />
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={ifscCode}
                    onChange={(e) => handleIfscChange(e.target.value)}
                    placeholder="e.g. SBIN0001234"
                    className="w-full text-xs sm:text-sm text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* UPI ID (Optional) */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">
                  {t('upi_id') || 'UPI ID'}
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. username@okaxis"
                  className="w-full text-xs sm:text-sm text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium"
                />
              </div>

              {/* Secure Escrow Protection Badge */}
              <div className="bg-[#FAF6F0] p-2.5 rounded-xl flex items-start gap-2 border border-[#E8DEC8]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[10px] text-[#6B5B4F] leading-tight">
                  <strong>Bank Grade Security:</strong> Payouts are processed securely via RBI-licensed partner escrow accounts directly to your verified bank account.
                </span>
              </div>

              {/* Status Message */}
              {message.text && (
                <div className={`p-2.5 rounded-xl text-xs text-center font-semibold ${
                  message.type === 'red' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#A0523D] hover:bg-[#8C4A32] text-white font-semibold text-sm sm:text-base py-3.5 rounded-full shadow-md transition-all tracking-wide cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? 'Completing Setup...' : <><span>{t('complete_registration') || 'Complete Setup & Launch'}</span> <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>

              {/* Link back */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-xs text-[#8C4A32] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  ← Back to Kitchen Details
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}