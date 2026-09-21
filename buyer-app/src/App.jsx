import React, { useState, useEffect } from 'react';
import Login from './pages/Page1_Login';
import HomeFeed from './pages/Page2_HomeFeed';
import FoodDetail from './pages/Page3_FoodDetail';
import Checkout from './pages/Page4_Checkout';
import OrderTracking from './pages/Page5_OrderTracking';
import Profile from './pages/Page8_Profile';
import BottomNav from './components/BottomNav';

export default function App() {
  // Check if buyer user is already signed in
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('homepot_buyer_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Navigation stack & state (defaults to 'auth' if not logged in!)
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
        return u.address || 'Anna Nagar, Chennai';
      }
    } catch (e) {}
    return 'Anna Nagar, Chennai';
  });
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  // When user successfully signs up or logs in with OTP
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.address) setSelectedLocation(userData.address);
    setCurrentPage('feed');
    setHistoryStack(['feed']);
  };

  // When user clicks Log Out
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

  // Navigate forward with history stack
  const handleNavigate = (page, data = null) => {
    setHistoryStack(prev => [...prev, page]);
    setCurrentPage(page);
    if (data) setSelectedDish(data);
  };

  // Back button handler: Always returns to exact previous screen!
  const handleBack = () => {
    if (historyStack.length > 1) {
      const nextStack = [...historyStack];
      nextStack.pop(); // remove current
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

  // Show BottomNav only on primary tabs ('feed', 'profile') when authenticated
  const showBottomNav = currentUser && (currentPage === 'feed' || currentPage === 'profile');

  return (
    <div 
      className="min-h-screen w-full flex justify-center items-center py-0 sm:py-4 px-0 sm:px-4"
      style={{ backgroundColor: '#EFE9DF', colorScheme: 'light' }}
    >
      {/* Mobile Card Frame */}
      <div 
        className="w-full max-w-md h-screen sm:h-[92vh] sm:max-h-[850px] sm:border sm:border-[#E8DEC8] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-y-auto relative text-stone-900"
        style={{ backgroundColor: '#FAF6EE', colorScheme: 'light' }}
      >
        
        {/* Soft Dot Overlay */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#D6C7B2 1.2px, transparent 1.2px)',
            backgroundSize: '20px 20px'
          }}
        ></div>

        {/* Content Container */}
        <div className="flex flex-col flex-1 relative z-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
          {/* Auth Screen: Sign Up & Sign In with OTP */}
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

        {/* Persistent Bottom Navigation (Only on Feed and Profile) */}
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

      </div>
    </div>
  );
}
