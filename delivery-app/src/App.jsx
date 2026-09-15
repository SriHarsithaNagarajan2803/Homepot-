import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomeLanding from './pages/WelcomeLanding';
import RiderLogin from './pages/RiderLogin';
import RiderOnboarding from './pages/RiderOnboarding';
import OrderRadar from './pages/OrderRadar';
import RiderProfile from './pages/RiderProfile';
import RiderPayout from './pages/RiderPayout';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#FAF6EE] text-[#2C231E] flex flex-col items-center justify-start w-full">
        {/* Main Content Area - Clean responsive container that naturally adapts to any device without fake phone frames */}
        <main className="w-full max-w-md min-h-screen bg-[#FAF6EE] flex flex-col relative transition-all">
          <Routes>
            <Route path="/" element={<WelcomeLanding />} />
            <Route path="/login" element={<RiderLogin />} />
            <Route path="/onboarding" element={<RiderOnboarding />} />
            <Route path="/radar" element={<OrderRadar />} />
            <Route path="/profile" element={<RiderProfile />} />
            <Route path="/payout" element={<RiderPayout />} />
          </Routes>
        </main>
      </div>
    </LanguageProvider>
  );
}
