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
  const [loading, setLoading] = useState(false);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          alert("Registration successful!");
          router.push(`/auth/callback?token=${data.access_token}`);
        }
      } else {
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          alert("Login successful!");
          router.push(`/auth/callback?token=${data.access_token}`);
        }
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("An error occurred");
      console.error(error);
      alert(error.message);
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

            <div className="relative flex items-center justify-center mt-4">
              <div className="border-t border-gray-300 w-full"></div>
              <span className="bg-white px-3 text-sm text-gray-500">OR</span>
              <div className="border-t border-gray-300 w-full"></div>
            </div>

            <button
              onClick={() => window.location.href = "http://localhost:3001/auth/google"}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">Sign in with Google</span>
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