"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface AutoAnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
}

// Komponen teks yang otomatis memiliki animasi scroll-up
export function AutoAnimatedText({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  once = true,
}: AutoAnimatedTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

// Komponen untuk heading yang otomatis teranimasi
export function AutoAnimatedHeading({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  yOffset = 30,
  once = true,
}: AutoAnimatedTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Komponen untuk paragraph yang otomatis teranimasi
export function AutoAnimatedParagraph({
  children,
  className = "",
  delay = 0.2,
  duration = 0.6,
  yOffset = 15,
  once = true,
}: AutoAnimatedTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.p>
  );
}