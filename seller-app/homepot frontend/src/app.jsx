import React, { useState } from 'react';
import Login from './components/Login';
import KitchenRegistration from './components/KitchenRegistration';

export default function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register' | 'dashboard'
  const [chefData, setChefData] = useState(null);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={(data) => {
            setChefData(data);
            setCurrentView('dashboard');
          }}
          onSwitchToRegister={() => setCurrentView('register')}
        />
      )}

      {currentView === 'register' && (
        <KitchenRegistration 
          onBackToLogin={() => setCurrentView('login')}
          onRegistrationSuccess={(data) => {
            setChefData(data);
            setCurrentView('dashboard');
          }}
        />
      )}

      {currentView === 'dashboard' && (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-bold text-[#8B4513] mb-4">Welcome to HomePot Dashboard!</h1>
          <p className="text-gray-600 mb-6">Kitchen session successfully established.</p>
          <button 
            onClick={() => setCurrentView('login')}
            className="px-6 py-2.5 bg-[#8B4513] text-white rounded-xl text-sm font-bold shadow"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}