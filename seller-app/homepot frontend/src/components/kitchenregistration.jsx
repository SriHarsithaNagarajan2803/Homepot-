import React, { useState, useRef } from 'react';
import { Camera, CheckCircle2, ShieldCheck, ArrowRight, Lock, Mail, User, MapPin, Award } from 'lucide-react';
import logoImage from '../assets/logo.jpeg';

export default function HomePotKitchenRegistration({ onBackToLogin }) {
  const [kitchenName, setKitchenName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [declarationChecked, setDeclarationChecked] = useState(false);

  const [otpStep, setOtpStep] = useState('input');
  const [otp, setOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [chefPhotoPreview, setChefPhotoPreview] = useState(null);
  const [faceVerified, setFaceVerified] = useState(false);
  const [verifyingFace, setVerifyingFace] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const availableSpecialties = [
    'Pure Veg', 'South Indian', 'North Indian', 'Home Sweets & Snacks', 'Andhra Style'
  ];

  const toggleSpecialty = (spec) => {
    setSelectedSpecialties(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const startCamera = async () => {
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setMessage({ text: 'Unable to access camera. Please check permissions.', type: 'red' });
      setShowCameraModal(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCameraModal(false);
  };

  const captureAndVerifyFace = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setChefPhotoPreview(imageDataUrl);
    stopCamera();

    setVerifyingFace(true);
    setMessage({ text: 'Verifying face with backend AI...', type: 'blue' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Face verification failed');

      setVerifyingFace(false);
      setFaceVerified(true);
      setMessage({ text: 'Human face verified successfully!', type: 'green' });
    } catch (err) {
      setVerifyingFace(false);
      setFaceVerified(false);
      setMessage({ text: err.message, type: 'red' });
    }
  };

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
      setMessage({ text: 'OTP sent to your email!', type: 'green' });
    } catch (err) {
      setMessage({ text: err.message, type: 'red' });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      setMessage({ text: 'Please enter the 4-digit OTP.', type: 'red' });
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
      setMessage({ text: err.message, type: 'red' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      setMessage({ text: 'Please verify your email address before registering.', type: 'red' });
      return;
    }
    if (!faceVerified) {
      setMessage({ text: 'Please complete the live face verification scan.', type: 'red' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register-kitchen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kitchenName, ownerName, email, fssaiNumber: fssaiNumber.trim(), address, specialties: selectedSpecialties, password
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Registration failed');

      setLoading(false);
      setMessage({ text: 'Kitchen registered successfully!', type: 'green' });
      setTimeout(() => onBackToLogin && onBackToLogin(), 1500);
    } catch (err) {
      setLoading(false);
      setMessage({ text: err.message, type: 'red' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={logoImage} alt="Logo" className="w-10 h-10 rounded-full object-cover border border-orange-500" />
          <div>
            <h1 className="text-lg font-bold tracking-wide text-orange-500 leading-none">HomePot Chef</h1>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase">Homemade Culinary Delights</span>
          </div>
        </div>
        <button 
          type="button" 
          onClick={onBackToLogin}
          className="text-xs text-slate-400 hover:text-white transition font-medium"
        >
          Already have an account? <span className="text-orange-400 underline">Sign In</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <span className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-semibold tracking-wide border border-orange-500/20">
            CHEF PARTNER PORTAL
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mt-3">Register Your Kitchen</h2>
          <p className="text-sm text-slate-400 mt-1">Provide your credentials, FSSAI compliance code, and complete face identification.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-950/40 p-8 lg:p-12 rounded-3xl border border-slate-800 shadow-2xl">
          
          {/* Section 1: Face Verification Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div 
                onClick={startCamera}
                className="w-20 h-20 rounded-2xl bg-orange-500/10 border-2 border-dashed border-orange-500/40 flex items-center justify-center overflow-hidden cursor-pointer flex-shrink-0 relative group shadow-inner"
              >
                {chefPhotoPreview ? (
                  <img src={chefPhotoPreview} alt="Chef" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={28} className="text-orange-400 group-hover:scale-110 transition" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <ShieldCheck size={16} className="text-orange-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Human Face Verification</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {faceVerified ? <span className="text-emerald-400 font-bold">&#10003; Live biometric capture verified</span> : 'Required to ensure kitchen authenticity & safety standards.'}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={startCamera}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                faceVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20'
              }`}
            >
              <Camera size={14} />
              {faceVerified ? 'Retake Scan' : 'Start Live Camera Scan'}
            </button>
          </div>

          {/* Section 2: Core Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Kitchen Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><User size={16} /></span>
                <input
                  type="text"
                  required
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  placeholder="e.g., Grandma's Kitchen"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Owner Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><User size={16} /></span>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g., Savitri Devi"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Email + OTP */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address (Sign In ID)</label>
            <div className="flex gap-3">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Mail size={16} /></span>
                <input
                  type="email"
                  required
                  disabled={isEmailVerified}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chef@homepot.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition disabled:opacity-60"
                />
              </div>
              {!isEmailVerified && otpStep === 'input' && (
                <button type="button" onClick={handleSendOtp} className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 rounded-xl text-xs transition cursor-pointer flex-shrink-0">
                  Send OTP
                </button>
              )}
            </div>

            {otpStep === 'verifying' && !isEmailVerified && (
              <div className="mt-3 flex gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit code"
                  className="w-40 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-center font-mono text-sm tracking-widest text-white focus:outline-none focus:border-orange-500"
                />
                <button type="button" onClick={handleVerifyOtp} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer">
                  Confirm OTP
                </button>
              </div>
            )}
            {isEmailVerified && <span className="text-xs text-emerald-400 font-semibold mt-2 block">&#10003; Email Verified Successfully</span>}
          </div>

          {/* Section 4: FSSAI & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">FSSAI Registration Number (14 Digits)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Award size={16} /></span>
                <input
                  type="text"
                  required
                  maxLength={14}
                  value={fssaiNumber}
                  onChange={(e) => setFssaiNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="12345678901234"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Kitchen Location Address</label>
              <div className="relative">
                <span className="absolute top-3.5 left-4 text-slate-500"><MapPin size={16} /></span>
                <textarea
                  required
                  rows={1}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, city"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Lock size={16} /></span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Lock size={16} /></span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Specialties */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Kitchen Specialties</label>
            <div className="flex flex-wrap gap-2">
              {availableSpecialties.map(spec => {
                const isSelected = selectedSpecialties.includes(spec);
                return (
                  <button
                    type="button"
                    key={spec}
                    onClick={() => toggleSpecialty(spec)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer border ${
                      isSelected 
                        ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/20' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Declaration */}
          <div className="flex items-start space-x-3 pt-2 border-t border-slate-800/60">
            <input
              type="checkbox"
              required
              checked={declarationChecked}
              onChange={(e) => setDeclarationChecked(e.target.checked)}
              className="mt-1 rounded bg-slate-900 border-slate-700 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-xs text-slate-400 leading-relaxed">
              I officially declare that all meals prepared meet strict health, safety, and hygiene compliance regulations.
            </span>
          </div>

          {/* Status Message */}
          {message.text && (
            <p className={`text-xs font-semibold text-center ${
              message.type === 'green' ? 'text-emerald-400' : message.type === 'red' ? 'text-rose-400' : 'text-sky-400'
            }`}>
              {message.text}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl text-sm transition shadow-xl shadow-orange-600/20 tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{loading ? 'PROCESSING REGISTRATION...' : 'SUBMIT KITCHEN APPLICATION'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Camera Modal Popup */}
        {showCameraModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-1">Live Face Biometric Scan</h3>
              <p className="text-xs text-slate-400 mb-4">Position your face clearly inside the capture window.</p>
              
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-5 border border-slate-800">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={stopCamera} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-bold transition">Cancel</button>
                <button type="button" onClick={captureAndVerifyFace} className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl text-xs font-bold transition shadow-lg shadow-orange-600/20">Snap & Verify</button>
              </div>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>&copy; 2026 HomePot Chef. All rights reserved.</p>
      </footer>
    </div>
  );
}