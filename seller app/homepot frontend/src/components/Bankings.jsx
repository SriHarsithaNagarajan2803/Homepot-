import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function BankingPage() {
  const { t } = useLanguage();
  // Financial state initialized to zero
  const [balance, setBalance] = useState(0.00);
  const [totalEarnings, setTotalEarnings] = useState(0.00);
  const [pendingPayout, setPendingPayout] = useState(0.00);
  
  // Active payout method tab ('upi' or 'bank')
  const [payoutMethod, setPayoutMethod] = useState('upi');

  // Payout Destination States (initially empty)
  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifsc: '',
    holderName: ''
  });

  const [isEditingMethod, setIsEditingMethod] = useState(true); // Default to setup mode when empty
  const [tempUpi, setTempUpi] = useState('');
  const [tempBank, setTempBank] = useState({ accountNumber: '', ifsc: '', holderName: '' });

  // Verification & Payout states
  const [withdrawSuccess, setWithdrawSuccess] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Transaction history (starts empty)
  const [transactions, setTransactions] = useState([]);

  // Save UPI
  const handleSaveUpi = (e) => {
    e.preventDefault();
    if (!tempUpi) return;
    setUpiId(tempUpi);
    setIsEditingMethod(false);
  };

  // Save and Verify Bank Account with Real Bank Simulation
  const handleVerifyAndSaveBank = (e) => {
    e.preventDefault();
    if (!tempBank.accountNumber || !tempBank.ifsc || !tempBank.holderName) return;

    // Validate Indian Bank Account Number length (typically 9 to 18 digits)
    if (tempBank.accountNumber.length < 9 || tempBank.accountNumber.length > 18) {
      alert('Please enter a valid bank account number between 9 and 18 digits.');
      return;
    }

    setIsVerifying(true);
    // Simulate real bank server handshake & penny-drop verification
    setTimeout(() => {
      setBankDetails(tempBank);
      setIsVerifying(false);
      setIsEditingMethod(false);
      setWithdrawSuccess(`Bank account verified successfully with ${tempBank.ifsc.substring(0, 4)} Bank!`);
      setTimeout(() => setWithdrawSuccess(''), 4000);
    }, 1800);
  };

  // Instant Payout Trigger
  const handleWithdraw = () => {
    if (balance <= 0) return;
    setIsWithdrawing(true);

    const destination = payoutMethod === 'upi' ? `UPI (${upiId})` : `Bank A/C (*${bankDetails.accountNumber.slice(-4)})`;

    setTimeout(() => {
      const withdrawnAmount = balance;
      setBalance(0);
      setIsWithdrawing(false);
      setWithdrawSuccess(`Successfully transferred ₹${withdrawnAmount.toFixed(2)} to ${destination}!`);
      
      const newTxn = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: t('just_now'),
        desc: `Instant Payout to ${destination}`,
        amount: `-${withdrawnAmount.toFixed(2)}`,
        type: 'debit'
      };
      setTransactions([newTxn, ...transactions]);

      setTimeout(() => setWithdrawSuccess(''), 4000);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-4 pb-6 animate-fadeIn font-sans antialiased text-stone-800">
      
      {/* HEADER CARD: Total Balance & Instant Withdraw */}
      <div className="bg-gradient-to-br from-[#8C4A32] via-[#783D29] to-[#5c3020] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>

        <div className="flex justify-between items-start">
          <div>
            <span className="text-orange-200 text-xs font-bold uppercase tracking-wider block">{t('available_balance')}</span>
            <h2 className="text-3xl font-serif font-bold mt-1 tracking-tight">₹{balance.toFixed(2)}</h2>
          </div>
          <span className="bg-white/10 text-orange-100 px-3 py-1 rounded-xl text-[10px] font-bold tracking-wider uppercase border border-white/10">
            {t('secure_payouts')}
          </span>
        </div>

        {withdrawSuccess && (
          <div className="mt-4 bg-emerald-500/95 text-white text-xs p-3 rounded-2xl flex items-center gap-2 font-medium border border-emerald-400 shadow-sm">
            <i className="fa-solid fa-circle-check text-sm"></i>
            <span>{withdrawSuccess}</span>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-orange-200">{t('pending_settlement')}: <strong className="text-white">₹{pendingPayout.toFixed(2)}</strong></span>
            <span className="text-[10px] text-orange-300/80">{t('available_in_24h')}</span>
          </div>
          
          <button 
            onClick={handleWithdraw}
            disabled={balance <= 0 || isWithdrawing}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold tracking-wide transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
              balance > 0 
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-900 shadow-amber-500/20 active:scale-95' 
                : 'bg-stone-600 text-stone-400 cursor-not-allowed opacity-70'
            }`}
          >
            {isWithdrawing ? (
              <>
                <i className="fa-solid fa-spinner animate-spin text-xs"></i>
                <span>{t('transferring')}</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-bolt text-xs"></i>
                <span>{t('withdraw_instantly')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('total_earnings')}</span>
            <i className="fa-solid fa-wallet text-[#8C4A32] bg-orange-50 p-2 rounded-xl text-xs"></i>
          </div>
          <div className="mt-3">
            <h3 className="text-base font-bold text-stone-900">₹{totalEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
            <p className="text-[10px] text-stone-400 font-medium mt-0.5">{t('lifetime_revenue')}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">{t('active_mode')}</span>
            <i className="fa-solid fa-shield-halved text-emerald-600 bg-emerald-50 p-2 rounded-xl text-xs"></i>
          </div>
          <div className="mt-3 truncate">
            <h3 className="text-xs font-bold text-stone-900 capitalize">
              {(payoutMethod === 'upi' && upiId) || (payoutMethod === 'bank' && bankDetails.accountNumber) ? t('linked') : t('not_linked')}
            </h3>
            <p className="text-[10px] text-stone-400 font-medium mt-0.5">
              {payoutMethod === 'upi' ? (upiId ? t('upi_active') : t('setup_required')) : (bankDetails.accountNumber ? t('bank_active') : t('setup_required'))}
            </p>
          </div>
        </div>
      </div>

      {/* PAYOUT METHOD SELECTOR & DETAILS CARD */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 font-serif">
            <i className="fa-solid fa-building-columns text-[#8C4A32]"></i> {t('payout_destination')}
          </h3>
          
          {/* Method Selector Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button 
              onClick={() => { setPayoutMethod('upi'); setIsEditingMethod(!upiId); }}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${payoutMethod === 'upi' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
            >
              {t('upi_id_tab')}
            </button>
            <button 
              onClick={() => { setPayoutMethod('bank'); setIsEditingMethod(!bankDetails.accountNumber); }}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${payoutMethod === 'bank' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
            >
              {t('bank_account_tab')}
            </button>
          </div>
        </div>

        {/* UPI VIEW */}
        {payoutMethod === 'upi' && (
          <div>
            {!isEditingMethod && upiId ? (
              <div className="flex items-center justify-between bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100/60 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#8C4A32] flex items-center justify-center font-bold shrink-0">
                    <i className="fa-solid fa-mobile-screen-button"></i>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">{t('primary_upi_id')}</span>
                    <p className="font-mono font-bold text-stone-900 text-xs mt-0.5 truncate">{upiId}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setTempUpi(upiId); setIsEditingMethod(true); }}
                  className="text-xs font-bold text-[#8C4A32] hover:underline cursor-pointer shrink-0 ml-2"
                >
                  {t('edit_upi')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveUpi} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">{t('enter_upi_id')}</label>
                  <input 
                    type="text" 
                    value={tempUpi} 
                    onChange={(e) => setTempUpi(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] font-mono text-xs"
                    required 
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-[#8C4A32] hover:bg-[#783D29] text-white py-2.5 rounded-xl font-bold transition cursor-pointer">{t('save_upi')}</button>
                  {upiId && (
                    <button type="button" onClick={() => setIsEditingMethod(false)} className="px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 py-2.5 rounded-xl font-bold cursor-pointer">{t('cancel')}</button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* BANK ACCOUNT VIEW */}
        {payoutMethod === 'bank' && (
          <div>
            {!isEditingMethod && bankDetails.accountNumber ? (
              <div className="flex items-center justify-between bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100/60 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                    <i className="fa-solid fa-bank"></i>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">{bankDetails.ifsc.substring(0, 4)} Bank</span>
                    <p className="font-mono font-bold text-stone-900 text-xs mt-0.5">A/C: ****{bankDetails.accountNumber.slice(-4)} | IFSC: {bankDetails.ifsc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setTempBank(bankDetails); setIsEditingMethod(true); }}
                  className="text-xs font-bold text-[#8C4A32] hover:underline cursor-pointer shrink-0 ml-2"
                >
                  {t('change_ac')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyAndSaveBank} className="flex flex-col gap-3 text-xs">
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-800 text-[11px] flex items-center gap-2">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>{t('penny_drop_note')}</span>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">{t('account_holder')}</label>
                  <input 
                    type="text" 
                    value={tempBank.holderName} 
                    onChange={(e) => setTempBank({ ...tempBank, holderName: e.target.value })}
                    placeholder={t('name_as_per_bank')}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32]"
                    required 
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-stone-700">{t('account_number')}</label>
                    <span className="text-[10px] text-stone-400">9–18 digits</span>
                  </div>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    pattern="\d{9,18}"
                    maxLength={18}
                    minLength={9}
                    value={tempBank.accountNumber} 
                    onChange={(e) => {
                      // Allow only numeric digits
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 18) {
                        setTempBank({ ...tempBank, accountNumber: val });
                      }
                    }}
                    placeholder={t('enter_ac_digits')}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] font-mono"
                    required 
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">{t('ifsc_code')}</label>
                  <input 
                    type="text" 
                    maxLength={11}
                    value={tempBank.ifsc} 
                    onChange={(e) => setTempBank({ ...tempBank, ifsc: e.target.value.toUpperCase() })}
                    placeholder="e.g. HDFC0001234"
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-[#8C4A32] font-mono uppercase"
                    required 
                  />
                </div>

                <div className="flex gap-2 mt-1">
                  <button 
                    type="submit" 
                    disabled={isVerifying}
                    className="flex-1 bg-[#8C4A32] hover:bg-[#783D29] text-white py-2.5 rounded-xl font-bold transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        <span>{t('verifying_bank')}</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-shield-check"></i>
                        <span>{t('verify_save_ac')}</span>
                      </>
                    )}
                  </button>
                  {bankDetails.accountNumber && (
                    <button type="button" onClick={() => setIsEditingMethod(false)} className="px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 py-2.5 rounded-xl font-bold cursor-pointer">{t('cancel')}</button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 font-serif">
            <i className="fa-solid fa-receipt text-stone-600"></i> {t('recent_payouts_orders')}
          </h3>
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            {t('last_30_days')}
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center text-stone-400">
            <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center mb-2 text-stone-300 text-lg">
              <i className="fa-solid fa-file-invoice"></i>
            </div>
            <p className="text-xs font-semibold text-stone-600">{t('no_transactions_yet')}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">{t('transactions_desc')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {transactions.map((txn) => (
              <div key={txn.id} className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-100/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${txn.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    <i className={`fa-solid ${txn.type === 'credit' ? 'fa-arrow-down-left' : 'fa-arrow-up-right'} text-xs`}></i>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-stone-900 text-xs truncate">{txn.desc}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{txn.id} • {txn.date}</p>
                  </div>
                </div>

                <div className={`font-mono font-bold text-xs shrink-0 ${txn.type === 'credit' ? 'text-emerald-600' : 'text-stone-700'}`}>
                  {txn.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}