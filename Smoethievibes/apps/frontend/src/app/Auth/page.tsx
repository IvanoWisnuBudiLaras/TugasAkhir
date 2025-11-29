"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'password' | 'otp'>('email');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login'); // Detected after email check

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0); // Timer untuk OTP resend

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleEmailSubmit = async () => {
    if (!email) return alert("Please enter your email");
    if (!email.includes('@')) return alert("Please enter a valid email address");
    
    setLoading(true);
    try {
      // Cek apakah email sudah terdaftar terlebih dahulu
      const checkResponse = await fetch(`${API_URL}/auth/check-email?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      let authMode = 'register';
      if (checkResponse.ok) {
        const data = await checkResponse.json();
        if (data.data?.exists) {
          authMode = 'login';
          setAuthMode('login');
        } else {
          setAuthMode('register');
        }
      }

      // Kirim OTP sesuai dengan mode yang tepat
      const otpResponse = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          action: authMode === 'login' ? 'LOGIN' : 'REGISTER' 
        }),
      });

      if (!otpResponse.ok) {
        throw new Error('Failed to send OTP');
      }
      
      // Langsung ke step OTP karena OTP sudah dikirim
      setStep('otp');
    } catch (error) {
      console.error(error);
      alert("Error processing email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) return alert("Please enter password");
    if (password.length < 6) return alert("Password must be at least 6 characters");
    if (authMode === 'register' && password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      if (authMode === 'register') {
        // Untuk registrasi baru, langsung kirim data registrasi
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
          // Tangani error spesifik dari backend
          if (data.message?.includes('already in use')) {
            alert("This email is already registered. Please login instead.");
            setAuthMode('login');
            setStep('password');
            return;
          }
          throw new Error(data.message || "Registration failed");
        }

        // Registrasi berhasil, OTP sudah dikirim sebelumnya
        alert("Registration successful! Please check your email for OTP.");
      } else {
        // Untuk login, coba login dengan password
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
          // Tangani error spesifik
          if (data.message?.includes('not activated')) {
            alert("Your account is not activated. Please check your email for OTP verification.");
            // Kirim OTP ulang untuk aktivasi
            await fetch(`${API_URL}/auth/send-otp`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            setStep('otp');
            return;
          }
          if (data.message?.includes('Invalid credentials')) {
            alert("Invalid email or password. Please try again.");
            return;
          }
          throw new Error(data.message || "Login failed");
        }

        // Login berhasil dengan password, langsung ke halaman callback
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          router.push(`/Auth/callback?token=${data.access_token}`);
          return;
        }
      }

      // Pindah ke step OTP untuk verifikasi
      setStep('otp');
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      alert(message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) return alert("Please enter OTP");
    if (otp.length !== 6) return alert("OTP must be 6 digits");
    
    setLoading(true);
    try {
      let response;
      
      // Jika user sudah terdaftar dan kita di step OTP (bukan dari password), gunakan login-with-otp
      if (authMode === 'login' && step === 'otp' && !password) {
        response = await fetch(`${API_URL}/auth/login-with-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: otp }),
        });
      } else {
        // Untuk registrasi atau verifikasi setelah password
        response = await fetch(`${API_URL}/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: otp }),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        // Jika login-with-otp gagal karena user tidak ditemukan, otomatis buat akun baru
        if (authMode === 'login' && data.message?.includes('User not found')) {
          alert("Email not registered. Creating new account...");
          setAuthMode('register');
          // Coba verifikasi OTP untuk registrasi
          const registerResponse = await fetch(`${API_URL}/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code: otp }),
          });
          
          const registerData = await registerResponse.json();
          if (!registerResponse.ok) throw new Error(registerData.message || "Registration failed");
          
          if (registerData.access_token) {
            localStorage.setItem("token", registerData.access_token);
            alert("Account created successfully! Welcome to Smoethievibes!");
            router.push(`/Auth/callback?token=${registerData.access_token}`);
            return;
          }
        }
        throw new Error(data.message || "OTP verification failed");
      }

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        
        // Tampilkan pesan yang sesuai dengan mode
        if (authMode === 'register') {
          alert("Registration successful! Welcome to Smoethievibes!");
        } else {
          alert("Login successful! Welcome back!");
        }
        
        router.push(`/Auth/callback?token=${data.access_token}`);
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      alert(message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) return; // Jangan kirim ulang jika timer masih berjalan
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to resend OTP');
      
      alert("OTP has been resent to your email!");
      
      // Mulai timer 30 detik untuk resend berikutnya
      setOtpTimer(30);
      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error(error);
      alert("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      if (step === 'email') handleEmailSubmit();
      else if (step === 'password') handlePasswordSubmit();
      else if (step === 'otp') handleOtpSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="
          w-full max-w-md
          bg-white/70 backdrop-blur-2xl
          shadow-[0_30px_60px_rgba(0,0,0,0.08)]
          rounded-[2rem]
          border border-black/10
          overflow-hidden p-8
        "
      >
        <h2 className="text-3xl font-semibold text-neutral-900 mb-2 text-center">
          {step === 'otp' ? 'Enter OTP' : (step === 'email' ? 'Welcome' : (authMode === 'login' ? 'Welcome Back' : 'Create Account'))}
        </h2>
        <p className="text-center text-neutral-600 mb-8">
          {step === 'otp' ? `We sent a code to ${email}` : (step === 'email' ? 'Enter your email to continue' : (authMode === 'login' ? 'Enter your password' : 'Set a password'))}
        </p>

        <div className="flex flex-col gap-4">
          {step === 'email' && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none"
              autoFocus
            />
          )}

          {step === 'password' && (
            <>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none"
                autoFocus
              />
              {authMode === 'register' && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none"
                />
              )}
              {authMode === 'login' && (
                <button
                  onClick={() => setStep('otp')}
                  className="text-sm text-green-600 hover:text-green-700 text-left"
                >
                  Login with OTP instead
                </button>
              )}
            </>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="w-full p-3 rounded-xl border border-black/20 focus:ring-2 focus:ring-green-500 outline-none text-center text-2xl tracking-widest"
                maxLength={6}
                autoFocus
              />
              <div className="text-center space-y-2">
                <button
                  onClick={handleResendOtp}
                  disabled={loading || otpTimer > 0}
                  className="text-sm text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Didn't receive OTP? Resend"}
                </button>
                <button
                  onClick={() => setStep('email')}
                  className="block w-full text-sm text-gray-500 hover:text-black"
                >
                  Use different email
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              if (step === 'email') handleEmailSubmit();
              else if (step === 'password') handlePasswordSubmit();
              else if (step === 'otp') handleOtpSubmit();
            }}
            disabled={loading}
            className="mt-3 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Processing..." : "Continue"}
          </button>

          {step === 'password' && (
            <button onClick={() => setStep('email')} className="text-sm text-gray-500 hover:text-black">
              Back to Email
            </button>
          )}

          {step === 'email' && (
            <button
              onClick={() => (window.location.href = `${API_URL}/auth/google`)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition mt-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}