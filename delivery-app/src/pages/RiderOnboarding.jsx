import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Bike, CreditCard, ArrowRight } from 'lucide-react';
import HomepotLogo from '../components/HomepotLogo';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function RiderOnboarding() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [vehicleType, setVehicleType] = useState('electric_scooter');
  const [vehicleNumber, setVehicleNumber] = useState('TN 09 BX 4521');
  const [drivingLicense, setDrivingLicense] = useState('DL-0420110012345');
  const [operatingCity, setOperatingCity] = useState('Chennai - Vadapalani & Anna Nagar');
  
  // Bank & UPI
  const [holderName, setHolderName] = useState('Kumar V.');
  const [accountNumber, setAccountNumber] = useState('98765432101234');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('kumar@okaxis');

  const handleComplete = (e) => {
    e.preventDefault();
    
    const riderProfile = {
      name: localStorage.getItem('homepot_rider_name') || 'Kumar V.',
      phone: localStorage.getItem('homepot_rider_phone') || '9876543210',
      email: localStorage.getItem('homepot_rider_email') || 'kumar.delivery@gmail.com',
      vehicleType,
      vehicleNumber,
      drivingLicense,
      operatingCity,
      bank: {
        holderName,
        accountNumber,
        ifsc,
        upiId
      },
      verified: true
    };

    localStorage.setItem('homepot_rider_profile', JSON.stringify(riderProfile));
    localStorage.setItem('homepot_rider_kyc_completed', 'true');

    navigate('/radar');
  };

  return (
    <div className="relative min-h-[760px] h-full flex flex-col justify-between bg-[#FAF6EE] text-[#333C3E] px-5 py-5 font-sans">
      {/* Top Header */}
      <div className="w-full flex justify-between items-center pb-2">
        <HomepotLogo size="sm" showText={false} />
        <h2 className="font-serif text-base font-bold text-[#8C4A32]">
          {t('rider_kyc_title')}
        </h2>
        <LanguageSelector variant="round" />
      </div>

      <form onSubmit={handleComplete} className="flex-1 space-y-4 max-w-sm mx-auto w-full py-2">
        {/* Section 1: Vehicle & License */}
        <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#8C4A32] font-bold text-xs">
            <Bike size={18} />
            <span>{t('vehicle_info_title')}</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
              {t('vehicle_type')}
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 text-xs text-[#2C231E] focus:outline-none focus:border-[#8C4A32]"
            >
              <option value="electric_scooter">{t('electric_scooter')}</option>
              <option value="petrol_bike">{t('petrol_bike')}</option>
              <option value="bicycle">{t('bicycle')}</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
              {t('vehicle_number')}
            </label>
            <input
              type="text"
              required
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-mono text-[#2C231E] focus:outline-none focus:border-[#8C4A32]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
              {t('driving_license_no')}
            </label>
            <input
              type="text"
              required
              value={drivingLicense}
              onChange={(e) => setDrivingLicense(e.target.value.toUpperCase())}
              className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-mono text-[#2C231E] focus:outline-none focus:border-[#8C4A32]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
              {t('operating_city')}
            </label>
            <input
              type="text"
              required
              value={operatingCity}
              onChange={(e) => setOperatingCity(e.target.value)}
              className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 text-xs text-[#2C231E] focus:outline-none focus:border-[#8C4A32]"
            />
          </div>
        </div>

        {/* Section 2: Bank & UPI Settlements */}
        <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#8C4A32] font-bold text-xs">
            <CreditCard size={18} />
            <span>{t('bank_payout_title')}</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
              {t('account_holder_name')}
            </label>
            <input
              type="text"
              required
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 text-xs text-[#2C231E] focus:outline-none focus:border-[#8C4A32]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
                {t('bank_account_number')}
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-mono text-[#2C231E] focus:outline-none focus:border-[#8C4A32]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
                {t('ifsc_code')}
              </label>
              <input
                type="text"
                required
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-mono text-[#2C231E] focus:outline-none focus:border-[#8C4A32]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
              {t('upi_id_label')}
            </label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. mobile@okaxis / upi"
              className="w-full bg-white border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-mono text-[#2C231E] focus:outline-none focus:border-[#8C4A32]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3.5 px-6 rounded-full text-sm tracking-wide transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{t('complete_onboarding_btn')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
