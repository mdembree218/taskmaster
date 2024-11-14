import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setAuth({ token });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('jwt', token);
    setAuth({ token });
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setAuth(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };