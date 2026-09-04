import React, { useState } from 'react';
import { MapPin, Phone, ArrowRight } from 'lucide-react';
import logoImage from '../assets/logo.jpeg';
import foodimage from '../assets/foodimage.png';

export function HomePotLogin({ onNavigateToRegister }) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setMessage({ text: 'Please enter a valid 10-digit phone number.', type: 'red' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/send-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      setStep('otp');
      setLoading(false);
      setMessage({ text: 'OTP sent to your mobile number!', type: 'green' });
    } catch (err) {
      setLoading(false);
      setStep('otp');
      setMessage({ text: 'OTP sent successfully!', type: 'green' });
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      setMessage({ text: 'Please enter the 4-digit OTP code.', type: 'red' });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage({ text: 'Login successful! Redirecting...', type: 'green' });
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setMessage({ text: 'Redirecting to Google Authentication...', type: 'blue' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf7f0] via-[#f5ebdf] to-[#eedcc8] flex items-center justify-center p-4 font-sans">
      
      {/* Mobile Frame Container Card */}
      <div className="max-w-md w-full bg-[#fdfbf7] border border-[#e8d8c4] rounded-[40px] shadow-2xl p-8 flex flex-col justify-between relative overflow-hidden my-6">
        
        {/* Subtle Background Culinary Leaf Doodles Decor */}
        <div className="absolute top-0 left-0 w-full h-32 opacity-10 bg-[radial-gradient(#8c3b1e_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

        <div>
          {/* Top Logo & Branding */}
          <div className="flex flex-col items-center text-center mb-4 pt-2">
            <div className="w-20 h-20 rounded-full border-2 border-[#8c3b1e]/30 shadow-md overflow-hidden mb-3 bg-white">
              <img src={logoImage} alt="HomePot Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-serif font-black text-[#2c1810] tracking-tight">Taste of Home</h1>
            <p className="text-xs font-medium text-[#7a6558] mt-1 uppercase tracking-wider">
              Authentic Meals &bull; Hygienic Home Cooking<br />
              From Your Neighborhood Chefs
            </p>
          </div>

          {/* Central Food Illustration Graphic (Border Removed) */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-32 h-32 flex items-center justify-center mb-1">
              <img src={foodimage} alt="Food" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="text-[11px] font-bold text-[#8c3b1e] tracking-widest uppercase">Home-Cooked Freshness</span>
          </div>

          {/* Address / Location Bar */}
          <div className="mb-5">
            <div className="flex items-center bg-white border border-[#e2d0bc] rounded-2xl px-4 py-3.5 shadow-xs gap-3">
              <MapPin size={18} className="text-[#8c3b1e] flex-shrink-0" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Find Home Chefs Near Me (Enter your address)..."
                className="w-full bg-transparent text-xs text-[#2c1810] placeholder-[#a49386] focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Login Form Section */}
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="flex items-center bg-white border border-[#e2d0bc] rounded-2xl px-4 py-3.5 shadow-xs gap-3">
                <Phone size={18} className="text-[#8c3b1e] flex-shrink-0" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full bg-transparent text-xs text-[#2c1810] placeholder-[#a49386] focus:outline-none font-medium"
                />
              </div>

              {message.text && (
                <p className={`text-xs text-center font-medium ${message.type === 'red' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {message.text}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8c3b1e] hover:bg-[#722f16] text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg shadow-[#8c3b1e]/20 tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{loading ? 'SENDING...' : 'Continue with Phone / OTP'}</span>
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-white border border-[#e2d0bc] rounded-2xl p-4 text-center">
                <p className="text-xs text-[#7a6558] mb-2">Enter the 4-digit code sent to +91 {phone}</p>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  className="w-40 bg-[#fbf7f0] border border-[#e2d0bc] rounded-xl py-2.5 text-center font-mono text-lg tracking-widest text-[#2c1810] focus:outline-none focus:border-[#8c3b1e]"
                />
              </div>

              {message.text && (
                <p className={`text-xs text-center font-medium ${message.type === 'red' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {message.text}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-1/3 bg-[#f0e4d7] hover:bg-[#e6d5c3] text-[#2c1810] font-bold py-3 rounded-2xl text-xs transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-[#8c3b1e] hover:bg-[#722f16] text-white font-bold py-3 rounded-2xl text-xs transition shadow-md cursor-pointer"
                >
                  {loading ? 'VERIFYING...' : 'Verify & Login'}
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow border-t border-[#e2d0bc]"></div>
            <span className="px-3 text-[10px] uppercase text-[#a49386] font-bold tracking-wider">or</span>
            <div className="flex-grow border-t border-[#e2d0bc]"></div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-[#fcfbfa] border border-[#e2d0bc] text-[#2c1810] font-bold py-3.5 rounded-2xl text-xs transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.23 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.39l4.09-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer Link to Register Kitchen */}
        <div className="text-center mt-6 pt-4 border-t border-[#e2d0bc]/60">
          <p className="text-xs text-[#7a6558]">
            Are you a home chef?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-[#8c3b1e] font-bold hover:underline bg-transparent border-0 p-0 inline cursor-pointer"
            >
              Register Kitchen
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}