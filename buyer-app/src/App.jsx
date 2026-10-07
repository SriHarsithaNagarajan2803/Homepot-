import React, { useState } from 'react';
import Login from './pages/Page1_Login';
import HomeFeed from './pages/Page2_HomeFeed';
import FoodDetail from './pages/Page3_FoodDetail';
import Checkout from './pages/Page4_Checkout';
import OrderTracking from './pages/Page5_OrderTracking';
import Profile from './pages/Page8_Profile';
import BottomNav from './components/BottomNav';
import BuyerSplashScreen from './components/BuyerSplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('homepot_buyer_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('homepot_buyer_user');
    return saved ? 'feed' : 'auth';
  });

  const [historyStack, setHistoryStack] = useState(() => {
    const saved = localStorage.getItem('homepot_buyer_user');
    return saved ? ['feed'] : ['auth'];
  });

  const [selectedDish, setSelectedDish] = useState(null);
  const [cart, setCart] = useState([]);
  
  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('homepot_buyer_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.address) return u.address;
      }
    } catch (e) {}
    return 'Choose your location';
  });

  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.address) setSelectedLocation(userData.address);
    setCurrentPage('feed');
    setHistoryStack(['feed']);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out of HomePot?');
    if (confirmLogout) {
      localStorage.removeItem('homepot_buyer_user');
      setCurrentUser(null);
      setCart([]);
      setActiveOrder(null);
      setCurrentPage('auth');
      setHistoryStack(['auth']);
    }
  };

  const handleNavigate = (page, data = null) => {
    setHistoryStack(prev => [...prev, page]);
    setCurrentPage(page);
    if (data) setSelectedDish(data);
  };

  const handleBack = () => {
    if (historyStack.length > 1) {
      const nextStack = [...historyStack];
      nextStack.pop();
      const prevPage = nextStack[nextStack.length - 1];
      setHistoryStack(nextStack);
      setCurrentPage(prevPage);
    } else {
      if (currentUser) {
        setCurrentPage('feed');
        setHistoryStack(['feed']);
      } else {
        setCurrentPage('auth');
        setHistoryStack(['auth']);
      }
    }
  };

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: (c.quantity || 1) + (item.quantity || 1) } : c);
      }
      return [...prev, item];
    });
  };

  const handleOrderPlaced = (orderData) => {
    setActiveOrder(orderData);
    setOrderHistory(prev => [
      {
        id: orderData.id,
        date: orderData.date,
        dish: orderData.items[0]?.title || 'Homepot Special',
        chef: orderData.items[0]?.chef || 'Radha Amma',
        amount: orderData.totalAmount,
        status: 'COOKING',
        itemsCount: orderData.items.length
      },
      ...prev
    ]);
    setCart([]);
    handleNavigate('tracking', orderData);
  };

  const handleReorder = (pastOrder) => {
    handleAddToCart({
      id: Math.floor(Math.random() * 1000),
      title: pastOrder.dish,
      price: 100,
      quantity: 1,
      chef: pastOrder.chef
    });
    handleNavigate('checkout');
  };

  const totalCartCount = cart.reduce((acc, i) => acc + (i.quantity || 1), 0);
  
  // BottomNav is ALWAYS visible for logged-in buyers across Menu, My Tiffin, Profile, Detail, etc.
  const showBottomNav = currentUser && currentPage !== 'auth';

  // If splash is active, render exclusively in an unscrollable full-screen viewport
  if (showSplash) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#FAF6EE] flex items-center justify-center overflow-hidden select-none z-50">
        <BuyerSplashScreen onFinish={() => setShowSplash(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-stone-900 flex flex-col items-center justify-start w-full">
      <main className="w-full max-w-[500px] sm:max-w-[520px] min-h-screen bg-[#FAF6EE] flex flex-col justify-between relative shadow-2xl overflow-hidden">

        {/* Scrollable Content Container with clean bottom margin for BottomNav */}
        <div className={`flex flex-col flex-1 relative z-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${showBottomNav ? 'pb-14' : ''}`}>

          {currentPage === 'auth' && (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}

          {currentPage === 'feed' && (
            <HomeFeed 
              onNavigate={handleNavigate}
              onAddToCart={handleAddToCart}
              cart={cart}
              selectedLocation={selectedLocation}
              onChangeLocation={setSelectedLocation}
            />
          )}

          {currentPage === 'detail' && (
            <FoodDetail 
              dish={selectedDish} 
              onBack={handleBack} 
              onAddToCart={handleAddToCart}
              onBookNow={() => handleNavigate('checkout')}
            />
          )}

          {currentPage === 'checkout' && (
            <Checkout 
              cart={cart}
              selectedLocation={selectedLocation}
              onBack={handleBack} 
              onOrderPlaced={handleOrderPlaced}
            />
          )}

          {currentPage === 'tracking' && (
            <OrderTracking 
              order={activeOrder}
              onBack={() => handleNavigate('feed')} 
            />
          )}

          {currentPage === 'profile' && (
            <Profile 
              currentUser={currentUser}
              onLogout={handleLogout}
              onBack={() => handleNavigate('feed')}
              activeOrder={activeOrder}
              orderHistory={orderHistory}
              onTrackOrder={() => handleNavigate('tracking')}
              onReorder={handleReorder}
            />
          )}
        </div>

        {/* Persistent Bottom Navigation - Always visible and never obscured */}
        {showBottomNav && (
          <BottomNav 
            activeTab={currentPage} 
            onSelectTab={(tab) => {
              setHistoryStack(['feed']);
              setCurrentPage(tab);
            }} 
            cartCount={totalCartCount}
          />
        )}

      </main>
    </div>
  );
}
