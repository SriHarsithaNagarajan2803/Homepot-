import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TermsAndPrivacyModal({ isOpen, onClose, onAccept }) {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' | 'privacy'

  if (!isOpen) return null;

  const handleAgreeAndClose = () => {
    if (onAccept) onAccept();
    onClose();
  };

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
              <h3 className="font-serif font-bold text-sm text-[#8C4A32]">
                {isTamil ? 'ஹோம்பாட் விதிமுறைகள் & தனியுரிமை' : 'HomePot Terms & Privacy'}
              </h3>
              <p className="text-[10px] text-[#7C746E]">
                {isTamil ? 'டெலிவரி பார்ட்னர் மற்றும் தளத்தின் வழிகாட்டுதல்கள்' : 'Delivery Partner & Platform Agreement'}
              </p>
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
            <span>{isTamil ? 'சேவை விதிமுறைகள்' : 'Terms of Service'}</span>
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
            <span>{isTamil ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-[#3D332A] flex-1">
          {activeTab === 'terms' ? (
            <>
              {/* 1 */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>{isTamil ? '1. டெலிவரி பார்ட்னர் தகுதி' : '1. Delivery Partner Eligibility'}</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  {isTamil 
                    ? 'நீங்கள் குறைந்தது 18 வயது நிரம்பியவராகவும், உங்கள் பகுதியில் டெலிவரி செய்ய சட்டப்பூர்வ அனுமதி பெற்றவராகவும் இருக்க வேண்டும். மோட்டார் வாகனங்களுக்கு (பெட்ரோல்/மின்சார இருசக்கர வாகனம் மற்றும் கார்) வாகன பதிவு எண் மற்றும் ஓட்டுநர் உரிமம் கட்டாயம். சைக்கிள் மற்றும் இ-சைக்கிளுக்கு ஓட்டுநர் உரிமம் தேவையில்லை.'
                    : 'You must be at least 18 years of age and legally authorized to deliver in your operating city. Accurate vehicle registration is mandatory for motor vehicles (Petrol/Electric two-wheelers and cars). Bicycles and E-Cycles do not require a Driving License or registration.'}
                </p>
              </div>

              {/* 2 */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>{isTamil ? '2. உணவு பாதுகாப்பு & சுகாதார பேக்கிங்' : '2. Food Safety & Tamper-Proof Packaging'}</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  {isTamil
                    ? 'அனைத்து உணவுகளும் வீட்டு சமையல்காரர்களால் சுகாதாரமான முறையில் சீல் செய்யப்பட்டு வழங்கப்படுகிறது. பார்சலை கவனமாகக் கையாள வேண்டும், பேக்கிங் முத்திரையை ஒருபோதும் உடைக்கவோ அல்லது சேதப்படுத்தவோ கூடாது.'
                    : 'All food prepared by home chefs is sealed in hygienic, tamper-evident containers. You must handle orders with care, maintain bag cleanliness, and never tamper with or break the packaging seal.'}
                </p>
              </div>

              {/* 3 */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>{isTamil ? '3. அனைவரையும் உள்ளடக்கிய சம வாய்ப்பு (மாற்றுத்திறனாளி ஆதரவு)' : '3. Inclusive & Accessible Deliveries (PwD Support)'}</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  {isTamil
                    ? 'ஹோம்பாட் மாற்றுத்திறனாளி ரைடர்களை மனமுவந்து ஆதரிக்கிறது. அவர்களுக்கு சமையலறைகளில் தரைத்தளத்தில் பார்சல் பெறும் முன்னுரிமையும், பாதுகாப்பான சவாரிக்கு கூடுதல் டெலிவரி நேரமும் தானாகவே ஒதுக்கப்படுகிறது.'
                    : 'HomePot actively supports Persons with Disabilities (PwD). Differently-abled partners receive ground-floor handoff preferences at kitchen points and automatic delivery time buffers to ensure safe, comfortable delivery journeys.'}
                </p>
              </div>

              {/* 4 */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>{isTamil ? '4. கட்டாய வாடிக்கையாளர் ஒப்படைப்பு OTP' : '4. Mandatory Handover OTP'}</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  {isTamil
                    ? 'வாடிக்கையாளரின் வாசலில் உணவை நேரில் ஒப்படைக்கும்போது அவர்களது ஆப்-இல் உள்ள 4-இலக்க OTP குறியீட்டை சரிபார்த்த பின்னரே டெலிவரியை முடிக்க வேண்டும். OTP பெறாமல் ஆர்டரை முடித்ததாகக் குறிக்கக்கூடாது.'
                    : 'Deliveries are completed only after verifying the 4-digit Handover OTP provided directly by the customer upon doorstep delivery. Never mark an order as delivered without customer OTP confirmation.'}
                </p>
              </div>

              {/* 5 */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>{isTamil ? '5. வருமானம் மற்றும் நேரடி தீர்வு' : '5. Payouts & Settlement'}</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  {isTamil
                    ? 'உங்கள் வருமானம் எவ்வித மறைமுகப் பிடித்தமும் இன்றி 100% வெளிப்படைத்தன்மையுடன் உங்கள் சரிபார்க்கப்பட்ட வங்கி கணக்கு அல்லது UPI ID-யில் தீர்வு செய்யப்படும். வாடிக்கையாளர் வழங்கும் டிப்ஸ் 100% உங்களுக்கே சேரும்.'
                    : 'Earnings are settled directly into your verified Bank Account or UPI ID with 100% transparency and zero hidden deductions. Delivery partners retain 100% of customer tips.'}
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Privacy 1 */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <Lock size={14} className="text-amber-700" />
                  <span>{isTamil ? '1. நாங்கள் சேகரிக்கும் தகவல்கள்' : '1. Information We Collect'}</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  {isTamil
                    ? 'டெலிவரிகளை ஒழுங்குபடுத்தவும் உங்கள் வருமானத்தை அனுப்பவும் உங்கள் பெயர், சரிபார்க்கப்பட்ட தொலைபேசி எண், மின்னஞ்சல், நகரம் மற்றும் வங்கி/UPI கணக்கு விவரங்கள் சேகரிக்கப்படுகின்றன.'
                    : 'We collect your full name, verified phone number, email address, operating city, and payout credentials (Bank account / UPI ID) to process deliveries and disburse earnings securely.'}
                </p>
              </div>

              {/* Privacy 2 */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <Lock size={14} className="text-amber-700" />
                  <span>{isTamil ? '2. பெண் பார்ட்னர் பாதுகாப்பு மற்றும் தனியுரிமை' : '2. Female Partner Privacy & Safety Protection'}</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  {isTamil
                    ? 'ரைடர்களின் பாதுகாப்பு எங்கள் முதன்மை நோக்கம். பெண் ரைடர்களின் பாலின விவரம் வாடிக்கையாளர்களுக்கு ஒருபோதும் காட்டப்படாது; அது முற்றிலும் ரகசியமாகப் பாதுகாக்கப்படும்.'
                    : 'We prioritize partner privacy and security. Partner gender is strictly confidential and is NEVER displayed or labeled to customers on the tracking screen or receipts.'}
                </p>
              </div>

              {/* Privacy 3 */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <Lock size={14} className="text-amber-700" />
                  <span>{isTamil ? '3. இருப்பிடம் மற்றும் GPS தரவுப் பயன்பாடு' : '3. Location & GPS Data Usage'}</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  {isTamil
                    ? 'செயலில் உள்ள டெலிவரியின் போது மட்டுமே வழிசெலுத்தல் மற்றும் வாடிக்கையாளர் நேரக் கணக்கீட்டிற்காக உங்கள் நேரடி GPS பயன்படுத்தப்படுகிறது. நீங்கள் ஆஃப்லைனில் இருக்கும்போது எந்த பின்னணி கண்காணிப்பும் செய்யப்படாது.'
                    : 'Live GPS location is accessed solely while fulfilling active delivery assignments to assist in navigation, route traffic calculation, and customer ETA reassurance. No background tracking occurs when you are offline.'}
                </p>
              </div>

              {/* Privacy 4 */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <Lock size={14} className="text-amber-700" />
                  <span>{isTamil ? '4. ஆவண மறைகுறியாக்க பாதுகாப்பு (UDID / உரிமம்)' : '4. Document Encryption (UDID / DL)'}</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  {isTamil
                    ? 'பதிவேற்றப்பட்ட ஓட்டுநர் உரிமம் மற்றும் UDID மாற்றுத்திறனாளி சான்றிதழ்கள் உயர்தர மறைகுறியாக்கத்துடன் (Encrypted) கிளவுடில் பாதுகாப்பாகச் சேமிக்கப்படுகின்றன.'
                    : 'Uploaded driving licenses and UDID disability certificates are stored in private, encrypted cloud storage buckets protected by strict Row-Level Security (RLS) policies. Only authorized compliance staff may review them.'}
                </p>
              </div>

              {/* Privacy 5 */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EADBCC] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#8C4A32] text-xs">
                  <Lock size={14} className="text-amber-700" />
                  <span>{isTamil ? '5. உரிமைகள் & 24/7 உதவி மையம்' : '5. Data Rights & Support'}</span>
                </div>
                <p className="text-[11px] text-[#6C645E]">
                  {isTamil
                    ? 'உங்கள் தகவல்களைப் புதுப்பிக்க அல்லது உதவி பெற எங்கள் ஹோம்பாட் உதவி மையத்தை 1800-HOMEPOT என்ற எண்ணில் எந்நேரமும் தொடர்பு கொள்ளலாம்.'
                    : 'You have the right to inspect, update, or request deletion of your personal data at any time by contacting our 24/7 HomePot Partner Helpline at 1800-HOMEPOT or emailing support@homepot.app.'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-[#EADBCC] bg-white/70 flex justify-end">
          <button
            onClick={handleAgreeAndClose}
            className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-2.5 px-5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
          >
            {isTamil ? 'படித்துப் புரிந்து கொண்டேன் (ஏற்கிறேன்) ✓' : 'I Understand & Accept Terms ✓'}
          </button>
        </div>

      </div>
    </div>
  );
}
