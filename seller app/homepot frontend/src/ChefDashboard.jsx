import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Import your views from the components folder
import LiveOrders from './components/LiveOrders';
import Menu from './components/Menu';
import Bankings from './components/Bankings';
import Profile from './components/profile';

// Import your logo from the assets folder
import logoImg from './assets/logo.jpeg'; 

// ==========================================
// Persistent Bottom Navigation Component
// ==========================================
function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#5E2B1B] text-amber-200/70 py-3 px-6 flex justify-around items-center border-t border-[#783D29] rounded-t-2xl shadow-2xl z-20">
      <Link 
        to="/" 
        className={`flex flex-col items-center transition ${currentPath === '/' ? 'text-amber-100 scale-105 font-bold' : 'hover:text-amber-100 font-medium'}`}
      >
        <i className="fa-solid fa-clipboard-list text-xl mb-0.5"></i>
        <span className="text-[10px]">Live Orders</span>
      </Link>
      
      <Link 
        to="/menu" 
        className={`flex flex-col items-center transition ${currentPath === '/menu' ? 'text-amber-100 scale-105 font-bold' : 'hover:text-amber-100 font-medium'}`}
      >
        <i className="fa-solid fa-book-open text-lg mb-0.5"></i>
        <span className="text-[10px]">Menu</span>
      </Link>
      
      <Link 
        to="/bankings" 
        className={`flex flex-col items-center transition ${currentPath === '/bankings' ? 'text-amber-100 scale-105 font-bold' : 'hover:text-amber-100 font-medium'}`}
      >
        <i className="fa-solid fa-wallet text-lg mb-0.5"></i>
        <span className="text-[10px]">Bankings</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={`flex flex-col items-center transition ${currentPath === '/profile' ? 'text-amber-100 scale-105 font-bold' : 'hover:text-amber-100 font-medium'}`}
      >
        <i className="fa-solid fa-user text-lg mb-0.5"></i>
        <span className="text-[10px]">Profile</span>
      </Link>
    </div>
  );
}

// ==========================================
// Central Chef Dashboard Hub
// ==========================================
export default function ChefDashboard({ userData, onLogout }) {
  // Load dynamic profile details from localStorage so header syncs with Profile changes
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('homepot_chef_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved profile:", e);
      }
    }
    return {
      chefName: userData?.name || userData?.kitchenName || 'Chef Varun',
      handle: '_lyf_of_mr_v_20'
    };
  });

  // Listen for storage changes or profile updates across components
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('homepot_chef_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setProfile(parsed);
          }
        } catch (e) {
          console.error("Failed to parse profile update:", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Main Modals State
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dynamic Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Settings Interactive States
  const [pushEnabled, setPushEnabled] = useState(true);
  const [autoAcceptEnabled, setAutoAcceptEnabled] = useState(false);

  // Delete Account with Apps Script OTP States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Your deployed Google Apps Script Web App URL
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwfkWrJhWyX0M1TZjEylnF01rfseSNxKZ1STN3CkR1csM1LhNZ0hb5AsxlgtJNF0bN/exec';

  const addNotification = (title, message) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      time: 'Just now'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  useEffect(() => {
    const handleOrderEvent = (event) => {
      const { action, orderId, details } = event.detail;
      if (action === 'ACCEPTED') {
        addNotification(`Order Accepted #${orderId}`, `You accepted order #${orderId}. ${details || ''}`);
      } else if (action === 'REJECTED') {
        addNotification(`Order Rejected #${orderId}`, `Order #${orderId} was rejected. ${details || ''}`);
      }
    };

    window.addEventListener('homepotOrderAction', handleOrderEvent);
    return () => window.removeEventListener('homepotOrderAction', handleOrderEvent);
  }, []);

  const handleOpenNotifications = () => {
    setIsNotificationOpen(true);
    setUnreadCount(0);
  };

  const handleLogOut = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out of Chef?');
    if (confirmLogout) {
      setIsSettingsOpen(false);
      if (onLogout) onLogout(); 
    }
  };

  const handleSendOtp = async () => {
    if (!deleteEmail || !deleteEmail.includes('@')) {
      alert('Please enter a valid registered email address.');
      return;
    }

    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setIsSendingOtp(true);

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: deleteEmail,
          otp: mockOtp,
        }),
      });

      setOtpSent(true);
      alert(`Verification code sent to ${deleteEmail}. Please check your inbox.`);
    } catch (error) {
      console.error('Error sending OTP via Apps Script:', error);
      alert('Failed to send verification code. Please check your network connection.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAndDelete = () => {
    if (enteredOtp.trim() === generatedOtp) {
      alert('Account verified successfully. Your Chef account has been permanently deleted.');
      setShowDeleteModal(false);
      setIsSettingsOpen(false);
      setOtpSent(false);
      setDeleteEmail('');
      setEnteredOtp('');
      if (onLogout) onLogout(); 
    } else {
      alert('Invalid OTP code. Please check and try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f4eee6] p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#FAF6F0] min-h-screen sm:min-h-[850px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative pb-24">

        {/* Top Header Section */}
        <div className="bg-[#8C4A32] text-white pt-6 pb-12 px-6 rounded-b-[40px] relative shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold tracking-tight">HomePot <span className="font-normal text-orange-200">Chef</span></h1>
            
            <div className="flex items-center space-x-2 text-lg">
              <button 
                onClick={handleOpenNotifications}
                className="w-9 h-9 rounded-full bg-[#A85E45] flex items-center justify-center hover:bg-[#783D29] transition relative cursor-pointer"
                title="Notifications"
              >
                <i className="fa-regular fa-bell"></i>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-300 rounded-full border border-[#8C4A32]"></span>
                )}
              </button>

              <button 
                onClick={() => setIsHelpOpen(true)}
                className="w-9 h-9 rounded-full bg-[#A85E45] flex items-center justify-center hover:bg-[#783D29] transition cursor-pointer"
                title="Help & Support"
              >
                <i className="fa-regular fa-circle-question"></i>
              </button>

              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-9 h-9 rounded-full bg-[#A85E45] flex items-center justify-center hover:bg-[#783D29] transition cursor-pointer"
                title="Settings"
              >
                <i className="fa-solid fa-gear"></i>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-2">
            <div className="w-16 h-16 bg-[#A85E45] rounded-full flex items-center justify-center shadow-inner relative border-2 border-[#C27357] overflow-hidden">
              <img src={logoImg} alt="HomePot Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            
            <p className="text-xs text-orange-100 font-bold mt-1.5">
              {profile.chefName} <span className="font-normal text-orange-200/80">(@{profile.handle})</span>
            </p>
          </div>
        </div>

        {/* Dynamic Component Viewport Area */}
        <div className="flex-1 bg-[#fdfbf7] px-4 -mt-6 pt-2 rounded-t-[35px] flex flex-col gap-5 z-10 overflow-y-auto">
          <Routes>
            <Route path="/" element={<LiveOrders />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/bankings" element={<Bankings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav />

        {/* NOTIFICATION MODAL */}
        {isNotificationOpen && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-orange-100 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <h3 className="font-bold text-stone-800 text-lg flex items-center gap-2">
                  <i className="fa-regular fa-bell text-[#8C4A32]"></i> Notifications
                </h3>
                <button 
                  onClick={() => setIsNotificationOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              
              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs">
                    <i className="fa-regular fa-bell-slash text-2xl mb-2 block"></i>
                    No new order notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="bg-orange-50/70 p-3 rounded-2xl border border-orange-100">
                      <p className="text-xs font-bold text-stone-800">{n.title}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">{n.message}</p>
                      <span className="text-[9px] text-orange-700 font-semibold mt-2 block">{n.time}</span>
                    </div>
                  ))
                )}
              </div>

              <button 
                onClick={() => setIsNotificationOpen(false)}
                className="w-full bg-[#8C4A32] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#783D29] transition shadow-sm mt-2 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* HELP & SUPPORT MODAL */}
        {isHelpOpen && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-orange-100 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <h3 className="font-bold text-stone-800 text-lg flex items-center gap-2">
                  <i className="fa-regular fa-circle-question text-[#8C4A32]"></i> Help & Support
                </h3>
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              
              <div className="flex flex-col gap-3 text-xs text-stone-600 leading-relaxed">
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <p className="font-bold text-stone-800 mb-1">How to accept orders?</p>
                  <p>Go to the <b>Live Orders</b> tab, view incoming orders for your meal slot, and click the green <b>Accept Order</b> button.</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <p className="font-bold text-stone-800 mb-1">Need assistance or have queries?</p>
                  <p>Reach out to us anytime at <a href="mailto:homepotapp@gmail.com" className="text-[#8C4A32] font-bold underline">homepotapp@gmail.com</a>.</p>
                </div>
              </div>

              <button 
                onClick={() => setIsHelpOpen(false)}
                className="w-full bg-[#8C4A32] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#783D29] transition shadow-sm mt-2 cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}

        {/* SETTINGS MODAL */}
        {isSettingsOpen && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-orange-100 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <h3 className="font-bold text-stone-800 text-lg flex items-center gap-2">
                  <i className="fa-solid fa-gear text-[#8C4A32]"></i> Chef Settings
                </h3>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              
              <div className="flex flex-col gap-3 text-xs text-stone-700">
                <div className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <div>
                    <p className="font-bold text-stone-900">Push Notifications</p>
                    <p className="text-[10px] text-stone-500">Receive alerts for new orders</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={pushEnabled} 
                    onChange={(e) => setPushEnabled(e.target.checked)} 
                    className="accent-[#8C4A32] w-4 h-4 cursor-pointer" 
                  />
                </div>

                <div className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <div>
                    <p className="font-bold text-stone-900">Auto-Accept Orders</p>
                    <p className="text-[10px] text-stone-500">Automatically accept ready slots</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoAcceptEnabled} 
                    onChange={(e) => setAutoAcceptEnabled(e.target.checked)} 
                    className="accent-[#8C4A32] w-4 h-4 cursor-pointer" 
                  />
                </div>

                <div 
                  onClick={handleLogOut} 
                  className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-center cursor-pointer hover:bg-amber-100 transition mt-1"
                >
                  <p className="font-bold text-amber-800">Log Out</p>
                </div>

                <div 
                  onClick={() => setShowDeleteModal(true)} 
                  className="bg-rose-50 p-3 rounded-2xl border border-rose-100 text-center cursor-pointer hover:bg-rose-100 transition"
                >
                  <p className="font-bold text-rose-600">Delete Account</p>
                </div>
              </div>

              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-[#8C4A32] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#783D29] transition shadow-sm mt-1 cursor-pointer"
              >
                Save & Close
              </button>
            </div>
          </div>
        )}

        {/* DELETE ACCOUNT MODAL */}
        {showDeleteModal && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-rose-200 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <h3 className="font-bold text-rose-600 text-base flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i> Delete Account
                </h3>
                <button 
                  onClick={() => { setShowDeleteModal(false); setOtpSent(false); setDeleteEmail(''); setEnteredOtp(''); }}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="text-xs text-stone-600 space-y-3">
                <p className="leading-relaxed">
                  This action is permanent and will delete all your chef profile data, menu lists, and earnings history. Verify your email to proceed.
                </p>

                {!otpSent ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-stone-700 text-[11px]">Registered Email Address</label>
                    <input 
                      type="email" 
                      placeholder="chef@example.com" 
                      value={deleteEmail}
                      onChange={(e) => setDeleteEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-[#8C4A32]"
                    />
                    <button 
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold transition shadow-sm mt-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSendingOtp ? 'Sending Code...' : 'Send Verification OTP'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-[11px] text-emerald-700 font-bold">6-digit OTP code sent to {deleteEmail}</p>
                    <label className="font-bold text-stone-700 text-[11px]">Enter 6-Digit OTP</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      placeholder="123456" 
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs tracking-widest text-center font-bold focus:outline-none focus:border-[#8C4A32]"
                    />
                    <button 
                      onClick={handleVerifyAndDelete}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold transition shadow-sm mt-2 cursor-pointer"
                    >
                      Verify & Permanently Delete
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}