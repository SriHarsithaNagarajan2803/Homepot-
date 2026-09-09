import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePotLogin from './login';
import ChefDashboard from './ChefDashboard';

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  return (
    <Routes>
      {!isAuthenticated ? (
        <Route 
          path="*" 
          element={
            <HomePotLogin 
              onLoginSuccess={(data) => {
                setUserData(data);
                setIsAuthenticated(true);
              }} 
            />
          } 
        />
      ) : (
        <Route 
          path="/*" 
          element={
            <ChefDashboard 
              userData={userData} 
              onLogout={() => {
                setIsAuthenticated(false);
                setUserData(null);
              }}
            />
          } 
        />
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}