"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Validasi input
    if (!email || !password) {
      alert("Please fill in all required fields");
      return;
    }

    // Validasi email format
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (isSignUp) {
      if (!name || !phone) {
        alert("Please fill in all required fields");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
      }
      // Validasi nomor telepon (hanya angka dan simbol umum)
      const phoneRegex = /^[\+\d\s\-\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        alert("Please enter a valid phone number");
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        console.log("Register request:", { email, password, name, phone });
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            name,
            phone,
          }),
        });

        console.log("Register response status:", response.status);
        
        // Coba parse JSON, tapi siapkan fallback jika gagal
        let data;
        try {
          data = await response.json();
          console.log("Register response data:", data);
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError);
          // Jika gagal parse JSON, berarti mungkin network error atau response bukan JSON
          if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
          } else {
            throw new Error("Invalid response from server");
          }
        }

        if (!response.ok) {
          // Tangani error spesifik dari backend
          if (response.status === 400) {
            throw new Error(data?.message || "Invalid input data. Please check your information.");
          } else if (response.status === 409) {
            throw new Error("Email already exists. Please use a different email.");
          } else if (response.status === 500) {
            throw new Error("Server error. Please try again later.");
          } else {
            throw new Error(data?.message || data?.error || `Registration failed: ${response.status}`);
          }
        }

        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("Registration successful! Welcome to Smoethievibes!");
          router.push("/");
        } else {
          throw new Error("No access token received");
        }
      } else {
        console.log("Login request:", { email, password });
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        console.log("Login response status:", response.status);
        
        // Coba parse JSON, tapi siapkan fallback jika gagal
        let data;
        try {
          data = await response.json();
          console.log("Login response data:", data);
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError);
          // Jika gagal parse JSON, berarti mungkin network error atau response bukan JSON
          if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
          } else {
            throw new Error("Invalid response from server");
          }
        }

        if (!response.ok) {
          // Tangani error spesifik dari backend
          if (response.status === 401) {
            throw new Error("Invalid email or password. Please try again.");
          } else if (response.status === 400) {
            throw new Error("Please provide valid email and password.");
          } else if (response.status === 500) {
            // Backend mengembalikan 500 untuk invalid credentials, cek pesan error
            if (data?.message?.includes("Invalid credentials") || data?.error?.includes("Invalid credentials")) {
              throw new Error("Invalid email or password. Please try again.");
            } else {
              throw new Error("Server error. Please try again later.");
            }
          } else {
            throw new Error(data?.message || data?.error || `Login failed: ${response.status}`);
          }
        }

        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert(`Welcome back, ${data.user.name || data.user.email}!`);
          router.push("/");
        } else {
          throw new Error("No access token received");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Jangan log err.response karena bisa undefined
      if (err.response) {
        console.error("Error response:", err.response);
      }
      
      // Error handling yang lebih spesifik
      let errorMessage = "An error occurred. Please try again.";
      
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="
          w-full max-w-5xl
          bg-white/70 backdrop-blur-2xl
          shadow-[0_30px_60px_rgba(0,0,0,0.08)]
          rounded-[2rem]
          border border-black/10
          overflow-hidden flex
        "
      >
        {/* LEFT – Apple style minimal content */}
        <div className="hidden md:flex flex-col justify-center w-1/2 p-20 bg-gradient-to-br from-green-400/20 to-green-600/20">
          <motion.h1
            key={isSignUp ? "title-signup" : "title-login"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="text-5xl font-semibold text-neutral-800 leading-tight"
          >
            {isSignUp ? "Create your account" : "Welcome back."}
          </motion.h1>

          <motion.p
            key={isSignUp ? "desc-signup" : "desc-login"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-5 text-neutral-600 text-lg leading-relaxed max-w-sm"
          >
            {isSignUp
              ? "Join our community and enjoy a beautifully crafted experience—smooth, simple, and delightful."
              : "Sign in to continue your journey. Everything stays in sync, beautifully."}
          </motion.p>
        </div>

        {/* RIGHT – FORM */}
        <div className="w-full md:w-1/2 p-12">
          <motion.h2
            key={isSignUp ? "header-signup" : "header-login"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-3xl font-semibold text-neutral-900 mb-8 text-center"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </motion.h2>

          {/* FORM BOX */}
          <motion.div
            key={isSignUp ? "form-signup" : "form-login"}
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            {isSignUp && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-3 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                isSignUp ? "Create Account" : "Login"
              )}
            </button>
          </motion.div>

          {/* Toggle */}
          <p className="text-center text-neutral-700 mt-6">
            {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
              className="font-semibold text-green-700 hover:text-green-800 underline-offset-2 underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}