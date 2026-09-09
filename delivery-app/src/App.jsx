import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import WelcomeLanding from './pages/WelcomeLanding';
import RiderLogin from './pages/RiderLogin';
import OrderRadar from './pages/OrderRadar';
import RiderProfile from './pages/RiderProfile';
import RiderPayout from './pages/RiderPayout';
import DeviceFrame from './components/DeviceFrame';

export default function App() {
  const location = useLocation();

  const getScreenName = (pathname) => {
    switch (pathname) {
      case '/':
        return '1. Welcome Landing (page1)';
      case '/login':
        return '2. Auth & OTP (page 2)';
      case '/radar':
        return '3 & 4. Order Radar & History (page3 & 4)';
      case '/profile':
        return '5. Rider Profile & Settings (page6)';
      case '/payout':
        return '6. Rider Payouts';
      default:
        return 'HomePot Delivery';
    }
  };

  return (
    <DeviceFrame currentScreenName={getScreenName(location.pathname)}>
      <Routes>
        <Route path="/" element={<WelcomeLanding />} />
        <Route path="/login" element={<RiderLogin />} />
        <Route path="/radar" element={<OrderRadar />} />
        <Route path="/profile" element={<RiderProfile />} />
        <Route path="/payout" element={<RiderPayout />} />
      </Routes>
    </DeviceFrame>
  );
}
