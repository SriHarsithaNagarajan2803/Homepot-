import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomepotLogo from '../components/HomepotLogo';
import RiderIllustration from '../components/RiderIllustration';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function WelcomeLanding() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="relative min-h-[760px] h-full flex flex-col justify-between items-center bg-[#FAF6EE] text-[#2C231E] px-6 py-6 font-sans">
      {/* Top Header with Language Selector */}
      <div className="w-full flex justify-between items-center pt-2">
        <div className="w-9"></div>
        <HomepotLogo size="lg" showText={false} />
        <LanguageSelector variant="round" />
      </div>

      {/* Main Banner Info */}
      <div className="flex flex-col items-center text-center mt-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C231E] tracking-tight">
          {t('start_your_journey')}
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#6C645E] mt-1.5 max-w-xs">
          {t('deliver_fresh_earn')}
        </p>

        {/* Feature Badges */}
        <div className="flex items-center gap-2.5 mt-3">
          <span className="bg-[#D99436]/15 text-[#9C4A28] border border-[#D99436]/40 px-3 py-1 rounded-full text-xs font-bold">
            {t('daily_earnings_badge')}
          </span>
          <span className="bg-[#505D61]/10 text-[#333C3E] border border-[#505D61]/25 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            {t('live_tracking_badge')}
          </span>
        </div>
      </div>

      {/* 3D Scooter Rider Illustration */}
      <div className="w-full my-4 flex items-center justify-center">
        <RiderIllustration className="w-full max-w-[280px]" />
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs space-y-3 pb-4">
        <button
          onClick={() => navigate('/login?mode=login')}
          className="w-full bg-[#8C4A32] hover:bg-[#783D29] text-white font-bold py-3.5 px-6 rounded-full text-sm tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center"
        >
          {t('login_btn')}
        </button>

        <button
          onClick={() => navigate('/login?mode=signup')}
          className="w-full bg-white hover:bg-[#F4EFE6] text-[#8C4A32] border-2 border-[#8C4A32] font-bold py-3.5 px-6 rounded-full text-sm tracking-wider uppercase transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center"
        >
          {t('join_us_btn')}
        </button>

        <p className="text-[10px] text-center text-[#7C746E] pt-2">
          {t('terms_privacy_notice')}
        </p>
      </div>
    </div>
  );
}
