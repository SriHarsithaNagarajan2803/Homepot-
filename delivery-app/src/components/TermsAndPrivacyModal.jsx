import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';

export default function TermsAndPrivacyModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' | 'privacy'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fadeIn">
      <div className="bg-[#FAF6EE] border border-[#EADBCC] rounded-3xl w-full max-w-md max-h-[85vh] shadow-2xl flex flex-col text-[#2C231E] overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EADBCC] flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8C4A32]/10 text-[#8C4A32] flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#8C4A32]">HomePot Terms & Privacy</h3>
              <p className="text-[10px] text-[#7C746E]">Delivery Partner & Platform Agreement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#EADBCC] flex items-center justify-center text-[#6C645E] hover:text-[#8C4A32] hover:bg-stone-50 transition cursor-pointer shadow-2xs"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EADBCC] bg-[#F4EDE2]/80 px-4 pt-2">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 pb-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'border-[#8C4A32] text-[#8C4A32]'
                : 'border-transparent text-[#7C746E] hover:text-[#2C231E]'
            }`}
          >
            <FileText size={14} />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 pb-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#8C4A32] text-[#8C4A32]'
                : 'border-transparent text-[#7C746E] hover:text-[#2C231E]'
            }`}
          >
            <Lock size={14} />
            <span>Privacy Policy</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-[#3D332A] flex-1">
          {activeTab === 'terms' ? (
            <>
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>1. Delivery Partner Eligibility</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  You must be at least 18 years of age and legally authorized to deliver in your operating city. Accurate vehicle registration is mandatory for motor vehicles (Petrol/Electric two-wheelers and cars). Bicycles and E-Cycles do not require a Driving License or registration.
                </p>
              </div>

              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>2. Food Safety & Tamper-Proof Packaging</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  All food prepared by home chefs is sealed in hygienic, tamper-evident containers. You must handle orders with care, maintain bag cleanliness, and never tamper with or break the packaging seal.
                </p>
              </div>

              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>3. Inclusive & Accessible Deliveries (PwD Support)</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  HomePot actively supports Persons with Disabilities (PwD). Differently-abled partners receive ground-floor handoff preferences at kitchen points and automatic delivery time buffers to ensure safe, comfortable delivery journeys.
                </p>
              </div>

              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>4. Mandatory Handover OTP</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  Deliveries are completed only after verifying the 4-digit Handover OTP provided directly by the customer upon doorstep delivery. Never mark an order as delivered without customer OTP confirmation.
                </p>
              </div>

              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>5. Payouts & Settlement</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  Earnings are settled directly into your verified Bank Account or UPI ID with 100% transparency and zero hidden deductions. Delivery partners retain 100% of customer tips.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <Lock size={14} className="text-amber-700" />
                  <span>1. Information We Collect</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  We collect your full name, verified phone number, email address, operating city, and payout credentials (Bank account / UPI ID) to process deliveries and disburse earnings securely.
                </p>
              </div>

              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <Lock size={14} className="text-amber-700" />
                  <span>2. Female Partner Privacy & Safety Protection</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  We prioritize partner privacy and security. Partner gender is strictly confidential and is NEVER displayed or labeled to customers on the tracking screen or receipts.
                </p>
              </div>

              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <Lock size={14} className="text-amber-700" />
                  <span>3. Location & GPS Data Usage</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  Live GPS location is accessed solely while fulfilling active delivery assignments to assist in navigation, route traffic calculation, and customer ETA reassurance. No background tracking occurs when you are offline.
                </p>
              </div>

              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <Lock size={14} className="text-amber-700" />
                  <span>4. Document Encryption (UDID / DL)</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  Uploaded driving licenses and UDID disability certificates are stored in private, encrypted cloud storage buckets protected by strict Row-Level Security (RLS) policies. Only authorized compliance staff may review them.
                </p>
              </div>

              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <Lock size={14} className="text-amber-700" />
                  <span>5. Data Rights & Support</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  You have the right to inspect, update, or request deletion of your personal data at any time by contacting our 24/7 HomePot Partner Helpline at 1800-HOMEPOT or emailing support@homepot.app.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-[#EADBCC] bg-white/70 flex justify-end">
          <button
            onClick={onClose}
            className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-2.5 px-5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
          >
            Understood & Close
          </button>
        </div>

      </div>
    </div>
  );
}
