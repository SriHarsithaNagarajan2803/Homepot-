import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomeLanding from './pages/WelcomeLanding';
import RiderLogin from './pages/RiderLogin';
import RiderOnboarding from './pages/RiderOnboarding';
import OrderRadar from './pages/OrderRadar';
import RouteMap from './pages/RouteMap';
import RiderProfile from './pages/RiderProfile';
import RiderPayout from './pages/RiderPayout';
import ChefPickup from './pages/ChefPickup';
import CustomerDrop from './pages/CustomerDrop';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#FAF6EE] text-[#2C231E] flex flex-col items-center justify-start w-full">
        <main className="w-full max-w-[500px] sm:max-w-[520px] min-h-screen bg-[#FAF6EE] flex flex-col relative transition-all shadow-2xl">
          <Routes>
            <Route path="/" element={<WelcomeLanding />} />
            <Route path="/login" element={<RiderLogin />} />
            <Route path="/onboarding" element={<RiderOnboarding />} />
            <Route path="/radar" element={<OrderRadar />} />
            <Route path="/chef-pickup" element={<ChefPickup />} />
            <Route path="/customer-drop" element={<CustomerDrop />} />
            <Route path="/route" element={<RouteMap />} />
            <Route path="/profile" element={<RiderProfile />} />
            <Route path="/payout" element={<RiderPayout />} />
          </Routes>
        </main>
      </div>
    </LanguageProvider>
  );
}
