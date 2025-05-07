import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log("Retrieved user from localStorage:", user);
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log("Logging in with user data:", userData);
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Here, we're using the 'teacher' flag instead of 'teacherId'
  const isTeacher = currentUser ? currentUser.teacher : false;  // Using 'teacher' instead of 'teacherId'

  console.log("Is Teacher:", isTeacher);

  const value = {
    currentUser,
    isTeacher,  // isTeacher flag
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
