import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import WelcomeLanding from './pages/WelcomeLanding';
import RiderLogin from './pages/RiderLogin';
import RiderOnboarding from './pages/RiderOnboarding';
import OrderRadar from './pages/OrderRadar';
import RiderProfile from './pages/RiderProfile';
import RiderPayout from './pages/RiderPayout';
import DeviceFrame from './components/DeviceFrame';
import { LanguageProvider } from './context/LanguageContext';

function AppRoutes() {
  const location = useLocation();

  const getScreenName = (pathname) => {
    switch (pathname) {
      case '/':
        return '1. Welcome Landing (Reference Image 3)';
      case '/login':
        return '2. Rider Auth & OTP (Reference Image 4)';
      case '/onboarding':
        return '3. Rider KYC & Bank Setup';
      case '/radar':
        return '4 & 5. Order Radar & History (Reference Image 2 & 5)';
      case '/profile':
        return '6. Rider Profile & SOS (Reference Image 1)';
      case '/payout':
        return '7. Rider Payouts';
      default:
        return 'HomePot Delivery Partner';
    }
  };

  return (
    <DeviceFrame currentScreenName={getScreenName(location.pathname)}>
      <Routes>
        <Route path="/" element={<WelcomeLanding />} />
        <Route path="/login" element={<RiderLogin />} />
        <Route path="/onboarding" element={<RiderOnboarding />} />
        <Route path="/radar" element={<OrderRadar />} />
        <Route path="/profile" element={<RiderProfile />} />
        <Route path="/payout" element={<RiderPayout />} />
      </Routes>
    </DeviceFrame>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}
