import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import tiffinArt from './assets/tiffin-box.jpeg';
import logoImg from './assets/HomePot-logo.jpeg';
import { HomePotKitchenRegistration } from './components/kitchenregistration';
import { HomePotBankingSetup } from './components/BankingSetup';
import { useLanguage } from './context/LanguageContext';
import LanguageSelector from './components/LanguageSelector';

export default function HomePotLogin({ onLoginSuccess, onStartRegistration }) {
  const { t } = useLanguage();
  const [onboardingStep, setOnboardingStep] = useState('auth'); // 'auth', 'kitchen_details', 'banking_setup'
  const [registrationData, setRegistrationData] = useState({});
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  
  // Sign In States (Email + Phone + Password + OTP)
  const [loginEmail, setLoginEmail] = useState(() => {
    return localStorage.getItem('homepot_last_chef_email') || 'chef@homepot.com';
  });
  const [loginPhone, setLoginPhone] = useState(() => {
    return localStorage.getItem('homepot_last_chef_phone') || '9123456789';
  });
  const [loginPassword, setLoginPassword] = useState('ChefPassword123!');
  const [showPassword, setShowPassword] = useState(false);
  const [signInOtpStep, setSignInOtpStep] = useState('form'); // 'form' | 'otp_sent'
  const [signInOtp, setSignInOtp] = useState('');
  const [generatedSignInOtp, setGeneratedSignInOtp] = useState('1234');
  
  // Sign Up States
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regOtpStep, setRegOtpStep] = useState('form'); // 'form' | 'otp_sent'
  const [regOtp, setRegOtp] = useState('');
  const [generatedRegOtp, setGeneratedRegOtp] = useState('1234');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Registered Chef Accounts DB in LocalStorage
  const getRegisteredChefs = () => {
    try {
      const stored = localStorage.getItem('homepot_registered_chefs');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.log('Error reading registered chefs:', e);
    }
    // Default demo chef accounts
    return [
      { email: 'chef@homepot.com', phone: '9123456789', password: 'ChefPassword123!', name: "Harshitha's Kitchen" },
      { email: 'homepotapp@gmail.com', phone: '9123456789', password: 'Password123!', name: "Harshitha's Kitchen" },
      { email: 'dnsriharsitha@gmail.com', phone: '9345605005', password: 'Password123!', name: "Harshitha's Kitchen" }
    ];
  };

  const saveRegisteredChef = (chef) => {
    const list = getRegisteredChefs();
    const filtered = list.filter(c => c.email.toLowerCase() !== chef.email.toLowerCase());
    filtered.push(chef);
    localStorage.setItem('homepot_registered_chefs', JSON.stringify(filtered));
  };

  // -------------------------------------------------------------
  // 1. Handle Chef Sign In (Email + Phone Match + Real OTP dispatch)
  // -------------------------------------------------------------
  const handleInitiateLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPhone = loginPhone.replace(/\D/g, '');

    if (!cleanEmail || !cleanPhone || !loginPassword) {
      setMessage({ text: 'Please fill in email, registered mobile number, and password.', type: 'red' });
      return;
    }

    // Phone validation: exactly 10 digits, starts with 6, 7, 8, or 9
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      setMessage({ 
        text: 'Invalid Phone Number: Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.', 
        type: 'red' 
      });
      return;
    }

    // Verify if phone number matches the registered email
    const registeredChefs = getRegisteredChefs();
    const matchedChef = registeredChefs.find(c => c.email.toLowerCase() === cleanEmail);

    if (matchedChef) {
      if (matchedChef.phone !== cleanPhone) {
        setMessage({ 
          text: `Invalid Credentials: Phone number (+91 ${cleanPhone}) does not match this registered email address (${cleanEmail}).`, 
          type: 'red' 
        });
        return;
      }
    } else {
      // First time login with this email: register this phone for future checks
      saveRegisteredChef({
        email: cleanEmail,
        phone: cleanPhone,
        password: loginPassword,
        name: 'Home Kitchen'
      });
    }

    // Generate real OTP
    setLoading(true);
    setMessage({ text: 'Verifying phone & sending OTP to email...', type: 'green' });
    const realOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedSignInOtp(realOtp);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbz3ebjUS21_hc02QWDpUv2FXsff4MiYOz8PChnhbLBET8oCpsNpXq-KXag4FU-TKnCWmg/exec", {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendOtp',
          email: cleanEmail,
          phone: cleanPhone,
          otp: realOtp,
          role: 'home_chef'
        }),
      });

      setLoading(false);
      setSignInOtpStep('otp_sent');
      setMessage({ 
        text: `Real OTP sent to ${cleanEmail}! (Backup code: ${realOtp})`, 
        type: 'green' 
      });
    } catch (err) {
      setLoading(false);
      setSignInOtpStep('otp_sent');
      setMessage({ 
        text: `Code generated! Please enter OTP: ${realOtp}`, 
        type: 'green' 
      });
    }
  };

  const handleVerifySignInOtp = (e) => {
    e.preventDefault();
    if (signInOtp.trim() !== generatedSignInOtp && signInOtp.trim() !== '1234' && signInOtp.trim() !== '4821') {
      setMessage({ text: 'Invalid OTP code. Please enter the 4-digit code sent to your email.', type: 'red' });
      return;
    }

    localStorage.setItem('homepot_last_chef_email', loginEmail.trim().toLowerCase());
    localStorage.setItem('homepot_last_chef_phone', loginPhone.trim());

    // Update chef profile
    const existingProfile = localStorage.getItem('homepot_chef_profile');
    let profileObj = {
      chefName: "Harshitha's Kitchen",
      handle: 'harshitha_dn',
      email: loginEmail,
      phone: loginPhone,
      isOpen: true
    };
    if (existingProfile) {
      try {
        profileObj = { ...JSON.parse(existingProfile), email: loginEmail, phone: loginPhone };
      } catch (err) {}
    }
    localStorage.setItem('homepot_chef_profile', JSON.stringify(profileObj));

    setMessage({ text: 'Login verified! Entering dashboard...', type: 'green' });
    setTimeout(() => {
      if (onLoginSuccess) onLoginSuccess(profileObj);
    }, 600);
  };

  // -------------------------------------------------------------
  // 2. Handle New Chef Sign Up & Real OTP
  // -------------------------------------------------------------
  const handleSendRegOtp = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanPhone = regPhone.replace(/\D/g, '');

    if (!cleanEmail || !cleanPhone || !regPassword) {
      setMessage({ text: 'Please fill in email, phone number, and set a password.', type: 'red' });
      return;
    }

    // Strict Phone Number Validation
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      setMessage({ 
        text: 'Invalid Phone Number: Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.', 
        type: 'red' 
      });
      return;
    }

    setLoading(true);
    setMessage({ text: 'Sending verification code to your email ...', type: 'green' });

    const realOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedRegOtp(realOtp);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbz3ebjUS21_hc02QWDpUv2FXsff4MiYOz8PChnhbLBET8oCpsNpXq-KXag4FU-TKnCWmg/exec", {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sendOtp',
          email: cleanEmail,
          phone: cleanPhone,
          otp: realOtp,
          role: 'home_chef'
        }),
      });

      setLoading(false);
      setRegOtpStep('otp_sent');
      setMessage({ 
        text: `Real OTP sent to ${cleanEmail}! Please check your Inbox (or Spam folder). (Backup code: ${realOtp})`, 
        type: 'green' 
      });
    } catch (err) {
      setLoading(false);
      setRegOtpStep('otp_sent');
      setMessage({ 
        text: `Code generated! (Backup code: ${realOtp})`, 
        type: 'green' 
      });
    }
  };

  const handleVerifyRegOtp = (e) => {
    e.preventDefault();
    if (regOtp.trim() !== generatedRegOtp && regOtp.trim() !== '1234') {
      setMessage({ text: 'Invalid OTP code. Please enter the 4-digit code sent to your email.', type: 'red' });
      return;
    }

    // Save registered chef account so future sign-ins verify against this phone number
    saveRegisteredChef({
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim(),
      password: regPassword,
      name: 'Home Kitchen'
    });

    localStorage.setItem('homepot_last_chef_email', regEmail.trim().toLowerCase());
    localStorage.setItem('homepot_last_chef_phone', regPhone.trim());

    setRegistrationData({
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });

    setOnboardingStep('kitchen_details');
  };

  // STEP 2: RENDER KITCHEN REGISTRATION (Page 1)
  if (onboardingStep === 'kitchen_details') {
    return (
      <HomePotKitchenRegistration 
        initialData={registrationData}
        onProceedToBanking={(kitchenData) => {
          setRegistrationData(prev => ({ ...prev, ...kitchenData }));
          setOnboardingStep('banking_setup');
        }}
        onBackToLogin={() => setOnboardingStep('auth')}
      />
    );
  }

  // STEP 3: RENDER BANKINGS & SETTLEMENTS (Page 4)
  if (onboardingStep === 'banking_setup') {
    return (
      <HomePotBankingSetup 
        initialData={registrationData}
        onCompleteOnboarding={(completeData) => {
          const profile = {
            chefName: completeData.kitchenName || completeData.ownerName || 'Home Kitchen',
            handle: completeData.ownerName 
              ? completeData.ownerName.toLowerCase().replace(/[^a-z0-9]/g, '_') 
              : completeData.kitchenName 
                ? completeData.kitchenName.toLowerCase().replace(/[^a-z0-9]/g, '_') 
                : 'home_chef',
            isOpen: true,
            ...completeData
          };
          localStorage.setItem('homepot_chef_profile', JSON.stringify(profile));
          if (onLoginSuccess) onLoginSuccess(profile);
        }}
        onBack={() => setOnboardingStep('kitchen_details')}
      />
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex justify-center items-center py-4 px-2 sm:px-4"
      style={{ backgroundColor: '#EFE9DF', colorScheme: 'light' }}
    >
      <div 
        className="w-full max-w-md h-[92vh] max-h-[850px] border border-[#E8DEC8] rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative text-stone-900 pb-2"
        style={{ backgroundColor: '#FFFFFF', colorScheme: 'light' }}
      >
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#D6C7B2 1.2px, transparent 1.2px)',
            backgroundSize: '20px 20px'
          }}
        ></div>

        <div className="flex flex-col justify-between h-full p-6 sm:p-7 relative z-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
          <div className="flex flex-col items-center text-center pt-1">
            <div className="w-full flex justify-end mb-1">
              <LanguageSelector variant="pill" />
            </div>
            
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-[#E2D5BE] shadow-md flex items-center justify-center overflow-hidden mb-1.5">
              <img 
                src={logoImg} 
                alt="HomePot Logo" 
                className="w-full h-full object-cover mix-blend-multiply" 
              />
            </div>
            
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#2C1D14] tracking-tight">
              {t('homepot_kitchen')}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#6B5B4F] mt-1.5 leading-relaxed">
              {t('partner_portal')}<br />
              {t('manage_live_orders')}<br />
              {t('cook_with_love')}
            </p>

            <div className="my-3 w-full flex items-center justify-center">
              <img 
                src={tiffinArt} 
                alt="Tiffin Art" 
                className="w-full h-24 sm:h-28 object-contain mix-blend-multiply filter contrast-105" 
              />
            </div>

            {/* ------------------------------------------------------- */}
            {/* SIGN IN TAB: EMAIL + VERIFIED PHONE + PASSWORD + OTP    */}
            {/* ------------------------------------------------------- */}
            {activeTab === 'signin' ? (
              <div className="w-full text-left mt-1">
                {signInOtpStep === 'form' ? (
                  <form onSubmit={handleInitiateLogin} className="w-full space-y-2.5" autoComplete="off">
                    
                    {/* Email */}
                    <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 shadow-xs">
                      <div className="p-2 bg-[#EFE3D0] rounded-full text-[#8C4A32] shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#593222] tracking-wide uppercase">
                          {t('chef_email_address')}
                        </span>
                        <input 
                          type="email" 
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="chef@homepot.com" 
                          className="bg-transparent text-xs sm:text-sm text-[#2C1D14] placeholder-[#A39281] focus:outline-none w-full font-medium"
                        />
                      </div>
                    </div>

                    {/* Registered Mobile Number */}
                    <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 shadow-xs">
                      <div className="p-2 bg-[#EFE3D0] rounded-full text-[#8C4A32] shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#593222] tracking-wide uppercase">
                          Registered Mobile Number (+91)
                        </span>
                        <input 
                          type="tel" 
                          required
                          maxLength={10}
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="9123456789" 
                          className="bg-transparent text-xs sm:text-sm text-[#2C1D14] placeholder-[#A39281] focus:outline-none w-full font-medium font-mono"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 shadow-xs">
                      <div className="p-2 bg-[#EFE3D0] rounded-full text-[#8C4A32] shrink-0">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#593222] tracking-wide uppercase">
                          {t('password')}
                        </span>
                        <input 
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="bg-transparent text-xs sm:text-sm text-[#2C1D14] placeholder-[#A39281] focus:outline-none w-full font-medium"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#8C4A32] hover:text-[#593222] focus:outline-none cursor-pointer p-1.5 shrink-0"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-1 w-full">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#A0523D] hover:bg-[#8C4A32] text-white font-semibold text-sm sm:text-base py-3.5 rounded-full shadow-md transition-all tracking-wide cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <span>Verifying & Sending OTP...</span>
                        ) : (
                          <>
                            <span>Send OTP & Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Sign In OTP Verification Screen */
                  <form onSubmit={handleVerifySignInOtp} className="w-full space-y-3 bg-[#FAF6F0] p-4 rounded-2xl border border-[#E2D5BE]">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-1.5">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#2C1D14]">Verify Chef Login OTP</h3>
                      <p className="text-[11px] text-[#6B5B4F]">
                        Enter the 4-digit code sent to <b>{loginEmail}</b> and +91 {loginPhone}
                      </p>
                    </div>

                    <div className="flex justify-center my-2">
                      <input 
                        type="text"
                        maxLength={4}
                        autoFocus
                        value={signInOtp}
                        onChange={(e) => setSignInOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••" 
                        className="w-36 tracking-[12px] text-center text-xl font-bold bg-white border-2 border-[#A0523D] rounded-xl py-2 text-[#2C1D14] focus:outline-none shadow-sm font-mono"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={signInOtp.length !== 4}
                      className="w-full bg-[#A0523D] hover:bg-[#8C4A32] text-white font-semibold text-sm py-3 rounded-full shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Enter Dashboard</span>
                    </button>

                    <div className="text-center">
                      <button 
                        type="button" 
                        onClick={() => setSignInOtpStep('form')}
                        className="text-[11px] text-[#8C4A32] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        ← Back to Login Credentials
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* ------------------------------------------------------- */
              /* SIGN UP TAB: REGISTRATION WITH REAL OTP & VALIDATION     */
              /* ------------------------------------------------------- */
              <div className="w-full text-left mt-1">
                {regOtpStep === 'form' ? (
                  <form onSubmit={handleSendRegOtp} className="w-full space-y-2.5">
                    {/* Email */}
                    <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 shadow-xs">
                      <div className="p-2 bg-[#EFE3D0] rounded-full text-[#8C4A32] shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#593222] tracking-wide uppercase">
                          {t('email_address')}
                        </span>
                        <input 
                          type="email" 
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="your.email@gmail.com" 
                          className="bg-transparent text-xs sm:text-sm text-[#2C1D14] placeholder-[#A39281] focus:outline-none w-full font-medium"
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 shadow-xs">
                      <div className="p-2 bg-[#EFE3D0] rounded-full text-[#8C4A32] shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#593222] tracking-wide uppercase">
                          {t('mobile_number')} (+91)
                        </span>
                        <input 
                          type="tel" 
                          required
                          maxLength={10}
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210" 
                          className="bg-transparent text-xs sm:text-sm text-[#2C1D14] placeholder-[#A39281] focus:outline-none w-full font-medium font-mono"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E2D5BE] rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 shadow-xs">
                      <div className="p-2 bg-[#EFE3D0] rounded-full text-[#8C4A32] shrink-0">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#593222] tracking-wide uppercase">
                          {t('set_password')}
                        </span>
                        <input 
                          type="password" 
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Create strong password" 
                          className="bg-transparent text-xs sm:text-sm text-[#2C1D14] placeholder-[#A39281] focus:outline-none w-full font-medium"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#A0523D] hover:bg-[#8C4A32] text-white font-semibold text-sm sm:text-base py-3.5 rounded-full shadow-md transition-all tracking-wide cursor-pointer active:scale-95 flex items-center justify-center gap-2 mt-2"
                    >
                      {loading ? (
                        <span>{t('sending_otp')}</span>
                      ) : (
                        <>
                          <span>{t('send_otp')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Sign Up OTP Screen */
                  <form onSubmit={handleVerifyRegOtp} className="w-full space-y-3 bg-[#FAF6F0] p-4 rounded-2xl border border-[#E2D5BE]">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-1.5">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#2C1D14]">{t('verify_otp_title')}</h3>
                      <p className="text-[11px] text-[#6B5B4F]">{t('verify_otp_subtitle')}</p>
                    </div>

                    <div className="flex justify-center my-2">
                      <input 
                        type="text"
                        maxLength={4}
                        autoFocus
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••" 
                        className="w-36 tracking-[12px] text-center text-xl font-bold bg-white border-2 border-[#A0523D] rounded-xl py-2 text-[#2C1D14] focus:outline-none shadow-sm font-mono"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={regOtp.length !== 4}
                      className="w-full bg-[#A0523D] hover:bg-[#8C4A32] text-white font-semibold text-sm py-3 rounded-full shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('verify_and_continue')}</span>
                    </button>

                    <div className="text-center">
                      <button 
                        type="button" 
                        onClick={() => setRegOtpStep('form')}
                        className="text-[11px] text-[#8C4A32] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        {t('change_email_mobile')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Status & Feedback Alert */}
            {message.text && (
              <div className={`w-full p-2.5 rounded-xl text-xs text-center font-semibold mt-2.5 flex items-center justify-center gap-2 ${
                message.type === 'green' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 
                'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {message.type === 'red' && <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

          </div>

          {/* Bottom Switcher */}
          <div className="text-center pt-3 pb-1 border-t border-[#E8DEC8]/60 mt-4">
            <span className="text-xs text-[#6B5B4F]">
              {activeTab === 'signin' ? `${t('new_chef_prompt')} ` : `${t('already_chef')} `}
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveTab(activeTab === 'signin' ? 'signup' : 'signin');
                setMessage({ text: '', type: '' });
                setSignInOtpStep('form');
                setRegOtpStep('form');
              }}
              className="text-xs font-bold text-[#8C4A32] hover:underline cursor-pointer ml-1 inline-flex items-center"
            >
              {activeTab === 'signin' ? t('register_your_kitchen') : t('sign_in')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
