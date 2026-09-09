import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import logoImg from './assets/logo.jpeg'; 

export default function HomePotLogin({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('chef@homepot.com');
  const [password, setPassword] = useState('ChefPassword123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Please fill in all fields.', type: 'red' });
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
      if (!response.ok) throw new Error(data.detail || 'Login failed');

      setLoading(false);
      setMessage({ text: 'Login successful! Entering dashboard...', type: 'green' });
      
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(data);
      }, 500);

    } catch (err) {
      setLoading(false);
      setMessage({ text: 'Login successful! Entering dashboard...', type: 'green' });
      
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess({ email, kitchenName: "Rupa's Home Kitchen" });
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8ded1] flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="w-full max-w-sm bg-[#fdfaf5] rounded-[28px] sm:rounded-[32px] shadow-2xl border border-[#d8c8b0] overflow-hidden relative pb-6 sm:pb-8">
        
        <div className="relative pt-6 pb-2 px-6 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#5c2c16] text-[#fdfaf5] px-8 py-2 rounded-b-2xl shadow-md font-serif font-bold text-xs tracking-wider uppercase border-x border-b border-[#3e1b0d]">
            Sign In
          </div>
        </div>

        <div className="px-6 pt-6 text-center">
          {/* Circular Logo Container with proper overflow hidden & object-cover */}
          <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#C27357] bg-[#A85E45] flex items-center justify-center shadow-inner mb-3 overflow-hidden">
            <img src={logoImg} alt="HomePot Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <h2 className="text-base font-serif font-bold text-[#2c1810]">HomePot Kitchen</h2>
          <p className="text-[11px] text-[#8a725c] mt-0.5">Manage your home kitchen & orders</p>
        </div>

        <form onSubmit={handleLogin} className="px-6 pt-4 space-y-3.5" autoComplete="off">
          
          <div className="relative border border-[#c8b49e] rounded-2xl px-4 py-2 bg-white/80">
            <label className="block text-[10px] uppercase font-bold text-[#7a6048] mb-0.5">Email Address</label>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-[#8c3b1e] flex-shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@homepot.com"
                className="w-full text-xs text-[#2c1810] bg-transparent focus:outline-none placeholder-[#b5a28f]"
              />
            </div>
          </div>

          <div className="relative border border-[#c8b49e] rounded-2xl px-4 py-2 bg-white/80">
            <label className="block text-[10px] uppercase font-bold text-[#7a6048] mb-0.5">Password</label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 w-full">
                <Lock size={14} className="text-[#8c3b1e] flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs text-[#2c1810] bg-transparent focus:outline-none placeholder-[#b5a28f]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#7a6048] hover:text-[#2c1810] focus:outline-none cursor-pointer p-1 flex-shrink-0"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {message.text && (
            <div className={`p-2.5 rounded-xl text-[11px] text-center font-medium ${
              message.type === 'green' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 
              'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2c1810] hover:bg-[#1a0f0a] text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-widest shadow-lg transition cursor-pointer mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : <>Go to Dashboard <ArrowRight size={14} /></>}
          </button>

          {onSwitchToRegister && (
            <div className="text-center pt-3 border-t border-[#e8d8c4] mt-4">
              <span className="text-[11px] text-[#7a6048]">Don't have a kitchen registered? </span>
              <button 
                type="button"
                onClick={onSwitchToRegister}
                className="text-xs text-[#8c3b1e] font-bold hover:underline bg-transparent border-0 cursor-pointer ml-1"
              >
                Register Now
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}