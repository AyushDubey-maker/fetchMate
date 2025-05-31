import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const login = () => setIsLoggedIn(true);

  const logout = () => {
    setIsLoggedIn(false);

    const user = localStorage.getItem('userEmail');
    sessionStorage.removeItem('dogFactShown');

    if (user) {
      localStorage.removeItem(`favorites_${user}`);
      localStorage.removeItem('userEmail');
    }

    fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).catch(err => {
      console.error('Logout failed:', err);
    });
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (res.ok) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isCheckingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
