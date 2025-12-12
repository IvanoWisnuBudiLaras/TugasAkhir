"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  verifyOtp: (email: string, otp: string) => Promise<void>;
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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthLoading(true);
      const response = await authAPI.getMe();
      if (response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Log error yang sebenarnya, bukan "Not authenticated"
      console.error("Error checking auth status:", error);
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
      }
    } catch (error) {
      console.error("Login error:", error);
      // Ensure the error is thrown with the correct message for OTP detection
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Login failed");
      }
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register(email, password, name);
      if (response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Register error:", error);
      // Ensure the error is thrown with the correct message for OTP detection
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Registration failed");
      }
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await authAPI.verifyOtp(email, otp);
      if (response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      // Ensure the error is thrown with the correct message
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("OTP verification failed");
      }
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};