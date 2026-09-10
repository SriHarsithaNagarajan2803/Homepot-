import React, { useState } from 'react';
import Login from './pages/Page1_Login';
import HomeFeed from './pages/Page2_HomeFeed';
import FoodDetail from './pages/Page3_FoodDetail';
import Checkout from './pages/Page4_Checkout';
import OrderTracking from './pages/Page5_OrderTracking';
import SpecialRequest from './pages/Page6_SpecialRequest';
import OrdersSuccess from './pages/Page7_OrdersSuccess';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('feed'); // 'feed', 'detail', 'checkout', 'tracking', 'special', 'success'
  const [selectedDish, setSelectedDish] = useState(null);
  const [cart, setCart] = useState([]);

  // Navigation handler to pass to pages
  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
    if (data) setSelectedDish(data);
  };

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
    alert(`Added "${item.title || item.name}" to your Pot! 🍲`);
    setCurrentPage('feed');
  };

  // If user hasn't logged in yet, render Login screen
  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // Render screens based on active currentPage state
  return (
    <div className="min-h-screen bg-[#F7F2EB] text-[#2C1D14] flex justify-center items-center">
      {currentPage === 'feed' && <HomeFeed onNavigate={handleNavigate} />}
      {currentPage === 'detail' && (
        <FoodDetail 
          dish={selectedDish} 
          onBack={() => handleNavigate('feed')} 
          onAddToCart={handleAddToCart} 
        />
      )}
      {currentPage === 'checkout' && (
        <Checkout 
          onBack={() => handleNavigate('feed')} 
          onOrderPlaced={() => handleNavigate('success')} 
        />
      )}
      {currentPage === 'success' && <OrdersSuccess onViewTracking={() => handleNavigate('tracking')} />}
      {currentPage === 'tracking' && <OrderTracking onBack={() => handleNavigate('feed')} />}
      {currentPage === 'special' && <SpecialRequest onBack={() => handleNavigate('feed')} />}
    </div>
  );
}