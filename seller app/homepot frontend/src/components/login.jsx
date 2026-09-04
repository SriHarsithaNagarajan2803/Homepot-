import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import logoImage from '../assets/logo.jpeg';

export function HomePotLogin({ onNavigateToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Please enter both email and password.', type: 'red' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Login successful! Redirecting...', type: 'green' });
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(data);
        }, 1000);
      } else {
        setMessage({ text: data.message || 'Invalid email or password.', type: 'red' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to connect to server. Please try again.', type: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf7f0] via-[#f5ebdf] to-[#eedcc8] flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-[#fdfbf7] border border-[#e8d8c4] rounded-[32px] sm:rounded-[40px] shadow-2xl p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden my-auto">
        
        <div>
          {/* Top Logo & Branding */}
          <div className="flex flex-col items-center text-center mb-6 pt-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#8c3b1e]/30 shadow-md overflow-hidden mb-2 bg-white flex-shrink-0">
              <img src={logoImage} alt="HomePot Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#2c1810] tracking-tight">Taste of Home</h1>
            <p className="text-[11px] sm:text-xs font-medium text-[#7a6558] mt-1 uppercase tracking-wider">
              Sign in with your email & password
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Input */}
            <div className="flex items-center bg-white border border-[#e2d0bc] rounded-2xl px-4 py-3 sm:py-3.5 shadow-xs gap-3">
              <Mail size={18} className="text-[#8c3b1e] flex-shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@homepot.com"
                className="w-full bg-transparent text-sm sm:text-xs text-[#2c1810] placeholder-[#a49386] focus:outline-none font-medium"
              />
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div className="flex items-center bg-white border border-[#e2d0bc] rounded-2xl px-4 py-3 sm:py-3.5 shadow-xs gap-3">
              <Lock size={18} className="text-[#8c3b1e] flex-shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm sm:text-xs text-[#2c1810] placeholder-[#a49386] focus:outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#7a6558] hover:text-[#2c1810] focus:outline-none cursor-pointer flex-shrink-0 p-1 -mr-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {message.text && (
              <p className={`text-xs text-center font-medium px-2 py-1 rounded-xl ${message.type === 'red' ? 'text-rose-600 bg-rose-50/50' : 'text-emerald-700 bg-emerald-50/50'}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8c3b1e] hover:bg-[#722f16] active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition shadow-lg shadow-[#8c3b1e]/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'VERIFYING...' : 'Sign In'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-4 border-t border-[#e2d0bc]/60">
          <p className="text-xs text-[#7a6558]">
            Are you a new home chef?{' '}
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