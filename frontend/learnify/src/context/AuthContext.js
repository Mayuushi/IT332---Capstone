import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // For demo purposes, we'll use localStorage to persist the user
  // In a real application, you'd use proper authentication
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const isTeacher = currentUser ? currentUser.teacher : false; // Check if user is a teacher

  const value = {
    currentUser,
    isTeacher,  // Adding isTeacher as part of the context
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
