import React, { useState } from "react";
import { HomePotLogin } from "./components/login.jsx";
import { HomePotKitchenRegistration } from "./components/kitchenregistration.jsx";
export default function App() {
  const [currentView, setCurrentView] = useState('login');

  return (
    <div className="min-h-screen bg-[#fbf7f0] font-sans">
      {currentView === 'login' ? (
        <HomePotLogin 
          onNavigateToRegister={() => setCurrentView('register')} 
        />
      ) : (
        <HomePotKitchenRegistration 
          onBackToLogin={() => setCurrentView('login')} 
        />
      )}
    </div>
  );
}


