import React from 'react';

export default function Bankings() {
  return (
    <div className="flex flex-col gap-4 py-6">
      <h2 className="text-xl font-bold text-stone-800">Earnings & Bankings</h2>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-stone-100 pb-4">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Available Payout</p>
            <h3 className="text-2xl font-extrabold text-[#8C4A32] mt-1"></h3>
          </div>
          <button 
            onClick={() => alert('Withdrawal request submitted successfully!')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            Withdraw Now
          </button>
        </div>
      </div>
    </div>
  );
}