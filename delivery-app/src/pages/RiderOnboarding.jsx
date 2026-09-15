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
    
    // Save to localStorage
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
          {t('step_2c_title')}
        </h2>
        <LanguageSelector variant="round" />
      </div>

      {/* Form Container */}
      <form onSubmit={handleComplete} className="flex-1 overflow-y-auto space-y-4 pt-2 pr-1">
        
        {/* Vehicle Information */}
        <div className="bg-white border border-[#EADBCC] rounded-3xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#8C4A32] font-bold text-xs mb-3 border-b border-[#EADBCC] pb-2">
            <Bike size={16} />
            <span>{t('vehicle_info_title')}</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
                {t('vehicle_type')}
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-medium text-[#2C231E]"
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
                placeholder="TN 09 BX 4521"
                className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase text-[#2C231E]"
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
                placeholder="DL-0420110012345"
                className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase text-[#2C231E]"
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
                className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-medium text-[#2C231E]"
              />
            </div>
          </div>
        </div>

        {/* Bank & UPI Details */}
        <div className="bg-white border border-[#EADBCC] rounded-3xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#8C4A32] font-bold text-xs mb-3 border-b border-[#EADBCC] pb-2">
            <CreditCard size={16} />
            <span>{t('bank_payout_title')}</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
                {t('account_holder_name')}
              </label>
              <input
                type="text"
                required
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl px-3 py-2 text-xs text-[#2C231E] font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
                {t('bank_account_number')}
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-mono text-[#2C231E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#6C645E] mb-1">
                  {t('ifsc_code')}
                </label>
                <input
                  type="text"
                  required
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-mono uppercase text-[#2C231E]"
                />
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
                  placeholder="kumar@okaxis"
                  className="w-full bg-[#FAF6EE] border border-[#EADBCC] rounded-xl px-3 py-2 text-xs font-mono text-[#2C231E]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Complete button */}
        <button
          type="submit"
          className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3.5 px-6 rounded-full text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>{t('complete_onboarding_btn')}</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
