import React, { useState } from 'react';
import { ChefHat, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Replace with your backend login endpoint when available
      // Example: const res = await fetch('http://127.0.0.1:8000/api/login', { ... })
      
      // Simulating successful login for frontend workflow testing
      setTimeout(() => {
        setLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess({ email: credentials.email, chefId: "mock-chef-id-123" });
        }
      }, 1000);

    } catch (err) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#FDFBF7] min-h-screen flex items-center justify-center p-6 font-sans">
      <div className="w-full bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden p-8">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8B4513] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ChefHat size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">HomePot Chef</h1>
          <p className="text-xs text-gray-500 mt-1">Sign in to manage your kitchen & orders</p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-800 border border-red-200 flex items-center gap-2 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                placeholder="chef@homepot.com"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm bg-[#FFFDF9]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </span>
              <input 
                type="password" 
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm bg-[#FFFDF9]"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B4513] text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-amber-900 transition tracking-wide text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing In...' : 'SIGN IN'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Link / Registration Prompt */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Don't have a kitchen registered?{' '}
            <span className="text-[#8B4513] font-bold cursor-pointer hover:underline">
              Register Kitchen
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}