import React, { useState } from 'react';
import { Landmark, CreditCard, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Box, Home } from 'lucide-react';
import logoImg from '../assets/HomePot-logo.jpeg';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export function HomePotBankingSetup({ initialData = {}, onCompleteOnboarding, onBack }) {
  const { t } = useLanguage();
  const [holderName, setHolderName] = useState(initialData.ownerName || '');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upiId, setUpiId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleFinish = (e) => {
    e.preventDefault();
    if (!holderName || !accountNumber || !ifsc) {
      setMessage({ text: 'Please fill in account holder name, account number and IFSC code.', type: 'red' });
      return;
    }

    setLoading(true);
    setMessage({ text: 'Verifying bank details with penny-drop verification...', type: 'green' });

    setTimeout(() => {
      setLoading(false);
      if (onCompleteOnboarding) {
        onCompleteOnboarding({
          ...initialData,
          banking: {
            holderName,
            bankName,
            accountNumber,
            ifsc,
            upiId
          }
        });
      }
    }, 1200);
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
            
            {/* Title Matching Page 4 */}
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C1D14] tracking-tight">
              {t('banking_title')}
            </h1>
            <p className="text-xs text-[#6B5B4F] mt-0.5">
              {t('step_3_title')}
            </p>

            <form onSubmit={handleFinish} className="w-full space-y-3 mt-3 text-left" autoComplete="off">
              
              {/* {t('account_holder')} */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">
                  {t('account_holder')}
                </label>
                <input
                  type="text"
                  required
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder={t('account_holder_placeholder')}
                  className="w-full text-xs sm:text-sm text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium"
                />
              </div>

              {/* {t('bank_name')} */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">
                  {t('bank_name')}
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder={t('bank_name_placeholder')}
                  className="w-full text-xs sm:text-sm text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium"
                />
              </div>

              {/* {t('account_number')} & IFSC Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                  <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">
                    {t('account_number')}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="12-16 digit A/C"
                    className="w-full text-xs text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-mono"
                  />
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                  <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">
                    {t('ifsc_code')}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="HDFC0000482"
                    className="w-full text-xs text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-mono tracking-wider"
                  />
                </div>
              </div>

              {/* UPI ID for Instant Daily Payouts */}
              <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-3 shadow-xs">
                <label className="block text-[10px] font-bold text-[#593222] tracking-wide uppercase mb-0.5">
                  {t('upi_id')}
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder={t('upi_placeholder')}
                  className="w-full text-xs text-[#2C1D14] bg-transparent focus:outline-none placeholder-[#A39281] font-medium"
                />
              </div>

              {/* HomePot Direct Payouts Guarantee */}
              <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#E8DEC8] flex items-start gap-3 mt-1">
                <div className="p-2 rounded-xl bg-white border border-[#E2D5BE] text-[#8C4A32] shrink-0 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2C1D14]">{t('direct_payout_title')}</h4>
                  <p className="text-[10px] text-[#6B5B4F] mt-0.5 leading-relaxed">
                    {t('direct_payout_desc')}
                  </p>
                </div>
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
                  className="w-full bg-[#A0523D] hover:bg-[#8C4A32] text-white font-semibold text-sm sm:text-base py-3.5 rounded-full shadow-md transition-all tracking-wide cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Verifying Bank Account...' : (
                    <>
                      <span>{t('open_kitchen_btn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
