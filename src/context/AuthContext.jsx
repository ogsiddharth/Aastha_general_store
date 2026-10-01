import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, ADMIN_CONFIG } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Subscribe to auth session changes (Firebase Auth state + local storage)
    const unsubscribe = authService.subscribe((currentSession) => {
      setUser(currentSession);
    });
    return unsubscribe;
  }, []);

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(usernameOrEmail, password);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (usernameOrEmail, password) => {
    setLoading(true);
    try {
      const adminSession = await authService.adminLogin(usernameOrEmail, password);
      setUser(adminSession);
      return adminSession;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const registeredUser = await authService.register(userData);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    if (!user) throw new Error('No user is currently signed in.');
    const userId = user.id || user.uid;
    const updated = await authService.updateUserProfile(userId, updateData);
    setUser(updated);
    return updated;
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error('No user is currently signed in.');
    const userId = user.id || user.uid;
    return await authService.changePassword(userId, currentPassword, newPassword);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin' || user?.email === ADMIN_CONFIG.email,
    loading,
    login,
    adminLogin,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
