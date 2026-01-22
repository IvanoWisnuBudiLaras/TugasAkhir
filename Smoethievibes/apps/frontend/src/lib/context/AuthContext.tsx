"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

// Interface tetap sama
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
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  const setToken = (token: string | null) => {
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('access_token', token);
      else localStorage.removeItem('access_token');
    }
  };

  // PENTING: Gunakan useCallback agar fungsi ini stabil
  const checkAuthStatus = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    try {
      setAuthLoading(true);
      const response = await authAPI.getMe();
      
      if (response) {
        // --- BAGIAN YANG DITAMBAHKAN/DIPERBAIKI ---
        // Ini memastikan kita mengambil object user baik itu dibungkus .data atau tidak
        const userData = response.data?.user || response.data || response;
        
        console.log("Auth Check - User Role:", userData.role); // Debugging untuk cek role di console
        
        setUser(userData);
        // ------------------------------------------
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    if (response.data) {
      setToken(response.data.access_token);
      setUser(response.data.user);
      router.push('/');
    }
  };

  const logout = async () => {
    try {
      // Kita panggil API tapi tidak perlu menunggu (await) terlalu lama
      authAPI.logout();
    } finally {
      // Yang paling penting state di client bersih
      setToken(null);
      setUser(null);
      router.replace('/Auth');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authAPI.register(email, password, name);
    if (response.data) {
      setToken(response.data.access_token);
      setUser(response.data.user);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    const response = await authAPI.verifyOtp(email, otp);
    if (response.data) {
      setToken(response.data.access_token);
      setUser(response.data.user);
    }
  };

  const value = {
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