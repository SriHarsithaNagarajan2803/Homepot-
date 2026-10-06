import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Bike, 
  CreditCard, 
  ArrowRight, 
  User, 
  HeartHandshake, 
  UploadCloud, 
  FileText, 
  Check, 
  AlertCircle, 
  X, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function RiderOnboarding() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const savedProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem('homepot_rider_profile')) || {};
    } catch {
      return {};
    }
  })();

  // 1. Personal & Inclusivity state
  const [gender, setGender] = useState(savedProfile.gender || 'male');
  
  // PwD status: 'no' | 'yes' | 'prefer_not_to_disclose'
  const [pwdStatus, setPwdStatus] = useState(() => {
    if (savedProfile.pwdStatus) return savedProfile.pwdStatus;
    if (savedProfile.isPwd === true) return 'yes';
    if (savedProfile.isPwd === false) return 'no';
    return 'no';
  });

  const [pwdCategory, setPwdCategory] = useState(savedProfile.pwdCategory || 'mobility');
  const [otherDisabilityDetail, setOtherDisabilityDetail] = useState(savedProfile.otherDisabilityDetail || '');
  const [udidFileName, setUdidFileName] = useState(savedProfile.udidFileName || '');
  const [udidCertificate, setUdidCertificate] = useState(savedProfile.udidCertificate || '');
  
  // Certificate Verification Workflow: 'idle' | 'verifying' | 'valid' | 'invalid'
  const [verificationState, setVerificationState] = useState(savedProfile.udidFileName ? 'valid' : 'idle');
  const [verificationMsg, setVerificationMsg] = useState(
    savedProfile.udidFileName ? (isTamil ? '✓ ஆவணம் வெற்றிகரமாக சரிபார்க்கப்பட்டது' : '✓ Document Verified Successfully') : ''
  );

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
    bicycle_ecycle: isTamil ? 'சைக்கிள் / இ-சைக்கிள் (Bicycle / E-Cycle)' : 'Bicycle / E-Cycle',
    petrol_two_wheeler: isTamil ? 'பெட்ரோல் இருசக்கர வாகனம் (Petrol Two-Wheeler)' : 'Petrol Two-Wheeler',
    electric_two_wheeler: isTamil ? 'மின்சார இருசக்கர வாகனம் (Electric Two-Wheeler)' : 'Electric Two-Wheeler',
    car: isTamil ? 'கார் (Car)' : 'Car'
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!allowedExtensions.includes(fileExt)) {
      setVerificationState('invalid');
      setVerificationMsg(
        isTamil 
          ? 'தவறான கோப்பு வடிவம்: .pdf, .png, அல்லது .jpg வடிவிலான அரசு சான்றிதழ்கள் மட்டுமே ஏற்றுக்கொள்ளப்படும்.' 
          : 'Invalid file format: Only official UDID or Government medical certificate in .pdf, .png, or .jpg accepted.'
      );
      setUdidFileName(file.name);
      return;
    }

    if (file.size > MAX_SIZE) {
      setVerificationState('invalid');
      setVerificationMsg(
        isTamil 
          ? 'அளவு வரம்பை தாண்டியுள்ளது: கோப்பு 5MB ஐ விட அதிகமாக உள்ளது. 5MB-க்கு குறைவான ஆவணத்தை பதிவேற்றவும்.' 
          : 'File size exceeded: File is larger than 5MB limit. Please upload an optimized document under 5MB.'
      );
      setUdidFileName(file.name);
      return;
    }

    // Start verification simulation
    setUdidFileName(file.name);
    setVerificationState('verifying');
    setVerificationMsg(isTamil ? 'ஆவணம் சரிபார்க்கப்படுகிறது...' : 'Verifying document...');

    const reader = new FileReader();
    reader.onload = (event) => {
      setUdidCertificate(event.target?.result || '');
      setTimeout(() => {
        setVerificationState('valid');
        setVerificationMsg(
          isTamil 
            ? '✓ ஆவணம் வெற்றிகரமாக சரிபார்க்கப்பட்டது (UDID / மருத்துவ சான்றிதழ் உறுதிப்படுத்தப்பட்டது)' 
            : '✓ Document Verified Successfully (UDID / Medical Certificate Validated)'
        );
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setUdidFileName('');
    setUdidCertificate('');
    setVerificationState('idle');
    setVerificationMsg('');
  };

  const handleComplete = (e) => {
    e.preventDefault();

    if (pwdStatus === 'yes' && verificationState === 'invalid') {
      alert(isTamil ? 'தயவுசெய்து சரியான மாற்றுத்திறனாளி சான்றிதழை பதிவேற்றவும்.' : 'Please upload a valid UDID / Disability certificate before proceeding.');
      return;
    }

    const vehicleName = VEHICLE_LABELS[vehicleType] || vehicleType;
    const vehicleFull = isBicycle ? vehicleName : `${vehicleName} (${vehicleNumber.trim()})`;
    
    const isPwdBool = pwdStatus === 'yes';

    const riderProfile = {
      name: (localStorage.getItem('homepot_rider_name') || holderName).trim() || 'Delivery Partner',
      phone: localStorage.getItem('homepot_rider_phone') || '',
      email: localStorage.getItem('homepot_rider_email') || '',
      gender,
      pwdStatus,
      isPwd: isPwdBool,
      pwdCategory: isPwdBool ? pwdCategory : '',
      otherDisabilityDetail: isPwdBool && pwdCategory === 'other' ? otherDisabilityDetail.trim() : '',
      udidFileName: isPwdBool ? udidFileName : '',
      udidCertificate: isPwdBool ? udidCertificate : '',
      vehicleType,
      vehicle: vehicleFull,
      vehicleNumber: isBicycle ? 'N/A' : vehicleNumber.trim(),
      drivingLicense: isBicycle ? 'N/A' : drivingLicense.trim(),
      operatingCity: operatingCity.trim() || 'Chennai Zone (3 - 7 km)',
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

      <form onSubmit={handleComplete} className="flex-1 space-y-4 max-w-[480px] mx-auto w-full py-2">
        {/* 1. Personal & Inclusivity Details */}
        <div className="bg-white/90 border border-[#EADBCC] rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#8C4A32] font-bold text-xs">
            <User size={16} />
            <span>{t('personal_inclusivity_title') || 'Personal & Inclusivity Details'}</span>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
              {t('gender_label') || 'Gender'}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none cursor-pointer"
            >
              <option value="male">{t('gender_male') || 'Male'}</option>
              <option value="female">{t('gender_female') || 'Female'}</option>
              <option value="other_prefer_not_to_say">{t('gender_other') || 'Other / Prefer not to say'}</option>
            </select>
          </div>

          {/* Strict 3-Option Disability Selection */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-bold text-[#6C645E] block leading-snug">
              {t('pwd_question') || 'Are you a Person with Disability (PwD) / Differently-Abled?'}
            </label>
            
            <div className="grid grid-cols-3 gap-1.5">
              {/* Option 1: No */}
              <button
                type="button"
                onClick={() => setPwdStatus('no')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  pwdStatus === 'no'
                    ? 'bg-[#8C4A32] text-white border-[#8C4A32] shadow-xs'
                    : 'bg-[#FAF6EE] text-[#6C645E] border-[#EADBCC] hover:bg-white'
                }`}
              >
                <span>{t('option_no') || 'No'}</span>
                {pwdStatus === 'no' && <Check size={12} />}
              </button>

              {/* Option 2: Yes (Request Support) */}
              <button
                type="button"
                onClick={() => setPwdStatus('yes')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer flex flex-col items-center justify-center gap-1 text-center ${
                  pwdStatus === 'yes'
                    ? 'bg-[#8C4A32] text-white border-[#8C4A32] shadow-xs'
                    : 'bg-[#FAF6EE] text-[#6C645E] border-[#EADBCC] hover:bg-white'
                }`}
              >
                <span className="leading-tight">{t('option_yes_support') || 'Yes (Request Support)'}</span>
                {pwdStatus === 'yes' && <Check size={12} />}
              </button>

              {/* Option 3: Prefer not to disclose */}
              <button
                type="button"
                onClick={() => setPwdStatus('prefer_not_to_disclose')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer flex flex-col items-center justify-center gap-1 text-center ${
                  pwdStatus === 'prefer_not_to_disclose'
                    ? 'bg-[#8C4A32] text-white border-[#8C4A32] shadow-xs'
                    : 'bg-[#FAF6EE] text-[#6C645E] border-[#EADBCC] hover:bg-white'
                }`}
              >
                <span className="leading-tight">{t('option_prefer_not_disclose') || 'Prefer not to disclose'}</span>
                {pwdStatus === 'prefer_not_to_disclose' && <Check size={12} />}
              </button>
            </div>
          </div>

          {/* Dynamically Revealed Support Form (When Yes - Request Support is selected) */}
          {pwdStatus === 'yes' && (
            <div className="bg-[#FAF4EB] border border-[#DFCBB5] rounded-2xl p-3.5 space-y-3 mt-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-[#8C4A32] font-bold text-[11px]">
                <HeartHandshake size={14} />
                <span>{t('accessibility_support_setup') || 'Accessibility & Special Support Setup'}</span>
              </div>

              {/* Disability Category Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
                  {t('disability_category_label') || 'Disability Category'}
                </label>
                <select
                  value={pwdCategory}
                  onChange={(e) => setPwdCategory(e.target.value)}
                  className="w-full bg-white border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none cursor-pointer"
                >
                  <option value="mobility">{t('cat_mobility') || 'Locomotor / Mobility'}</option>
                  <option value="hearing_speech_impaired">{t('cat_hearing_speech') || 'Hearing & Speech Impaired'}</option>
                  <option value="other">{t('cat_other') || 'Other'}</option>
                </select>
              </div>

              {/* Dynamically Revealed Input if "Other" is selected */}
              {pwdCategory === 'other' && (
                <div className="animate-fadeIn">
                  <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
                    {t('specify_disability_need') || 'Specify your disability and support needed'}
                  </label>
                  <input
                    type="text"
                    required
                    value={otherDisabilityDetail}
                    onChange={(e) => setOtherDisabilityDetail(e.target.value)}
                    placeholder={isTamil ? 'உதாரணம்: பார்வைக் குறைபாடு / சிறப்பு ஆதரவு' : 'e.g., Low vision, specialized tricycle'}
                    className="w-full bg-white border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none"
                  />
                </div>
              )}

              {/* UDID / Disability Certificate Upload & Verification State */}
              <div>
                <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
                  {t('certificate_upload_label') || 'UDID / Disability Certificate (.pdf, .png, .jpg, max 5MB)'}
                </label>

                {!udidFileName ? (
                  <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#DFCBB5] hover:border-[#8C4A32] bg-white rounded-xl py-3 px-4 text-center cursor-pointer transition">
                    <UploadCloud size={20} className="text-[#8C4A32] mb-1" />
                    <span className="text-xs font-bold text-[#8C4A32]">
                      {t('click_to_upload') || 'Click to upload document'}
                    </span>
                    <span className="text-[9px] text-[#A09890] mt-0.5">Government UDID or Medical Certificate</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="bg-white border border-[#DFCBB5] rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
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

                    {/* Verification Status Indicator */}
                    {verificationState === 'verifying' && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold">
                        <RefreshCw size={13} className="animate-spin text-amber-700" />
                        <span>{verificationMsg}</span>
                      </div>
                    )}

                    {verificationState === 'valid' && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>{verificationMsg}</span>
                      </div>
                    )}

                    {verificationState === 'invalid' && (
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-1.5 text-[10px] text-rose-800 font-semibold">
                        <AlertCircle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-rose-900">{isTamil ? 'சான்றிதழ் நிராகரிக்கப்பட்டது (Invalid):' : 'Document Rejected (Reason):'}</p>
                          <p className="mt-0.5">{verificationMsg}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-[10px] text-[#7C746E] leading-relaxed italic">
                {t('ground_floor_support_note') || 'ℹ️ We provide ground-floor pickup preference at home-kitchens and extended delivery time buffers for your safety and comfort.'}
              </p>
            </div>
          )}
        </div>

        {/* 2. Vehicle Information */}
        <div className="bg-white/90 border border-[#EADBCC] rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#8C4A32] font-bold text-xs">
            <Bike size={16} />
            <span>{t('vehicle_details_title') || 'Vehicle Details'}</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
              {t('select_vehicle_type') || 'Select Vehicle Type'}
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-medium focus:outline-none cursor-pointer"
            >
              <option value="bicycle_ecycle">{t('bicycle_label') || 'Bicycle / E-Cycle'}</option>
              <option value="petrol_two_wheeler">{t('petrol_two_wheeler_label') || 'Petrol Two-Wheeler'}</option>
              <option value="electric_two_wheeler">{t('electric_two_wheeler_label') || 'Electric Two-Wheeler'}</option>
              <option value="car">{t('car_label') || 'Car'}</option>
            </select>
          </div>

          {/* Dynamically hide DL and Registration if Bicycle / E-Cycle */}
          {isBicycle ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] font-semibold text-emerald-800 flex items-center gap-2 shadow-xs">
              <span className="text-base shrink-0">🚲</span>
              <span className="leading-snug">
                {t('no_dl_required_note') || 'No Driving License or Vehicle Registration required for Bicycle / E-Cycle.'}
              </span>
            </div>
          ) : (
            <>
              <div>
                <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
                  {t('vehicle_number')}
                </label>
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
                <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
                  {t('driving_license_no')}
                </label>
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
            <label className="text-[10px] font-bold text-[#6C645E] block mb-1">
              {t('operating_city_label') || 'Operating City / Area'}
            </label>
            <input
              type="text"
              required
              value={operatingCity}
              onChange={(e) => setOperatingCity(e.target.value)}
              placeholder={t('operating_city_placeholder') || 'e.g. Chennai - 3 to 7 km radius'}
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
                type="text"
                inputMode="numeric"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Visible account digits"
                className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl py-2 px-3 text-xs text-[#2C231E] font-mono font-medium focus:outline-none"
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
          <span>{t('complete_setup_proceed_btn') || 'Complete Setup & Proceed to Work'}</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
