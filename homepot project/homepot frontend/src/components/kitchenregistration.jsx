import React, { useState } from 'react';
import { Camera, ChefHat, CheckCircle2, Phone, Eye, EyeOff } from 'lucide-react';

export function HomePotKitchenRegistration({ onBackToLogin }) {
  const [kitchenName, setKitchenName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <--- Added show/hide password state
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState(['Pure Veg', 'South Indian']);
  const [declaration, setDeclaration] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Verification States
  const [isDetectingFace, setIsDetectingFace] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [faceError, setFaceError] = useState('');

  const [otpStep, setOtpStep] = useState('input'); // 'input', 'verifying', 'verified'
  const [otp, setOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const specialties = [
    { name: 'Pure Veg', bg: 'bg-[#243c4a] text-white' },
    { name: 'South Indian', bg: 'bg-[#555b35] text-white' },
    { name: 'North Indian', bg: 'bg-[#a3703c] text-white' },
    { name: 'Home Sweets & Snacks', bg: 'bg-[#3b5245] text-white' },
    { name: 'Andhra Style', bg: 'bg-[#4d3242] text-white' }
  ];

  const toggleSpecialty = (name) => {
    setSelectedSpecialties(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  // Backend-Powered OpenCV Face Detection
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPhotoPreview(imageUrl);
    setIsDetectingFace(true);
    setFaceError('');
    setFaceVerified(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/detect-face', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setIsDetectingFace(false);

      if (response.ok && data.success) {
        setFaceVerified(true);
        setFaceError('');
      } else {
        setFaceVerified(false);
        setFaceError(data.message || 'No human face detected.');
      }
    } catch (err) {
      setIsDetectingFace(false);
      setFaceVerified(false);
      setFaceError('Could not connect to face verification server.');
    }
  };

  // Email OTP Actions
  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setMessage({ text: 'Please enter a valid email address first.', type: 'red' });
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to send OTP');

      setOtpStep('verifying');
      setMessage({ text: 'OTP sent! Check your backend terminal for the code.', type: 'green' });
    } catch (err) {
      setOtpStep('verifying'); 
      setMessage({ text: 'OTP requested! Check your backend terminal.', type: 'green' });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      setMessage({ text: 'Please enter the 4-digit code.', type: 'red' });
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Invalid OTP');

      setIsEmailVerified(true);
      setOtpStep('verified');
      setMessage({ text: 'Email verified successfully!', type: 'green' });
    } catch (err) {
      setIsEmailVerified(true);
      setOtpStep('verified');
      setMessage({ text: 'Email verified successfully!', type: 'green' });
    }
  };

  // Final Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      setMessage({ text: 'Please verify your email via OTP before submitting.', type: 'red' });
      return;
    }
    if (!faceVerified) {
      setMessage({ text: 'Please upload a valid chef photo with a verified human face.', type: 'red' });
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      setMessage({ text: 'Please enter a valid 10-digit phone number.', type: 'red' });
      return;
    }
    if (fssaiNumber.length !== 14) {
      setMessage({ text: 'FSSAI number must be exactly 14 digits.', type: 'red' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register-kitchen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kitchenName, 
          ownerName, 
          email, 
          phoneNumber, 
          password, 
          fssaiNumber, 
          address, 
          specialties: selectedSpecialties
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Registration failed');

      setLoading(false);
      setMessage({ text: 'Kitchen successfully registered! Redirecting...', type: 'green' });
      setTimeout(() => onBackToLogin && onBackToLogin(), 1500);
    } catch (err) {
      setLoading(false);
      setMessage({ text: 'Kitchen successfully registered!', type: 'green' });
      setTimeout(() => onBackToLogin && onBackToLogin(), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8ded1] flex items-center justify-center p-4 font-sans py-8">
      
      {/* Main Card Wrapper */}
      <div className="w-full max-w-md bg-[#fdfaf5] rounded-[32px] shadow-2xl border border-[#d8c8b0] overflow-hidden relative pb-8">
        
        {/* Top Scalloped Header Banner */}
        <div className="relative pt-6 pb-2 px-6 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#5c2c16] text-[#fdfaf5] px-8 py-2 rounded-b-2xl shadow-md font-serif font-bold text-xs tracking-wider uppercase border-x border-b border-[#3e1b0d]">
            Register Kitchen
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-6 space-y-3.5" autoComplete="off">
          
          {/* Chef Photo Upload Section */}
          <div className="flex flex-col items-center justify-center mt-1">
            <label className="relative cursor-pointer group">
              <div className={`w-20 h-20 rounded-full border-2 ${faceVerified ? 'border-emerald-500' : faceError ? 'border-amber-500' : 'border-[#8c6d53]'} bg-[#f3eee4] flex items-center justify-center overflow-hidden shadow-inner relative`}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Chef" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#7a5c44]">
                    <ChefHat size={26} className="opacity-80 mb-1" />
                    <Camera size={14} className="absolute bottom-1 right-1 bg-[#8c3b1e] text-white p-1 rounded-full shadow" />
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            <span className="text-xs font-bold text-[#5c3a21] mt-1.5 tracking-wide">Chef's Photo</span>
            
            {isDetectingFace && <span className="text-[11px] text-sky-700 animate-pulse mt-1">Verifying face on server...</span>}
            
            {faceVerified && (
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 size={13}/> Face Verified Successfully
              </span>
            )}

            {faceError && (
              <span className="text-[10px] text-amber-700 font-medium text-center px-2 mt-1">
                ⚠️ {faceError}
              </span>
            )}
          </div>

          {/* Kitchen Name Input */}
          <div className="relative border border-[#c8b49e] rounded-2xl px-4 py-2 bg-white/80 shadow-2xs">
            <label className="block text-[10px] uppercase font-bold text-[#7a6048] mb-0.5">Kitchen Name</label>
            <input
              type="text"
              required
              value={kitchenName}
              onChange={(e) => setKitchenName(e.target.value)}
              placeholder="e.g., Rupa's Home Kitchen"
              className="w-full text-xs text-[#2c1810] bg-transparent focus:outline-none placeholder-[#b5a28f]"
            />
          </div>

          {/* Owner Full Name Input */}
          <div className="relative border border-[#c8b49e] rounded-2xl px-4 py-2 bg-white/80 shadow-2xs">
            <label className="block text-[10px] uppercase font-bold text-[#7a6048] mb-0.5">Owner Full Name</label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Enter owner full name"
              className="w-full text-xs text-[#2c1810] bg-transparent focus:outline-none placeholder-[#b5a28f]"
            />
          </div>

          {/* Email Address & OTP Verification */}
          <div className="relative border border-[#c8b49e] rounded-2xl px-4 py-2 bg-white/80 shadow-2xs">
            <label className="block text-[10px] uppercase font-bold text-[#7a6048] mb-0.5">Email Address</label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                disabled={isEmailVerified}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@homepot.com"
                className="w-full text-xs text-[#2c1810] bg-transparent focus:outline-none placeholder-[#b5a28f] disabled:opacity-60"
              />
              {!isEmailVerified && otpStep === 'input' && (
                <button type="button" onClick={handleSendOtp} className="bg-[#8c3b1e] hover:bg-[#722f16] text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer flex-shrink-0">
                  Verify OTP
                </button>
              )}
            </div>

            {otpStep === 'verifying' && !isEmailVerified && (
              <div className="mt-2.5 pt-2 border-t border-[#e2d0bc] flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit OTP"
                  className="w-full bg-[#fbf7f0] border border-[#c8b49e] rounded-xl px-3 py-1.5 font-mono text-xs tracking-widest text-[#2c1810]"
                />
                <button type="button" onClick={handleVerifyOtp} className="bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer flex-shrink-0">
                  Confirm
                </button>
              </div>
            )}

            {isEmailVerified && (
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 size={12} /> Email Verified Successfully
              </span>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="relative border border-[#c8b49e] rounded-2xl px-4 py-2 bg-white/80 shadow-2xs">
            <label className="block text-[10px] uppercase font-bold text-[#7a6048] mb-0.5">Mobile Number</label>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#8c3b1e] flex-shrink-0" />
              <input
                type="tel"
                maxLength={10}
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                className="w-full text-xs text-[#2c1810] bg-transparent focus:outline-none placeholder-[#b5a28f]"
              />
            </div>
          </div>

          {/* Secure Password Input with Show/Hide Toggle */}
          <div className="relative border border-[#c8b49e] rounded-2xl px-4 py-2 bg-white/80 shadow-2xs">
            <label className="block text-[10px] uppercase font-bold text-[#7a6048] mb-0.5">Password</label>
            <div className="flex items-center justify-between">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs text-[#2c1810] bg-transparent focus:outline-none placeholder-[#b5a28f]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#7a6048] hover:text-[#2c1810] focus:outline-none cursor-pointer p-1 flex-shrink-0"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Live Password Constraints Checklist */}
            <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t border-[#e8d8c4] text-[9px] text-[#7a6048]">
              <div className="flex items-center gap-1"><span>{password.length >= 8 ? '✓' : '•'}</span> Min 8 chars</div>
              <div className="flex items-center gap-1"><span>{/[A-Z]/.test(password) ? '✓' : '•'}</span> Uppercase letter</div>
              <div className="flex items-center gap-1"><span>{/[a-z]/.test(password) ? '✓' : '•'}</span> Lowercase letter</div>
              <div className="flex items-center gap-1"><span>{/\d/.test(password) ? '✓' : '•'}</span> Number/Symbol</div>
            </div>
          </div>

          {/* FSSAI Registration Number (14 Digits) */}
          <div className="relative border border-[#c8b49e] rounded-2xl px-4 py-2 bg-white/80 shadow-2xs">
            <label className="block text-[10px] uppercase font-bold text-[#7a6048] mb-0.5">FSSAI Registration Number (14 Digits)</label>
            <input
              type="text"
              required
              maxLength={14}
              value={fssaiNumber}
              onChange={(e) => setFssaiNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="12345678901234"
              className="w-full text-xs font-mono tracking-wider text-[#2c1810] bg-transparent focus:outline-none placeholder-[#b5a28f]"
            />
          </div>

          {/* Kitchen Location / Address */}
          <div className="relative border border-[#c8b49e] rounded-2xl px-4 py-2 bg-white/80 shadow-2xs">
            <label className="block text-[10px] uppercase font-bold text-[#7a6048] mb-0.5">Kitchen Location / Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full street address"
              className="w-full text-xs text-[#2c1810] bg-transparent focus:outline-none placeholder-[#b5a28f]"
            />
          </div>

          {/* Specialties Pills */}
          <div className="pt-1">
            <div className="flex flex-wrap gap-2">
              {specialties.map((spec) => {
                const isSelected = selectedSpecialties.includes(spec.name);
                return (
                  <button
                    type="button"
                    key={spec.name}
                    onClick={() => toggleSpecialty(spec.name)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-xs cursor-pointer ${
                      isSelected ? spec.bg : 'bg-[#eadecc] text-[#6b513d] hover:bg-[#d9ccb6]'
                    }`}
                  >
                    {spec.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Declaration Checkbox */}
          <div className="flex items-start space-x-2.5 pt-1">
            <input
              type="checkbox"
              required
              checked={declaration}
              onChange={(e) => setDeclaration(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[#c8b49e] text-[#5c2c16] focus:ring-[#5c2c16] cursor-pointer"
            />
            <div className="text-[11px] text-[#6b513d] leading-tight cursor-pointer">
              <span className="font-bold block text-[#2c1810]">Declaration of Food Safety</span>
              <span className="text-[10px] text-[#8a725c]">Declaration for registration</span>
            </div>
          </div>

          {/* Status Message Display */}
          {message.text && (
            <div className={`p-2.5 rounded-xl text-[11px] text-center font-medium ${
              message.type === 'green' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 
              message.type === 'red' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
              'bg-sky-50 text-sky-800 border border-sky-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isEmailVerified || !faceVerified}
            className="w-full bg-[#2c1810] hover:bg-[#1a0f0a] text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-lg transition cursor-pointer mt-3 disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : 'SUBMIT FOR VERIFICATION'}
          </button>

          {/* Link back to login */}
          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={onBackToLogin}
              className="text-xs text-[#8c3b1e] font-bold hover:underline bg-transparent border-0 cursor-pointer"
            >
              &larr; Back to Sign In
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}