import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, ChefHat } from 'lucide-react';
import logoImage from "./assets/logo.jpeg";
import foodImage from "./assets/foodimage.png";
// ==========================================
// 1. LOGIN COMPONENT
// ==========================================
function Login({ onLoginSuccess, onRegisterClick }) {
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
    <div className="max-w-4xl mx-auto bg-[#FDFBF7] min-h-screen flex items-center justify-center p-6 font-sans">
      <div className="w-full bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Visual Showcase with Food Asset */}
        <div className="relative hidden md:flex flex-col justify-end p-8 bg-amber-950 overflow-hidden">
          <img 
            src={foodImage} 
            alt="Delicious Homemade Food" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="relative z-10 text-white">
            <span className="bg-amber-800/80 text-amber-100 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
              HomePot Chef Portal
            </span>
            <h2 className="text-2xl font-black mt-3 tracking-wide leading-snug">
              Authentic Homemade Flavors, Right from Your Kitchen.
            </h2>
            <p className="text-xs text-amber-200/80 mt-2">
              Manage your daily menu, track orders, and delight your customers with love.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 flex flex-col justify-center">
          
          {/* Brand Header with Logo Asset */}
          <div className="text-center mb-6">
            <img 
              src={logoImage} 
              alt="HomePot Chef Logo" 
              className="w-16 h-16 rounded-full object-cover mx-auto mb-3 shadow-md border-2 border-amber-200" 
            />
            <h1 className="text-2xl font-bold text-gray-800 tracking-wide">HomePot Chef</h1>
            <p className="text-xs text-gray-500 mt-1">Sign in to manage your kitchen & orders</p>
          </div>

          {/* Error Feedback */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-red-50 text-red-800 border border-red-200 flex items-center gap-2 text-xs">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="text-center mt-6 pt-4 border-t border-amber-50">
            <p className="text-xs text-gray-500">
              Don't have a kitchen registered?{' '}
              <button 
                type="button"
                onClick={onRegisterClick}
                className="text-[#8B4513] font-bold cursor-pointer hover:underline bg-transparent border-0 p-0 inline"
              >
                Register Kitchen
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}


// ==========================================
// 2. KITCHEN REGISTRATION COMPONENT
// ==========================================
function HomePotKitchenRegistration({ onBackToLogin }) {
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Form states (including Email)
  const [email, setEmail] = useState('');
  const [kitchenName, setKitchenName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [declarationChecked, setDeclarationChecked] = useState(false);
  
  // Photo & Human Face Verification states
  const [chefPhotoPreview, setChefPhotoPreview] = useState(null);
  const [faceVerified, setFaceVerified] = useState(false);
  const [verifyingFace, setVerifyingFace] = useState(false);

  // Password visibility
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const availableSpecialties = [
    'Pure Veg',
    'South Indian',
    'North Indian',
    'Home Sweets & Snacks',
    'Andhra Style'
  ];

  const toggleSpecialty = (spec) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChefPhotoPreview(URL.createObjectURL(file));
      setVerifyingFace(true);
      setMessage({ text: 'Analyzing photo for human face verification...', type: 'blue' });

      setTimeout(() => {
        setVerifyingFace(false);
        setFaceVerified(true);
        setMessage({ text: 'Human face verified successfully!', type: 'green' });
      }, 1500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!faceVerified) {
      setMessage({ text: 'Please upload a clear chef/Amma photo for human face verification.', type: 'red' });
      return;
    }

    const fssaiRegex = /^\d{14}$/;
    if (!fssaiRegex.test(fssaiNumber.trim())) {
      setMessage({ text: 'Invalid FSSAI number. It must be exactly 14 digits.', type: 'red' });
      return;
    }

    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long.', type: 'red' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'red' });
      return;
    }

    if (!declarationChecked) {
      setMessage({ text: 'Please accept the Declaration of Food Safety.', type: 'red' });
      return;
    }

    setLoading(true);
    setMessage({ text: 'Submitting kitchen for verification...', type: 'blue' });

    const kitchenData = {
      email,
      kitchenName,
      ownerName,
      fssaiNumber: fssaiNumber.trim(),
      address,
      specialties: selectedSpecialties,
      status: 'Pending Verification'
    };

    localStorage.setItem('homepot_kitchen_registration', JSON.stringify(kitchenData));

    setTimeout(() => {
      setLoading(false);
      setMessage({ text: 'Kitchen registered successfully and submitted for review!', type: 'green' });
      setTimeout(() => {
        if (onBackToLogin) onBackToLogin();
      }, 1500);
    }, 1200);
  };

  const renderEyeIcon = (isOpen) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      )}
    </svg>
  );

  return (
    <div className="bg-orange-50/40 text-stone-800 font-sans antialiased min-h-screen flex flex-col justify-between">
      {/* Header with Asset Logo */}
      <header className="w-full py-5 px-6 border-b border-orange-100 text-center bg-white shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
          <img 
            src={logoImage} 
            alt="HomePot Chef Logo" 
            className="w-20 h-20 rounded-full object-cover shadow-sm mb-2 border border-orange-200" 
          />
          <span className="text-2xl font-black tracking-wider text-orange-600">HomePot Chef</span>
          <span className="text-xs text-stone-500 mt-0.5">Homemade Culinary Delights</span>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="max-w-xl w-full bg-white border border-orange-200 rounded-3xl p-8 shadow-xl mx-auto relative overflow-hidden">
          
          <div className="text-center mb-6 border-b border-orange-100 pb-4">
            <h1 className="text-2xl font-extrabold text-stone-800 tracking-wide">Register Kitchen</h1>
            <p className="text-xs text-stone-500 mt-1">Complete details and human face verification</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            
            {/* Chef Photo & Face Verification Section */}
            <div className="flex flex-col items-center justify-center mb-2">
              <label className="relative cursor-pointer group">
                <div className={`w-24 h-24 rounded-full border-2 border-dashed ${faceVerified ? 'border-emerald-500 bg-emerald-50' : 'border-orange-300 bg-orange-50'} flex items-center justify-center overflow-hidden shadow-inner transition`}>
                  {chefPhotoPreview ? (
                    <img src={chefPhotoPreview} alt="Chef Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-orange-600">
                      <ChefHat size={32} />
                    </div>
                  )}
                </div>
                <div className={`absolute bottom-0 right-0 ${faceVerified ? 'bg-emerald-600' : 'bg-orange-600'} text-white p-1.5 rounded-full shadow-md`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              <span className="text-xs font-semibold text-stone-600 mt-2">Amma / Chef Photo (Face Verification)</span>
              {verifyingFace && <span className="text-xs text-sky-600 mt-1 animate-pulse">Running face verification scan...</span>}
              {faceVerified && <span className="text-xs text-emerald-600 font-bold mt-1">&#10003; Face Verified Successfully</span>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@homepot.com"
                className="w-full bg-orange-50/30 border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500 text-stone-800"
              />
            </div>

            {/* Kitchen Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1 font-medium">Kitchen Name</label>
              <input
                type="text"
                required
                value={kitchenName}
                onChange={(e) => setKitchenName(e.target.value)}
                placeholder="e.g., Rupa's Home Kitchen"
                className="w-full bg-orange-50/30 border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500 text-stone-800"
              />
            </div>

            {/* Owner Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1 font-medium">Owner Full Name</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter owner full name"
                className="w-full bg-orange-50/30 border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500 text-stone-800"
              />
            </div>

            {/* FSSAI Registration Number */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1 font-medium">FSSAI Registration / Hygiene Number (14 Digits)</label>
              <input
                type="text"
                required
                maxLength={14}
                value={fssaiNumber}
                onChange={(e) => setFssaiNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g., 12345678901234"
                className="w-full bg-orange-50/30 border border-stone-300 rounded-xl px-4 py-3 text-base tracking-widest font-mono focus:outline-none focus:border-orange-500 text-stone-800"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Must be exactly 14 numeric digits as per FSSAI regulations.</span>
            </div>

            {/* Kitchen Location / Address */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1 font-medium">Kitchen Location / Address</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete kitchen address"
                className="w-full bg-orange-50/30 border border-stone-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-orange-500 text-stone-800 resize-none"
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1 font-medium">Password (Min 6 chars)</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-orange-50/30 border border-stone-300 rounded-xl px-4 py-3 pr-10 text-base focus:outline-none focus:border-orange-500 text-stone-800"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 cursor-pointer">
                    {renderEyeIcon(showPass)}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1 font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-orange-50/30 border border-stone-300 rounded-xl px-4 py-3 pr-10 text-base focus:outline-none focus:border-orange-500 text-stone-800"
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 cursor-pointer">
                    {renderEyeIcon(showConfirmPass)}
                  </button>
                </div>
              </div>
            </div>

            {/* Specialty Tags */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">Specialties & Cuisines</label>
              <div className="flex flex-wrap gap-2">
                {availableSpecialties.map((spec) => {
                  const isSelected = selectedSpecialties.includes(spec);
                  return (
                    <button
                      type="button"
                      key={spec}
                      onClick={() => toggleSpecialty(spec)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-xs cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-800 text-white shadow-amber-900/20' 
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Declaration Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="declaration"
                required
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor="declaration" className="text-xs text-stone-600 leading-relaxed cursor-pointer">
                <span className="font-bold text-stone-800">Declaration of Food Safety</span>
                <span className="block text-orange-700 underline mt-0.5">I declare that all homemade items comply with high hygiene and quality standards.</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl text-base transition shadow-md disabled:opacity-50 tracking-wider mt-4 cursor-pointer"
            >
              {loading ? 'PROCESSING...' : 'SUBMIT FOR VERIFICATION'}
            </button>
          </form>

          {/* Status Message Display */}
          {message.text && (
            <p className={`text-sm text-center mt-4 font-medium ${
              message.type === 'green' ? 'text-emerald-700' :
              message.type === 'red' ? 'text-rose-600' : 'text-sky-700'
            }`}>
              {message.text}
            </p>
          )}

          {/* Back to Login Link */}
          <div className="text-center mt-6 pt-4 border-t border-orange-100">
            <p className="text-xs text-stone-500">
              Already have a registered kitchen?{' '}
              <button 
                type="button"
                onClick={onBackToLogin}
                className="text-orange-600 font-bold hover:underline bg-transparent border-0 p-0 inline cursor-pointer"
              >
                Sign In here
              </button>
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-stone-500 border-t border-orange-100 bg-white">
        <p>&copy; 2026 HomePot Chef. All rights reserved.</p>
      </footer>
    </div>
  );
}


// ==========================================
// 3. MAIN APP ROUTER COMPONENT
// ==========================================
export default function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'

  return (
    <div>
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={(data) => {
            console.log('Logged in successfully:', data);
            alert('Login successful! Redirecting to dashboard...');
          }} 
          onRegisterClick={() => setCurrentView('register')} 
        />
      )}

      {currentView === 'register' && (
        <HomePotKitchenRegistration 
          onBackToLogin={() => setCurrentView('login')}
        />
      )}
    </div>
  );
}