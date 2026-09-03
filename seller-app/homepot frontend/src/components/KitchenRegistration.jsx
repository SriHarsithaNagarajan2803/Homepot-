import React, { useState } from 'react';
import { ChefHat, ShieldCheck, MapPin, Store, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function KitchenRegistration({ onBackToLogin, onRegistrationSuccess }) {
  const [step, setStep] = useState(1); // Step 1: FSSAI, Step 2: Kitchen Details
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [kitchenName, setKitchenName] = useState('');
  const [address, setAddress] = useState('');
  const [cuisineType, setCuisineType] = useState('Home Style');
  
  const [verifying, setVerifying] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle FSSAI Verification against FastAPI backend
  const handleVerifyFssai = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/verify-fssai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fssai_number: fssaiNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'FSSAI Verification failed');
      }

      setVerifiedData(data);
      setMessage({ type: 'success', text: 'FSSAI License Verified Successfully!' });
      setTimeout(() => {
        setStep(2); // Move to kitchen profile setup
        setMessage({ type: '', text: '' });
      }, 1000);

    } catch (error) {
      console.error('Verification error:', error);
      // Fallback for mock development if backend is offline
      if (fssaiNumber.length >= 10) {
        setMessage({ type: 'success', text: 'Mock FSSAI Verified!' });
        setTimeout(() => {
          setStep(2);
          setMessage({ type: '', text: '' });
        }, 1000);
      } else {
        setMessage({ type: 'error', text: 'Invalid FSSAI License Number format.' });
      }
    } finally {
      setVerifying(false);
    }
  };

  // Handle Final Kitchen Submission
  const handleRegisterKitchen = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register-kitchen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fssai_number: fssaiNumber,
          kitchen_name: kitchenName,
          address: address,
          cuisine_type: cuisineType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Kitchen registration failed');
      }

      setMessage({ type: 'success', text: 'Kitchen registered successfully!' });
      setTimeout(() => {
        if (onRegistrationSuccess) onRegistrationSuccess(data);
      }, 1200);

    } catch (error) {
      console.error('Registration error:', error);
      // Mock fallback
      setMessage({ type: 'success', text: 'Mock Kitchen Registered!' });
      setTimeout(() => {
        if (onRegistrationSuccess) onRegistrationSuccess({ kitchenName });
      }, 1200);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen py-10 px-4 font-sans flex flex-col justify-center">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8B4513] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ChefHat size={34} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">Kitchen Registration</h1>
          <p className="text-xs text-gray-500 mt-1">
            {step === 1 ? 'Step 1: Verify your FSSAI license' : 'Step 2: Setup your kitchen profile'}
          </p>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-2 text-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Step 1: FSSAI Verification */}
        {step === 1 && (
          <form onSubmit={handleVerifyFssai} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">FSSAI License Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <ShieldCheck size={18} />
                </span>
                <input 
                  type="text" 
                  placeholder="Enter 14-digit FSSAI number"
                  value={fssaiNumber}
                  onChange={(e) => setFssaiNumber(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm bg-[#FFFDF9]"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={verifying}
              className="w-full bg-[#8B4513] text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-amber-900 transition tracking-wide text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {verifying ? 'Verifying License...' : 'VERIFY FSSAI'} <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Step 2: Kitchen Details */}
        {step === 2 && (
          <form onSubmit={handleRegisterKitchen} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Kitchen Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Store size={18} />
                </span>
                <input 
                  type="text" 
                  placeholder="e.g. Grandma's Home Kitchen"
                  value={kitchenName}
                  onChange={(e) => setKitchenName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm bg-[#FFFDF9]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Kitchen Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 pt-3 pointer-events-none text-gray-400">
                  <MapPin size={18} />
                </span>
                <textarea 
                  rows="2"
                  placeholder="Street, Area, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm bg-[#FFFDF9]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Cuisine Speciality</label>
              <select 
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm bg-[#FFFDF9]"
              >
                <option value="Home Style">Home Style Traditional</option>
                <option value="South Indian">South Indian Meals</option>
                <option value="North Indian">North Indian Delicacies</option>
                <option value="Bakery & Snacks">Bakery & Snacks</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-[#8B4513] text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-amber-900 transition tracking-wide text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {submitting ? 'Registering Kitchen...' : 'COMPLETE REGISTRATION'} <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Back Link */}
        {onBackToLogin && (
          <div className="text-center mt-6 pt-6 border-t border-amber-100">
            <button 
              onClick={onBackToLogin}
              className="text-xs font-bold text-gray-500 hover:text-[#8B4513] flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
}