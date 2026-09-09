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
  X
} from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import DeliveryNavbar from '../components/DeliveryNavbar';

export default function RiderProfile() {
  const navigate = useNavigate();

  // Modals
  const [showSOS, setShowSOS] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Preference toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of your rider session?')) {
      navigate('/login');
    }
  };

  return (
    <div className="relative min-h-[820px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] pb-24">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between px-5 pt-5 pb-2">
        <button
          onClick={() => navigate('/radar')}
          className="w-9 h-9 rounded-full bg-white/70 border border-[#EADBCC] flex items-center justify-center text-[#333C3E] hover:bg-white transition-colors"
          title="Back to Orders"
        >
          <ArrowLeft size={18} />
        </button>

        <HomepotLogo size="md" showText={false} />

        <button
          onClick={() => alert('Support line: 1800-HOMEPOT (Available 24/7)')}
          className="w-9 h-9 rounded-full bg-white/70 border border-[#EADBCC] flex items-center justify-center text-[#6C645E] hover:text-[#9C4A28] hover:bg-white transition-colors"
          title="Help & Support"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 sm:px-6 py-2 max-w-sm mx-auto w-full space-y-4">
        {/* Rider Profile Card Header */}
        <div className="flex flex-col items-center">
          {/* Avatar Icon */}
          <div className="w-20 h-20 rounded-full bg-[#505D61] text-white flex items-center justify-center shadow-md border-4 border-white">
            <User size={40} className="text-[#F3ECE0]" />
          </div>

          <h2 className="font-serif text-xl font-bold text-[#8B3A1C] mt-2">
            Kumar V.
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-[#6C645E] font-medium mt-0.5">
            <span className="text-[#D99436] font-bold">★ 4.8</span>
            <span>/</span>
            <span className="text-[#16A34A] font-semibold flex items-center gap-1">
              Verified
            </span>
          </div>
        </div>

        {/* Profile Options List (Matching page6.jpeg exactly) */}
        <div className="bg-[#FFFDF8] rounded-3xl border border-[#EADBCC] shadow-soft p-4 divide-y divide-[#F0E6D8] space-y-3">
          {/* 1. Account Details */}
          <div 
            onClick={() => alert('Vehicle: TVS Jupiter (KA-01-EQ-9876)\nPhone: +91 9876543210\nEmail: kumar.delivery@gmail.com')}
            className="pt-2 first:pt-0 cursor-pointer hover:bg-[#FAF6EE]/60 p-2 rounded-xl transition-colors"
          >
            <h4 className="font-serif font-bold text-sm text-[#8B3A1C]">Account Details:</h4>
            <p className="text-xs text-[#5C544E] mt-0.5">Phone, Email, Registered Vehicle</p>
          </div>

          {/* 2. Documents */}
          <div 
            onClick={() => setShowDocuments(true)}
            className="pt-3 cursor-pointer hover:bg-[#FAF6EE]/60 p-2 rounded-xl transition-colors"
          >
            <h4 className="font-serif font-bold text-sm text-[#8B3A1C]">Documents:</h4>
            <div className="flex items-center gap-6 mt-1.5 text-xs font-medium text-[#333C3E]">
              <div className="flex items-center gap-1.5">
                <span>Driving License</span>
                <CheckCircle2 size={16} className="text-[#16A34A] fill-[#16A34A]/20" />
              </div>
              <div className="flex items-center gap-1.5">
                <span>RC</span>
                <CheckCircle2 size={16} className="text-[#16A34A] fill-[#16A34A]/20" />
              </div>
            </div>
          </div>

          {/* 3. Preferences */}
          <div 
            onClick={() => setShowPreferences(true)}
            className="pt-3 flex items-center justify-between cursor-pointer hover:bg-[#FAF6EE]/60 p-2 rounded-xl transition-colors"
          >
            <div>
              <h4 className="font-serif font-bold text-sm text-[#8B3A1C]">Preferences:</h4>
              <p className="text-xs text-[#5C544E] mt-0.5">Language, Sound Settings</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FAF6EE] text-[#8B3A1C] flex items-center justify-center border border-[#EADBCC]">
              <Settings size={18} />
            </div>
          </div>

          {/* 4. Bank Details */}
          <div 
            onClick={() => setShowBankDetails(true)}
            className="pt-3 flex items-center justify-between cursor-pointer hover:bg-[#FAF6EE]/60 p-2 rounded-xl transition-colors"
          >
            <div>
              <h4 className="font-serif font-bold text-sm text-[#8B3A1C]">Bank Details:</h4>
              <p className="text-xs text-[#5C544E] mt-0.5 leading-snug">
                Payment methods<br />
                Bank Account, UPI ID
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FAF6EE] text-[#8B3A1C] flex items-center justify-center border border-[#EADBCC]">
              <Wallet size={18} />
            </div>
          </div>

          {/* 5. Support & SOS */}
          <div className="pt-3 flex items-center justify-between p-2">
            <div>
              <h4 className="font-serif font-bold text-sm text-[#8B3A1C]">Support:</h4>
              <p className="text-xs text-[#5C544E] mt-0.5">Contact Us,</p>
            </div>
            {/* SOS Red Button Badge */}
            <button
              onClick={() => setShowSOS(true)}
              className="bg-[#DC2626]/15 border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <ShieldAlert size={14} />
              <span>SOS Button</span>
            </button>
          </div>

          {/* 6. Terms of Service */}
          <div 
            onClick={() => setShowTerms(true)}
            className="pt-3 cursor-pointer hover:bg-[#FAF6EE]/60 p-2 rounded-xl transition-colors flex items-center justify-between"
          >
            <span className="font-serif font-bold text-sm text-[#333C3E]">Terms of Service</span>
            <ChevronRight size={16} className="text-[#8C847E]" />
          </div>

          {/* 7. Logout */}
          <div 
            onClick={handleLogout}
            className="pt-3 cursor-pointer hover:bg-red-50 p-2 rounded-xl transition-colors flex items-center justify-between text-[#DC2626]"
          >
            <span className="font-serif font-bold text-sm">Logout</span>
            <LogOut size={16} />
          </div>
        </div>

        {/* Legal text */}
        <p className="text-[#8C847E] text-[11px] text-center pt-1 leading-relaxed">
          Terms and Privacy under the terms and Privacy list below.
        </p>
      </div>

      {/* SOS Alert Modal */}
      {showSOS && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border-2 border-[#DC2626] space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#DC2626] flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#DC2626]">Emergency SOS</h3>
            <p className="text-xs text-[#6C645E]">
              Are you in an emergency situation? Triggering this will immediately share your live GPS coordinates with HomePot Emergency Response & the nearest local authority.
            </p>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  alert('Emergency signal sent! Support team has been dispatched to your GPS location.');
                  setShowSOS(false);
                }}
                className="w-full py-2.5 bg-[#DC2626] text-white rounded-full font-bold text-xs shadow-md"
              >
                CONFIRM SOS (CALL 112)
              </button>
              <button
                onClick={() => setShowSOS(false)}
                className="w-full py-2 bg-[#F3ECE0] text-[#333C3E] rounded-full text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-[#EADBCC] space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-[#333C3E]">Preferences</h3>
              <button onClick={() => setShowPreferences(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-[#F0E6D8]">
                <span>App Sound Alerts</span>
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-[#9C4A28]' : 'bg-[#C8BFB5]'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${soundEnabled ? 'right-1' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex justify-between items-center py-2">
                <span>App Language</span>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#FAF6EE] border border-[#EADBCC] rounded-lg px-2 py-1 text-xs"
                >
                  <option>English</option>
                  <option>Kannada</option>
                  <option>Hindi</option>
                  <option>Tamil</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowPreferences(false)}
              className="w-full py-2 bg-[#9C4A28] text-white rounded-full text-xs font-medium"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Bank Details Modal */}
      {showBankDetails && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-[#EADBCC] space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-[#333C3E]">Linked Bank Account</h3>
              <button onClick={() => setShowBankDetails(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="p-3 bg-[#FAF6EE] rounded-2xl border border-[#EADBCC] space-y-2 text-xs">
              <p><strong>Bank:</strong> HDFC Bank Ltd.</p>
              <p><strong>A/C No:</strong> *******4829</p>
              <p><strong>IFSC:</strong> HDFC0001234</p>
              <p><strong>UPI ID:</strong> kumar.v@okhdfcbank</p>
            </div>
            <button
              onClick={() => setShowBankDetails(false)}
              className="w-full py-2 bg-[#333C3E] text-white rounded-full text-xs font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocuments && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-[#EADBCC] space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-[#333C3E]">Verified Documents</h3>
              <button onClick={() => setShowDocuments(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-900">Driving License</p>
                  <p className="text-[10px] text-green-700">KA-05-20180029384</p>
                </div>
                <CheckCircle2 size={18} className="text-green-600" />
              </div>

              <div className="p-3 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-900">Vehicle Registration (RC)</p>
                  <p className="text-[10px] text-green-700">KA-01-EQ-9876</p>
                </div>
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
            </div>
            <button
              onClick={() => setShowDocuments(false)}
              className="w-full py-2 bg-[#333C3E] text-white rounded-full text-xs font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-[#EADBCC] space-y-3 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-[#333C3E]">Terms of Service</h3>
              <button onClick={() => setShowTerms(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="text-xs text-[#5C544E] space-y-2 leading-relaxed">
              <p>1. HomePot delivery partners are independent contractors connecting home kitchens to valued customers.</p>
              <p>2. Fresh hot food must be maintained in insulated containers during transit.</p>
              <p>3. Payouts are computed daily and deposited weekly on Mondays to the verified bank account.</p>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              className="w-full py-2 bg-[#9C4A28] text-white rounded-full text-xs font-medium"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar */}
      <DeliveryNavbar activeTab="profile" />
    </div>
  );
}
