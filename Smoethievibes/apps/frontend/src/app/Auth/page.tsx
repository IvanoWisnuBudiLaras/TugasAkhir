"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

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
              className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none"
            />

            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none"
              />
            )}

            <button className="mt-3 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition">
              {isSignUp ? "Create Account" : "Login"}
            </button>
          </motion.div>

          {/* Toggle */}
          <p className="text-center text-neutral-700 mt-6">
            {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-green-700 hover:text-green-800 underline-offset-2 underline"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
