"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>; // Menambahkan fungsi ini ke interface
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  const setToken = (token: string | null) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      setUser(null);
      return;
    }

    try {
      setAuthLoading(true);
      const response = await authAPI.getMe();
      if (response) {
        setUser(response.data || response); 
      }
    } catch (error) {
      console.warn("Session expired or invalid token");
      setToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.data) {
        setUser(response.data.user);
        setToken(response.data.access_token);
      }
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Login failed");
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register(email, password, name);
      if (response.data) {
        setUser(response.data.user);
        setToken(response.data.access_token);
      }
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Registration failed");
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await authAPI.verifyOtp(email, otp);
      if (response.data) {
        setUser(response.data.user);
        setToken(response.data.access_token);
      }
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("OTP verification failed");
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    authLoading,
    login,
    register,
    logout,
    verifyOtp,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};