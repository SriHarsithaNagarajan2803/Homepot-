import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Bike, CreditCard, ArrowRight } from 'lucide-react';
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

  const [vehicleType, setVehicleType] = useState(savedProfile.vehicleType || 'petrol_two_wheeler');
  const [vehicleNumber, setVehicleNumber] = useState(savedProfile.vehicleNumber === 'N/A' ? '' : (savedProfile.vehicleNumber || ''));
  const [drivingLicense, setDrivingLicense] = useState(savedProfile.drivingLicense === 'N/A' ? '' : (savedProfile.drivingLicense || ''));
  const [operatingCity, setOperatingCity] = useState(savedProfile.operatingCity || '');
  
  // Bank & UPI
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

  const handleComplete = (e) => {
    e.preventDefault();

    const vehicleName = VEHICLE_LABELS[vehicleType] || vehicleType;
    const vehicleFull = isBicycle ? vehicleName : `${vehicleName} (${vehicleNumber.trim()})`;
    
    const riderProfile = {
      name: (localStorage.getItem('homepot_rider_name') || holderName).trim() || 'Delivery Partner',
      phone: localStorage.getItem('homepot_rider_phone') || '',
      email: localStorage.getItem('homepot_rider_email') || '',
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
        {/* Vehicle Information */}
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
