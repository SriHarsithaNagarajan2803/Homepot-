import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, HelpCircle, X, Check } from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';

export default function RiderLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'login';

  // Step state: 'step2a' (Enter Details) | 'step2b' (Verify Phone OTP)
  const [step, setStep] = useState('step2a');

  // Form Fields
  const [fullName, setFullName] = useState('Kumar V.');
  const [email, setEmail] = useState('kumar.delivery@gmail.com');
  const [phone, setPhone] = useState('9876543210');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // OTP State (6 digits)
  const [otp, setOtp] = useState(['4', '8', '2', '', '', '']);
  const [timer, setTimer] = useState(30);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Help modal
  const [showHelp, setShowHelp] = useState(false);

  // OTP Timer countdown
  useEffect(() => {
    let interval;
    if (step === 'step2b' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // If pasted multiple digits
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(digits.length, 5);
      otpRefs[nextFocus]?.current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto advance focus
    if (value && index < 5) {
      otpRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone) {
      alert('Please enter your phone number');
      return;
    }
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }
    setStep('step2b');
    setTimer(30);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    // Simulate successful login / registration
    navigate('/radar');
  };

  return (
    <div className="relative min-h-[780px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E]">
      {/* Top Header Bar */}
      <div className="w-full relative z-20 flex items-center justify-between px-5 pt-5 pb-3">
        <button
          onClick={() => {
            if (step === 'step2b') {
              setStep('step2a');
            } else {
              navigate('/');
            }
          }}
          className="w-9 h-9 rounded-full bg-white/70 border border-[#EADBCC] flex items-center justify-center text-[#333C3E] hover:bg-white transition-colors"
          title="Go Back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          <HomepotLogo size="sm" showText={false} />
          <span className="font-serif text-lg font-bold text-[#333C3E] tracking-tight">Homepot</span>
        </div>

        <button
          onClick={() => setShowHelp(true)}
          className="w-9 h-9 rounded-full bg-white/70 border border-[#EADBCC] flex items-center justify-center text-[#6C645E] hover:text-[#9C4A28] hover:bg-white transition-colors"
          title="Help & Support"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* Decorative Wavy Layered Header Graphics (matching page_2_.jpeg) */}
      <div className="w-full overflow-hidden leading-none relative z-10 -mt-2">
        <svg
          viewBox="0 0 400 75"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20"
          fill="none"
        >
          {/* Deep slate / navy background ribbon */}
          <path
            d="M 0 35 C 100 10, 200 65, 400 25 L 400 0 L 0 0 Z"
            fill="#333C3E"
          />
          {/* Terracotta ribbon */}
          <path
            d="M 0 42 C 120 18, 220 75, 400 35 L 400 0 L 0 0 Z"
            fill="#9C4A28"
          />
          {/* Soft warm tan accent ribbon */}
          <path
            d="M 0 55 C 140 25, 250 85, 400 45 L 400 0 L 0 0 Z"
            fill="#D7A68E"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Main Content Form */}
      <div className="flex-1 px-6 pt-2 pb-6 max-w-sm mx-auto w-full flex flex-col justify-between relative z-20">
        {step === 'step2a' ? (
          /* STEP 2A: ENTER DETAILS */
          <form onSubmit={handleSendOtp} className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#8B3A1C] tracking-tight mt-1">
                Step 2A: Enter Details
              </h2>

              {/* Full Name Input */}
              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/90 border border-[#EADBCC] text-[#333C3E] placeholder-[#9C948E] text-sm focus:border-[#9C4A28] focus:bg-white transition-all shadow-sm"
                  required
                />
              </div>

              {/* Email ID Input */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email ID"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/90 border border-[#EADBCC] text-[#333C3E] placeholder-[#9C948E] text-sm focus:border-[#9C4A28] focus:bg-white transition-all shadow-sm"
                  required
                />
              </div>

              {/* Phone Number Input */}
              <div className="relative">
                <div className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-[#EADBCC] text-[#333C3E] focus-within:border-[#9C4A28] focus-within:bg-white transition-all shadow-sm">
                  <label className="block text-[11px] text-[#7C746E] font-medium leading-none mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-[#333C3E]">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="99XXXXXXXX"
                      maxLength={10}
                      className="w-full text-sm font-medium text-[#333C3E] bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-1 select-none">
                <div 
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    acceptedTerms ? 'bg-[#9C4A28] border-[#9C4A28] text-white' : 'border-[#C8BFB5] bg-white'
                  }`}
                >
                  {acceptedTerms && <Check size={14} strokeWidth={3} />}
                </div>
                <span className="text-xs text-[#5C544E] font-medium">I accept terms</span>
              </label>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 space-y-3">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#9C4A28] hover:bg-[#8B3A1C] active:scale-[0.98] text-white font-semibold text-sm tracking-wider uppercase shadow-md transition-all duration-200"
              >
                SEND OTP
              </button>

              <p className="text-[#8C847E] text-[11px] text-center leading-relaxed">
                Terms and Privacy under the terms and Privacy list below.
              </p>
            </div>
          </form>
        ) : (
          /* STEP 2B: VERIFY PHONE */
          <form onSubmit={handleVerify} className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#8B3A1C] tracking-tight mt-1">
                Step 2B: Verify Phone
              </h2>

              <p className="text-xs text-[#6C645E] leading-relaxed">
                Enter 6-digit OTP sent to <br />
                <span className="font-semibold text-[#333C3E]">+91 {phone ? `${phone.slice(0, 2)}XXXXXX${phone.slice(-2)}` : '98XXXXXX10'}</span>
              </p>

              {/* 6-Digit OTP Boxes */}
              <div className="flex items-center justify-between gap-2 pt-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl bg-white border border-[#EADBCC] text-center text-lg font-bold text-[#333C3E] focus:border-[#9C4A28] focus:ring-2 focus:ring-[#9C4A28]/20 transition-all shadow-sm"
                  />
                ))}
              </div>

              {/* Resend OTP Timer */}
              <div className="text-center pt-2">
                {timer > 0 ? (
                  <span className="text-xs text-[#7C746E]">
                    Resend OTP in <span className="font-semibold text-[#9C4A28]">({timer}s)</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTimer(30)}
                    className="text-xs font-semibold text-[#9C4A28] hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-6 space-y-3">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#9C4A28] hover:bg-[#8B3A1C] active:scale-[0.98] text-white font-semibold text-sm tracking-wider uppercase shadow-md transition-all duration-200"
              >
                VERIFY & PROCEED
              </button>

              <p className="text-[#8C847E] text-[11px] text-center leading-relaxed">
                Terms and Privacy under the terms and Privacy list below.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-[#EADBCC] space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-[#333C3E]">Need Help?</h3>
              <button onClick={() => setShowHelp(false)} className="text-[#7C746E] hover:text-black">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[#6C645E] leading-relaxed">
              Having trouble logging in or haven't received your OTP?
            </p>
            <div className="p-3 bg-[#FAF6EE] rounded-xl text-xs space-y-1 text-[#333C3E]">
              <p>📞 Rider Support: <strong>1800-HOMEPOT</strong></p>
              <p>💬 WhatsApp: <strong>+91 99001 23456</strong></p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2 bg-[#333C3E] text-white rounded-full text-xs font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
