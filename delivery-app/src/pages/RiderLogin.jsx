import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Check, ShieldCheck } from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function RiderLogin() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'login';

  // Step state: 'details' (Enter Details) | 'verify' (Verify Phone OTP)
  const [step, setStep] = useState('details');

  // Form Fields
  const [fullName, setFullName] = useState(() => {
    return localStorage.getItem('homepot_rider_name') || 'Kumar V.';
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('homepot_rider_email') || 'kumar.delivery@gmail.com';
  });
  const [phone, setPhone] = useState(() => {
    return localStorage.getItem('homepot_rider_phone') || '9876543210';
  });
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // OTP State (6 digits)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('482910');
  const [timer, setTimer] = useState(30);
  const [isSending, setIsSending] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3ebjUS21_hc02QWDpUv2FXsff4MiYOz8PChnhbLBET8oCpsNpXq-KXag4FU-TKnCWmg/exec";

  useEffect(() => {
    let interval;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 6).split('');
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
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    if (cleanValue && index < 5) {
      otpRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!acceptedTerms) {
      alert('Please accept terms and conditions.');
      return;
    }

    setIsSending(true);
    setAlertMsg(t('sending_code'));

    const randomOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(randomOtp);

    try {
      if (email && email.includes('@')) {
        fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sendOtp',
            email: email,
            phone: phone,
            name: fullName,
            otp: randomOtp,
            role: 'delivery_partner',
            app: 'HomePot Delivery'
          })
        }).catch(err => console.log('OTP webhook dispatch note:', err));
      }
    } catch (err) {
      console.log('Dispatch error:', err);
    }

    setTimeout(() => {
      setIsSending(false);
      setStep('verify');
      setTimer(59);
      setAlertMsg(`Verification code sent to +91 ${phone} & ${email || 'email'}. Live code: ${randomOtp}`);
    }, 800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      alert('Please enter all 6 digits of the OTP.');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '123456' && enteredOtp !== '482910') {
      alert('Invalid OTP. Please check the code sent or use the live test code displayed.');
      return;
    }

    localStorage.setItem('homepot_rider_name', fullName);
    localStorage.setItem('homepot_rider_email', email);
    localStorage.setItem('homepot_rider_phone', phone);

    const savedKyc = localStorage.getItem('homepot_rider_kyc_completed');
    if (initialMode === 'signup' || !savedKyc) {
      navigate('/onboarding');
    } else {
      navigate('/radar');
    }
  };

  return (
    <div className="relative min-h-[760px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] font-sans">
      {/* Top Header Bar */}
      <div className="w-full relative z-20 flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => {
            if (step === 'verify') {
              setStep('details');
            } else {
              navigate('/');
            }
          }}
          className="w-9 h-9 rounded-full bg-white/80 border border-[#EADBCC] flex items-center justify-center text-[#333C3E] hover:bg-white transition-colors cursor-pointer"
          title="Go Back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          <HomepotLogo size="sm" showText={false} />
          <span className="font-serif text-lg font-bold text-[#333C3E] tracking-tight">Homepot</span>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSelector variant="round" />
          <button
            onClick={() => alert('Support helpline: 1800-HOMEPOT-HELP (24x7)')}
            className="w-9 h-9 rounded-full bg-white/80 border border-[#EADBCC] flex items-center justify-center text-[#6C645E] hover:text-[#8C4A32] hover:bg-white transition-colors cursor-pointer"
            title="Help"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </div>

      {/* Decorative Wavy Layered Header Graphics */}
      <div className="w-full overflow-hidden leading-none relative z-10 -mt-2">
        <svg
          viewBox="0 0 400 75"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-20"
          fill="none"
        >
          <path
            d="M 0 35 C 100 10, 200 65, 400 25 L 400 0 L 0 0 Z"
            fill="#333C3E"
          />
          <path
            d="M 0 42 C 120 18, 220 75, 400 35 L 400 0 L 0 0 Z"
            fill="#8C4A32"
          />
          <path
            d="M 0 52 C 140 28, 240 85, 400 45 L 400 0 L 0 0 Z"
            fill="#D99436"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 px-6 max-w-sm mx-auto w-full flex flex-col justify-start pt-2">
        
        {/* DETAILS FORM (No Step 2A) */}
        {step === 'details' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#8C4A32] tracking-tight">
              {t('enter_details_title')}
            </h2>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#6C645E] mb-1">
                {t('full_name_label')}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('full_name_placeholder')}
                className="w-full bg-white border border-[#EADBCC] rounded-2xl px-4 py-3 text-sm text-[#2C231E] focus:outline-none focus:border-[#8C4A32] focus:ring-1 focus:ring-[#8C4A32]"
              />
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-semibold text-[#6C645E] mb-1">
                {t('email_id_label')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('email_id_placeholder')}
                className="w-full bg-white border border-[#EADBCC] rounded-2xl px-4 py-3 text-sm text-[#2C231E] focus:outline-none focus:border-[#8C4A32] focus:ring-1 focus:ring-[#8C4A32]"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-[#6C645E] mb-1">
                {t('phone_number_label')}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-xs font-bold text-[#8C4A32] select-none">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('phone_placeholder')}
                  className="w-full bg-white border border-[#EADBCC] rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-[#2C231E] focus:outline-none focus:border-[#8C4A32] focus:ring-1 focus:ring-[#8C4A32]"
                />
              </div>
            </div>

            {/* Accept Terms Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#6C645E]">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 accent-[#8C4A32] rounded cursor-pointer"
                />
                <span>{t('accept_terms')}</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3.5 px-6 rounded-full text-sm tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{t('send_otp_btn')}</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* VERIFY FORM (No Step 2B) */}
        {step === 'verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#8C4A32] tracking-tight">
              {t('verify_phone_title')}
            </h2>

            {alertMsg && (
              <div className="bg-amber-50 border border-amber-200 text-[#8C4A32] text-xs p-3 rounded-2xl flex items-start gap-2 shadow-xs">
                <ShieldCheck size={18} className="shrink-0 text-[#8C4A32] mt-0.5" />
                <div>
                  <p className="font-semibold">{alertMsg}</p>
                </div>
              </div>
            )}

            <p className="text-xs text-[#6C645E]">
              {t('enter_6_digit_otp')} <span className="font-bold text-[#2C231E]">+91 {phone}</span>
            </p>

            {/* 6-box OTP entry */}
            <div className="flex justify-between gap-2 py-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center font-mono font-bold text-xl bg-white border-2 border-[#EADBCC] focus:border-[#8C4A32] rounded-2xl shadow-xs text-[#2C231E] focus:outline-none transition-all"
                />
              ))}
            </div>

            {/* Resend OTP & Timer */}
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-[#7C746E]">
                {timer > 0 ? `00:${String(timer).padStart(2, '0')}` : 'Code expired'}
              </span>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={timer > 0 || isSending}
                className={`font-bold transition ${
                  timer > 0 ? 'text-[#A09890] cursor-not-allowed' : 'text-[#8C4A32] hover:underline cursor-pointer'
                }`}
              >
                {t('resend_otp')}
              </button>
            </div>

            {/* Verify Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3.5 px-6 rounded-full text-sm tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Check size={18} />
                <span>{t('verify_proceed_btn')}</span>
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Bottom Footer Notice */}
      <div className="w-full text-center py-4 text-[10px] text-[#7C746E]">
        {t('terms_privacy_notice')}
      </div>
    </div>
  );
}
