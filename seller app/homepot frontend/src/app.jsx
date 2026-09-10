import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePotLogin from './login';
import { HomePotKitchenRegistration } from './components/kitchenregistration';
import { HomePotBankingSetup } from './components/BankingSetup';
import ChefDashboard from './ChefDashboard';

function AppRoutes() {
  const [currentStep, setCurrentStep] = useState('login'); // 'login', 'register_kitchen', 'banking_setup', 'dashboard'
  const [userData, setUserData] = useState(null);
  const [registrationData, setRegistrationData] = useState({});

  // 1. SIGN IN / SIGN UP (WITH OTP)
  if (currentStep === 'login') {
    return (
      <HomePotLogin 
        onLoginSuccess={(data) => {
          setUserData(data);
          setCurrentStep('dashboard');
        }}
        onStartRegistration={(data) => {
          setRegistrationData(data);
          setCurrentStep('register_kitchen');
        }}
      />
    );
  }

  // 2. KITCHEN DETAILS REGISTRATION (Page 1)
  if (currentStep === 'register_kitchen') {
    return (
      <HomePotKitchenRegistration 
        initialData={registrationData}
        onProceedToBanking={(kitchenData) => {
          setRegistrationData(prev => ({ ...prev, ...kitchenData }));
          setCurrentStep('banking_setup');
        }}
        onBackToLogin={() => setCurrentStep('login')}
      />
    );
  }

  // 3. BANKING & PAYOUTS SETUP (Page 4 setup)
  if (currentStep === 'banking_setup') {
    return (
      <HomePotBankingSetup 
        initialData={registrationData}
        onCompleteOnboarding={(completeData) => {
          const profile = {
            chefName: completeData.kitchenName || completeData.ownerName || 'Home Kitchen',
            handle: completeData.ownerName 
              ? completeData.ownerName.toLowerCase().replace(/[^a-z0-9]/g, '_') 
              : completeData.kitchenName 
                ? completeData.kitchenName.toLowerCase().replace(/[^a-z0-9]/g, '_') 
                : 'home_chef',
            ...completeData
          };
          localStorage.setItem('homepot_chef_profile', JSON.stringify(profile));
          setUserData(profile);
          setCurrentStep('dashboard');
        }}
        onBack={() => setCurrentStep('register_kitchen')}
      />
    );
  }

  // 4. ACTIVE CHEF DASHBOARD (Live Orders, Menu, Bankings, Profile)
  return (
    <Routes>
      <Route 
        path="/*" 
        element={
          <ChefDashboard 
            userData={userData} 
            onLogout={() => {
              setUserData(null);
              setCurrentStep('login');
            }}
          />
        } 
      />
    </Routes>
  );
}

import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  );
}