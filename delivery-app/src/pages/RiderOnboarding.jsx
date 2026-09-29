import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Bike, CreditCard, ArrowRight, User, HeartHandshake, UploadCloud, FileText, Check, AlertCircle, X } from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function RiderOnboarding() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const savedProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem('homepot_rider_profile')) || {};
    } catch {
      return {};
    }
  })();

  // 1. Personal & Inclusivity state
  const [gender, setGender] = useState(savedProfile.gender || 'male');
  const [isPwd, setIsPwd] = useState(savedProfile.isPwd ?? false);
  const [pwdCategory, setPwdCategory] = useState(savedProfile.pwdCategory || 'locomotor_mobility');
  const [udidFileName, setUdidFileName] = useState(savedProfile.udidFileName || '');
  const [udidCertificate, setUdidCertificate] = useState(savedProfile.udidCertificate || '');
  const [fileError, setFileError] = useState('');

  // 2. Vehicle state
  const [vehicleType, setVehicleType] = useState(savedProfile.vehicleType || 'petrol_two_wheeler');
  const [vehicleNumber, setVehicleNumber] = useState(savedProfile.vehicleNumber === 'N/A' ? '' : (savedProfile.vehicleNumber || ''));
  const [drivingLicense, setDrivingLicense] = useState(savedProfile.drivingLicense === 'N/A' ? '' : (savedProfile.drivingLicense || ''));
  const [operatingCity, setOperatingCity] = useState(savedProfile.operatingCity || '');
  
  // 3. Bank & UPI state
  const [holderName, setHolderName] = useState(() => localStorage.getItem('homepot_rider_name') || savedProfile.bank?.holderName || '');
  const [accountNumber, setAccountNumber] = useState(savedProfile.bank?.accountNumber || '');
  const [ifsc, setIfsc] = useState(savedProfile.bank?.ifsc || '');
  const [upiId, setUpiId] = useState(savedProfile.bank?.upiId || '');

  const isBicycle = vehicleType === 'bicycle_ecycle';

  const VEHICLE_LABELS = {
    bicycle_ecycle: 'Bicycle / E-Cycle',
    petrol_two_wheeler: 'Petrol Two-Wheeler',
    electric_two_wheeler: 'Electric Two-Wheeler',
    car: 'Car'
  };

  const handleFileUpload = (e) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Allowed extensions check
    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      setFileError('Invalid file type. Please upload a .pdf, .png, or .jpg file.');
      return;
    }

    // 5MB limit check (5 * 1024 * 1024 bytes)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError('File size exceeds 5MB limit. Please upload a smaller document.');
      return;
    }

    setUdidFileName(file.name);

    // Read file for offline/local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setUdidCertificate(event.target?.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setUdidFileName('');
    setUdidCertificate('');
    setFileError('');
  };

  const handleComplete = (e) => {
    e.preventDefault();

    const vehicleName = VEHICLE_LABELS[vehicleType] || vehicleType;
    const vehicleFull = isBicycle ? vehicleName : `${vehicleName} (${vehicleNumber.trim()})`;
    
    const riderProfile = {
      name: (localStorage.getItem('homepot_rider_name') || holderName).trim() || 'Delivery Partner',
      phone: localStorage.getItem('homepot_rider_phone') || '',
      email: localStorage.getItem('homepot_rider_email') || '',
      gender,
      isPwd,
      pwdCategory: isPwd ? pwdCategory : '',
      udidFileName: isPwd ? udidFileName : '',
      udidCertificate: isPwd ? udidCertificate : '',
      vehicleType,
      vehicle: vehicleFull,
      vehicleNumber: isBicycle ? 'N/A' : vehicleNumber.trim(),
      drivingLicense: isBicycle ? 'N/A' : drivingLicense.trim(),
      operatingCity: operatingCity.trim() || 'Operating Zone (5km radius)',
      bank: {
        holderName: holderName.trim(),
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        upiId: upiId.trim()
      },
      verified: true
    };

    localStorage.setItem('homepot_rider_profile', JSON.stringify(riderProfile));
    localStorage.setItem('homepot_rider_kyc_completed', 'true');
    // Also save live assigned rider so buyer and chef apps pick it up immediately
    localStorage.setItem('homepot_live_assigned_rider', JSON.stringify(riderProfile));

    navigate('/radar');
  };

  return (
    <div className="relative min-h-[760px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] px-5 py-5 font-sans select-none">
      {/* Top Header */}
      <div className="w-full flex justify-between items-center pb-2 border-b border-[#EADBCC]">
        <HomepotLogo size="sm" showText={false} />
        <h2 className="font-serif text-base font-bold text-[#8C4A32]">
          {t('rider_kyc_title')}
        </h2>
        <LanguageSelector variant="round" />
      </div>

      <form onSubmit={handleComplete} className="flex-1 space-y-4 max-w-sm mx-auto w-full py-2">
        {/* 1. Personal & Inclusivity Details */}
        <div className="bg-white/90 border border-[#EADBCC] rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#8C4A32] font-bold text-xs">
            <User size={16} />
            <span>Personal & Inclusivity Details</span>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none cursor-pointer"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other_prefer_not_to_say">Other / Prefer not to say</option>
            </select>
          </div>

          {/* PwD Question Radio Toggle */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-bold text-[#6C645E] block leading-snug">
              Are you a Person with Disability (PwD) / Differently-Abled?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPwd(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                  !isPwd
                    ? 'bg-[#8C4A32] text-white border-[#8C4A32] shadow-xs'
                    : 'bg-[#FAF6EE] text-[#6C645E] border-[#EADBCC] hover:bg-white'
                }`}
              >
                {!isPwd && <Check size={13} />}
                <span>No</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPwd(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                  isPwd
                    ? 'bg-[#8C4A32] text-white border-[#8C4A32] shadow-xs'
                    : 'bg-[#FAF6EE] text-[#6C645E] border-[#EADBCC] hover:bg-white'
                }`}
              >
                {isPwd && <Check size={13} />}
                <span>Yes</span>
              </button>
            </div>
          </div>

          {/* Dynamically Revealed PwD Category & Document Upload */}
          {isPwd && (
            <div className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-2xl p-3.5 space-y-3 mt-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-[#8C4A32] font-bold text-[11px]">
                <HeartHandshake size={14} />
                <span>Accessibility & Special Support Setup</span>
              </div>

              {/* Disability Category Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
                  Disability Category
                </label>
                <select
                  value={pwdCategory}
                  onChange={(e) => setPwdCategory(e.target.value)}
                  className="w-full bg-white border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none cursor-pointer"
                >
                  <option value="locomotor_mobility">Locomotor / Mobility</option>
                  <option value="hearing_speech_impaired">Hearing & Speech Impaired</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* UDID / Disability Certificate Upload */}
              <div>
                <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
                  UDID / Disability Certificate (.pdf, .png, .jpg, max 5MB)
                </label>

                {!udidFileName ? (
                  <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#DFCBB5] hover:border-[#8C4A32] bg-white rounded-xl py-3 px-4 text-center cursor-pointer transition">
                    <UploadCloud size={20} className="text-[#8C4A32] mb-1" />
                    <span className="text-xs font-bold text-[#8C4A32]">Click to upload document</span>
                    <span className="text-[9px] text-[#A09890] mt-0.5">Government UDID or Medical Certificate</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-white border border-[#DFCBB5] rounded-xl px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={16} className="text-[#8C4A32] shrink-0" />
                      <span className="truncate font-medium text-[#2C231E] text-[11px] max-w-[190px]">
                        {udidFileName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-[#8C4A32] hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Error message */}
                {fileError && (
                  <div className="text-[10px] font-semibold text-rose-700 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-[#7C746E] leading-relaxed italic">
                ℹ️ We provide ground-floor pickup preference at home-kitchens and extended delivery time buffers for your safety and comfort.
              </p>
            </div>
          )}
        </div>

        {/* 2. Vehicle Information */}
        <div className="bg-white/90 border border-[#EADBCC] rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#8C4A32] font-bold text-xs">
            <Bike size={16} />
            <span>Vehicle Details</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6C645E] block mb-1">Select Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none cursor-pointer"
            >
              <option value="bicycle_ecycle">Bicycle / E-Cycle</option>
              <option value="petrol_two_wheeler">Petrol Two-Wheeler</option>
              <option value="electric_two_wheeler">Electric Two-Wheeler</option>
              <option value="car">Car</option>
            </select>
          </div>

          {/* Dynamically hide DL and Registration if Bicycle / E-Cycle */}
          {isBicycle ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] font-semibold text-emerald-800 flex items-center gap-2 shadow-xs">
              <span className="text-base shrink-0">🚲</span>
              <span className="leading-snug">No Driving License or Vehicle Registration required for Bicycle / E-Cycle.</span>
            </div>
          ) : (
            <>
              <div>
                <label className="text-[10px] font-bold text-[#6C645E] block mb-1">Vehicle Registration Number</label>
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. TN 09 BX 4521"
                  className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6C645E] block mb-1">Driving License (DL) Number</label>
                <input
                  type="text"
                  required
                  value={drivingLicense}
                  onChange={(e) => setDrivingLicense(e.target.value)}
                  placeholder="e.g. DL-0420110012345"
                  className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none uppercase"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-[10px] font-bold text-[#6C645E] block mb-1">Operating City / Area</label>
            <input
              type="text"
              required
              value={operatingCity}
              onChange={(e) => setOperatingCity(e.target.value)}
              placeholder="e.g. Chennai - 5km radius"
              className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none"
            />
          </div>
        </div>

        {/* Bank & Payouts */}
        <div className="bg-white/90 border border-[#EADBCC] rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#8C4A32] font-bold text-xs">
            <CreditCard size={16} />
            <span>{t('bank_payout_title')}</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6C645E] block mb-1">{t('account_holder_name')}</label>
            <input
              type="text"
              required
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              placeholder="Name as in bank"
              className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-[#6C645E] block mb-1">{t('bank_account_number')}</label>
              <input
                type="password"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Account number"
                className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#6C645E] block mb-1">{t('ifsc_code')}</label>
              <input
                type="text"
                required
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="IFSC Code"
                className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none uppercase"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6C645E] block mb-1">{t('upi_id_label')}</label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. name@okhdfcbank"
              className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          <span>{t('complete_onboarding_btn')}</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
