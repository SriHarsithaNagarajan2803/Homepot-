import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, UtensilsCrossed, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-[#fff9f0] via-[#f7ebd8] to-[#edd6bc] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      
      {/* Background Decorative Blobs for Rich Market Vibe */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#8c3b1e]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#d97706]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#fffdfa]/90 backdrop-blur-md border border-[#e8d2bc] rounded-[36px] sm:rounded-[44px] shadow-[0_20px_60px_-15px_rgba(140,59,30,0.15)] p-6 sm:p-10 flex flex-col justify-between relative z-10 my-auto">
        
        <div>
          {/* Top Badge & Logo Branding */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8c3b1e]/10 text-[#8c3b1e] text-[11px] font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} />
              Home Chef Portal
            </div>

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-xl overflow-hidden mb-3 bg-white flex-shrink-0 ring-2 ring-[#8c3b1e]/20">
              <img src={logoImage} alt="HomePot Logo" className="w-full h-full object-cover" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#2c1810] tracking-tight">Taste of Home</h1>
            <p className="text-xs font-medium text-[#7a6558] mt-1.5 flex items-center justify-center gap-1.5">
              <UtensilsCrossed size={13} className="text-[#8c3b1e]" />
              Manage your kitchen, recipes & customer orders
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7a6558] ml-1">Email Address</label>
              <div className="flex items-center bg-white border border-[#e2d0bc] focus-within:border-[#8c3b1e] focus-within:ring-2 focus-within:ring-[#8c3b1e]/20 rounded-2xl px-4 py-3.5 shadow-xs transition gap-3">
                <Mail size={18} className="text-[#8c3b1e] flex-shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chef@homepot.com"
                  className="w-full bg-transparent text-sm text-[#2c1810] placeholder-[#a49386] focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7a6558] ml-1">Password</label>
              <div className="flex items-center bg-white border border-[#e2d0bc] focus-within:border-[#8c3b1e] focus-within:ring-2 focus-within:ring-[#8c3b1e]/20 rounded-2xl px-4 py-3.5 shadow-xs transition gap-3">
                <Lock size={18} className="text-[#8c3b1e] flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-[#2c1810] placeholder-[#a49386] focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#7a6558] hover:text-[#2c1810] focus:outline-none cursor-pointer flex-shrink-0 p-1 -mr-1 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {message.text && (
              <div className={`text-xs text-center font-semibold px-3 py-2 rounded-xl transition animate-fade-in ${message.type === 'red' ? 'text-rose-700 bg-rose-50 border border-rose-200' : 'text-emerald-800 bg-emerald-50 border border-emerald-200'}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#8c3b1e] to-[#722f16] hover:from-[#722f16] hover:to-[#5c2410] active:scale-[0.98] text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#8c3b1e]/25 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'VERIFYING CREDENTIALS...' : 'Sign In to Kitchen'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8 pt-5 border-t border-[#e2d0bc]/60">
          <p className="text-xs text-[#7a6558]">
            New home chef partner?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-[#8c3b1e] font-bold hover:underline bg-transparent border-0 p-0 inline cursor-pointer ml-0.5"
            >
              Register Your Kitchen
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}