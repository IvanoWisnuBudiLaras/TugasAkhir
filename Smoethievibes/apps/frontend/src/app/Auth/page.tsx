"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { AnimatedHeading, AnimatedParagraph } from "@/components/animations";

// @komponen Auth page - unified email/password form
// @keamanan Input sanitization and password validation built-in

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AuthPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // @keamanan OTP verification states
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // @keamanan Validate email format
  const validateEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // @keamanan Validate password strength (min 8 chars, mixed case, numbers, special chars)
  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters" };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: "Password must contain uppercase letter" };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: "Password must contain lowercase letter" };
    }
    if (!/\d/.test(password)) {
      return { valid: false, message: "Password must contain number" };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: "Password must contain special character" };
    }
    return { valid: true };
  };

  // @keamanan Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>\"'&;|`]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .trim();
  };

  // @keamanan Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sanitizeInput(email.toLowerCase()),
          password: sanitizeInput(password),
        }),
      });

      const data = await response.json();

      // If server responded with error but indicates OTP is required,
      // show OTP verification flow instead of throwing immediately.
      if (!response.ok) {
        const msg = data?.message;
        const requiresOtp = !!(
          data?.requiresOtp ||
          (msg && typeof msg === 'object' && msg?.requiresOtp) ||
          (data?.data && data.data?.requiresOtp)
        );
        const messageText = typeof msg === 'string' ? msg : msg?.message || data?.message || 'Login failed';
        if (requiresOtp) {
          setOtpEmail(email);
          setShowOtpVerification(true);
          setSuccess(messageText || 'OTP telah dikirim ke email Anda. Silakan verifikasi.');
          setError("");
          return;
        }
        throw new Error(messageText || "Login failed");
      }

      // Check success payload for wrapped or unwrapped token
      const token = data?.data?.access_token || data?.data?.token || data?.access_token || data?.token || (data?.data && data.data.token);
      const user = data?.data?.user || data?.user || (data?.data && data.data.user);

      if (!token) {
        throw new Error('Login response did not include a token');
      }

      // @keamanan Store JWT in localStorage
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const resendOtp = async () => {
    if (!otpEmail) {
      setError('No email to resend OTP to');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, action: authMode === 'register' ? 'REGISTER' : 'LOGIN' }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message || 'Failed to resend OTP');
      setSuccess('Kode OTP telah dikirim ulang');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // @keamanan Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    const validation = validatePassword(password);
    if (!validation.valid) {
      setError(validation.message || "Password validation failed");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: sanitizeInput(email.toLowerCase()),
          password: sanitizeInput(password),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Save email untuk OTP verification
      setOtpEmail(email);
      setSuccess("Pendaftaran berhasil! Silakan verifikasi email Anda.");
      // Show OTP form instead of direct redirect
      setShowOtpVerification(true);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // @ui Handle Google OAuth sign-in
  const handleGoogleSignIn = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleSubmit = authMode === "login" ? handleLogin : handleRegister;

  // @keamanan Handle OTP verification
  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otpCode || otpCode.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (!otpEmail) {
      setError("Email not found. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login-with-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpEmail,
          code: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // @keamanan Store JWT in localStorage
      localStorage.setItem("token", data.data.access_token || data.access_token);
      localStorage.setItem("user", JSON.stringify(data.data.user || data.user));

      setSuccess("Email verified! Redirecting...");
      setShowOtpVerification(false);
      // Reset form
      setEmail("");
      setPassword("");
      setOtpCode("");
      setOtpEmail("");
      setTimeout(() => router.push("/Auth/callback"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F3] via-[#FFE8D6] to-[#FFD7B5] flex items-center justify-center p-4">
      {/* @ui Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* @ui Card container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <AnimatedHeading 
              level={1}
              className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2"
              delay={0.2}
            >
              SmoethieVibe
            </AnimatedHeading>
            <AnimatedParagraph 
              className="text-gray-600 text-sm"
              delay={0.4}
            >
              {authMode === "login"
                ? "Welcome back! Sign in to continue"
                : "Create your SmoethieVibe account"}
            </AnimatedParagraph>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success message */}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
            >
              {success}
            </motion.div>
          )}

          {/* Auth form - unified email/password */}
          {!showOtpVerification ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {authMode === "register" && (
                <p className="text-xs text-gray-500 mt-1">
                  Min 8 chars, uppercase, lowercase, number, special char
                </p>
              )}
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : authMode === "login" ? (
                <>
                  <LogIn className="h-5 w-5" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" /> Sign Up
                </>
              )}
            </motion.button>
          </form>
          ) : (
          // @keamanan OTP verification form
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Kami telah mengirim kode 6 digit ke {otpEmail}
              </p>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest font-mono"
                disabled={loading}
              />
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </motion.button>

            {/* Resend code button */}
            <button
              type="button"
              onClick={resendOtp}
              disabled={loading}
              className="w-full text-sm text-orange-600 py-2 hover:text-orange-700 transition"
            >
              Resend code
            </button>

            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                setShowOtpVerification(false);
                setOtpCode("");
                setOtpEmail("");
                setError("");
                setSuccess("");
              }}
              className="w-full text-gray-600 py-2 hover:text-gray-800 text-sm"
            >
              ← Back to Login
            </button>
          </form>
          )}

          {/* Google OAuth */}
          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 text-gray-500">Or continue with</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </motion.button>
          </div>

          {/* Toggle auth mode */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {authMode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setError("");
                setSuccess("");
              }}
              className="font-bold text-orange-500 hover:text-orange-600 transition"
            >
              {authMode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}