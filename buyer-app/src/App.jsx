import React, { useState } from 'react';
import Login from './pages/Login';

export default function App() {
  const [userAddress, setUserAddress] = useState('');

  const handleLoginSuccess = (enteredAddress) => {
    alert(`Login Successful! Delivering to: ${enteredAddress || 'Selected Address'}`);
  };

  return (
    <main className="w-full min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center m-0 p-0 overflow-x-hidden font-sans select-none antialiased">
      <Login 
        address={userAddress}
        setAddress={setUserAddress}
        onLoginSuccess={handleLoginSuccess} 
      />
    </main>
  );
}