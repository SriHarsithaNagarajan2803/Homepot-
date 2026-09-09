import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, TrendingUp, Calendar, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import DeliveryNavbar from '../components/DeliveryNavbar';

export default function RiderPayout() {
  const navigate = useNavigate();

  const payouts = [
    {
      id: '#HP12345-6789',
      date: 'Today, 14:30',
      items: 'Dinner delivery (Rupa’s)',
      amount: '₹85.00',
      status: 'Paid',
      distance: '5.2 km'
    },
    {
      id: '#HP12345-6788',
      date: 'Today, 13:10',
      items: 'Lunch surge (Anitha’s)',
      amount: '₹115.00',
      status: 'Paid',
      distance: '6.8 km'
    },
    {
      id: '#HP12345-6780',
      date: 'Yesterday, 20:45',
      items: 'Dinner rush delivery',
      amount: '₹95.00',
      status: 'Paid',
      distance: '4.5 km'
    },
    {
      id: '#HP12345-6775',
      date: '24-Oct-2023',
      items: 'Weekly incentive reward',
      amount: '₹350.00',
      status: 'Paid',
      distance: 'Bonus'
    }
  ];

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between px-5 pt-5 pb-2">
        <button
          onClick={() => navigate('/radar')}
          className="w-9 h-9 rounded-full bg-white/70 border border-[#EADBCC] flex items-center justify-center text-[#333C3E] hover:bg-white transition-colors"
          title="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <HomepotLogo size="md" showText={false} />

        <div className="w-9 h-9"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 sm:px-6 py-2 max-w-sm mx-auto w-full space-y-4">
        {/* Earnings Summary Card */}
        <div className="bg-[#9C4A28] text-white rounded-3xl p-5 shadow-elevated relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[#F5E5DC] font-medium">Total Balance</p>
              <h2 className="font-serif text-3xl font-bold mt-1 tracking-tight">₹4,250.00</h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
              <Wallet size={20} className="text-[#FAF6EE]" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
            <div>
              <span className="text-[#F5E5DC] block text-[10px]">Today's Earnings</span>
              <span className="font-bold text-sm">₹650.00</span>
            </div>
            <div className="text-right">
              <span className="text-[#F5E5DC] block text-[10px]">Next Payout</span>
              <span className="font-bold text-sm">Monday, 10:00 AM</span>
            </div>
          </div>
        </div>

        {/* Milestone Goal Card */}
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#EADBCC] p-3.5 shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D99436]/15 text-[#D99436] flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#333C3E]">Weekly Milestone</span>
              <span className="text-[#9C4A28] font-bold">18 / 20 Orders</span>
            </div>
            <div className="w-full bg-[#EADBCC] h-2 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-[#9C4A28] h-full rounded-full" style={{ width: '90%' }}></div>
            </div>
            <p className="text-[10px] text-[#7C746E] mt-1">2 more deliveries to unlock ₹300 bonus!</p>
          </div>
        </div>

        {/* Recent Deliveries Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-serif font-bold text-sm text-[#333C3E]">Recent Deliveries</h3>
            <span className="text-xs text-[#9C4A28] font-semibold">View All</span>
          </div>

          <div className="space-y-2">
            {payouts.map((item, index) => (
              <div 
                key={index}
                className="bg-[#FFFDF8] rounded-2xl border border-[#EADBCC] p-3 shadow-soft flex items-center justify-between hover:border-[#9C4A28]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#EADBCC] flex items-center justify-center text-[#9C4A28]">
                    <ArrowDownRight size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#333C3E]">{item.id}</p>
                    <p className="text-[10px] text-[#7C746E]">{item.date} • {item.distance}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-[#16A34A]">{item.amount}</p>
                  <span className="inline-flex items-center gap-1 text-[9px] text-[#16A34A] font-semibold">
                    <CheckCircle2 size={10} /> {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation Bar */}
      <DeliveryNavbar activeTab="payout" />
    </div>
  );
}
