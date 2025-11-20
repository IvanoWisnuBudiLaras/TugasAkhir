"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function AuthPage(): JSX.Element {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animation controls
  const leftControls = useAnimation();
  const rightControls = useAnimation();
  const blackPanelControls = useAnimation();
  const whitePanelControls = useAnimation();

  const handleToggle = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // EXIT ANIMATION
    await Promise.all([
      leftControls.start({
        x: -40,
        opacity: 0,
        transition: { duration: 0.28, ease: "easeIn" },
      }),
      rightControls.start({
        x: 40,
        opacity: 0,
        transition: { duration: 0.28, ease: "easeIn" },
      }),

      blackPanelControls.start({
        x: isSignUp ? "100%" : "0%",
        transition: { duration: 0.55, ease: "easeInOut" },
      }),

      whitePanelControls.start({
        x: isSignUp ? "-100%" : "0%",
        transition: { duration: 0.55, ease: "easeInOut" },
      }),
    ]);

    // Ganti state
    setIsSignUp((prev) => !prev);

    // SET ENTER POSITION
    await Promise.all([
      leftControls.set({ x: 40, opacity: 0 }),
      rightControls.set({ x: -40, opacity: 0 }),
    ]);

    // ENTER ANIMATION
    await Promise.all([
      leftControls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.33, ease: "easeOut" },
      }),
      rightControls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.33, ease: "easeOut" },
      }),
    ]);

    setIsTransitioning(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="relative w-[780px] h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-white">

        {/* PANELS */}
        <div className="absolute inset-0 flex">

          {/* BLACK PANEL */}
          <motion.div
            animate={blackPanelControls}
            initial={{ x: "0%" }}
            className="w-1/2 bg-green-950 text-white flex flex-col justify-center px-10 relative z-20"
          >
            <motion.div animate={leftControls} initial={{ x: 0, opacity: 1 }}>
              <h1 className="text-3xl font-bold mb-3">
                {isSignUp ? "WELCOME BACK!" : "HELLO AGAIN!"}
              </h1>

              <p className="text-gray-300 text-sm mb-4 max-w-[250px] leading-relaxed">
                {isSignUp
                  ? "Temukan pengalaman baru — daftar untuk mulai menikmati layanan kami."
                  : "Selamat datang kembali! Masuk untuk melanjutkan."}
              </p>

              <button
                onClick={handleToggle}
                disabled={isTransitioning}
                className="mt-4 border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition disabled:opacity-50"
              >
                {isSignUp ? "Login" : "Sign Up"}
              </button>
            </motion.div>
          </motion.div>

          {/* WHITE PANEL (Form) */}
          <motion.div
            animate={whitePanelControls}
            initial={{ x: "0%" }}
            className="w-1/2 bg-white text-black flex flex-col justify-center px-12 relative z-10"
          >
            <motion.div animate={rightControls} initial={{ x: 0, opacity: 1 }}>

              {/* SIGN UP FORM */}
              {isSignUp ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

                  <form className="flex flex-col gap-4">
                    <input className="border-b border-gray-400 p-2" placeholder="Username" />
                    <input className="border-b border-gray-400 p-2" placeholder="Email" />
                    <input type="password" className="border-b border-gray-400 p-2" placeholder="Password" />

                    <button className="bg-black text-white py-2 rounded-full mt-3 hover:bg-gray-900 transition">
                      Sign Up
                    </button>
                  </form>

                  <p className="text-xs mt-3 text-center text-gray-500">
                    Already have an account?{" "}
                    <button onClick={handleToggle} className="text-yellow-600 underline">
                      Login
                    </button>
                  </p>
                </>
              ) : (
                <>
                  {/* LOGIN FORM (DISAMAKAN VISUALNYA DENGAN SIGN UP) */}
                  <h2 className="text-2xl font-bold mb-6">Login</h2>

                  <form className="flex flex-col gap-4">
                    <input className="border-b border-gray-400 p-2" placeholder="Username or Email" />
                    <input type="password" className="border-b border-gray-400 p-2" placeholder="Password" />

                    <button className="bg-black text-white py-2 rounded-full mt-3 hover:bg-gray-900 transition">
                      Login
                    </button>
                  </form>

                  <p className="text-xs mt-3 text-center text-gray-500">
                    Don’t have an account?{" "}
                    <button onClick={handleToggle} className="text-yellow-600 underline">
                      Sign Up
                    </button>
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
