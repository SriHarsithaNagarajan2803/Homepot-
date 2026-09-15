import React, { useState } from 'react';
import { ArrowLeft, Wallet, ArrowDownLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomepotLogo from '../components/HomepotLogo';
import DeliveryNavbar from '../components/DeliveryNavbar';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function RiderPayout() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [balance, setBalance] = useState(680.00);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [txns, setTxns] = useState([
    { id: 'TXN-8821', desc: 'Order Delivery #HP12345-6789', amount: '+₹65.00', date: 'Today, 2:30 PM' },
    { id: 'TXN-8819', desc: 'Eco-Tiffin Return Bonus', amount: '+₹20.00', date: 'Today, 2:30 PM' },
    { id: 'TXN-8762', desc: 'Order Delivery #HP99102-1209', amount: '+₹75.00', date: 'Today, 1:15 PM' }
  ]);

  const handleWithdraw = () => {
    if (balance <= 0) return;
    setIsWithdrawing(true);

    setTimeout(() => {
      const withdrawn = balance;
      setBalance(0);
      setIsWithdrawing(false);
      setSuccessMsg(`Successfully transferred ₹${withdrawn.toFixed(2)} directly to your linked UPI!`);

      setTxns((prev) => [
        { id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`, desc: 'Instant UPI Settlement', amount: `-₹${withdrawn.toFixed(2)}`, date: 'Just now' },
        ...prev
      ]);

      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1500);
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

        <HomepotLogo size="md" showText={false} />
        <LanguageSelector variant="round" />
      </div>

      <div className="flex-1 px-4 sm:px-6 py-2 max-w-sm mx-auto w-full space-y-4">
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-[#8C4A32] to-[#683220] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
          <span className="text-xs uppercase font-bold tracking-wider text-orange-200">
            {t('total_payout_balance')}
          </span>
          <h2 className="font-serif text-3xl font-bold mt-1">₹{balance.toFixed(2)}</h2>

          {successMsg && (
            <div className="mt-3 bg-emerald-500 text-white text-xs p-2.5 rounded-xl font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-orange-200">Instant UPI Direct Deposit</p>
              <p className="text-[10px] text-white font-bold">100% Commission-Free</p>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={balance <= 0 || isWithdrawing}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                balance > 0 ? 'bg-amber-300 text-stone-900 hover:bg-amber-200' : 'bg-stone-600 text-stone-300 cursor-not-allowed'
              }`}
            >
              {isWithdrawing ? 'Transferring...' : t('withdraw_instantly')}
            </button>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-3.5 text-center">
            <p className="text-[10px] text-[#7C746E] uppercase font-bold">{t('deliveries_completed')}</p>
            <p className="text-lg font-serif font-bold text-[#8C4A32] mt-0.5">12 Orders</p>
          </div>

          <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-3.5 text-center">
            <p className="text-[10px] text-[#7C746E] uppercase font-bold">{t('tiffin_bonuses_earned')}</p>
            <p className="text-lg font-serif font-bold text-emerald-700 mt-0.5">+₹60.00</p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-xs text-[#8C4A32] font-serif">{t('recent_payouts')}</h3>
          <div className="space-y-2">
            {txns.map((txn) => (
              <div key={txn.id} className="bg-white border border-[#EADBCC] rounded-2xl p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-[#2C231E]">{txn.desc}</p>
                  <p className="text-[10px] text-[#7C746E]">{txn.date}</p>
                </div>
                <span className={`font-mono font-bold ${txn.amount.startsWith('+') ? 'text-emerald-700' : 'text-[#8C4A32]'}`}>
                  {txn.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DeliveryNavbar activeTab="payout" />
    </div>
  );
}
