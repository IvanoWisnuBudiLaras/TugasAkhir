"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export function ScrollText({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  yOffset = 30,
  once = true,
  as: Component = "div",
}: ScrollTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  // Sederhanakan dengan type assertion yang lebih spesifik
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionDiv = motion(Component as any);

  return (
    <MotionDiv
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
    </MotionDiv>
  );
}

// Komponen wrapper untuk teks biasa
export function AnimatedText({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  yOffset = 30,
  once = true,
}: Omit<ScrollTextProps, "as">) {
  return (
    <ScrollText
      className={className}
      delay={delay}
      duration={duration}
      yOffset={yOffset}
      once={once}
      as="span"
    >
      {children}
    </ScrollText>
  );
}

// Komponen untuk heading
export function AnimatedHeading({
  children,
  level = 1,
  className = "",
  delay = 0,
  duration = 0.8,
  yOffset = 40,
  once = true,
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
} & Omit<ScrollTextProps, "as">) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <ScrollText
      className={className}
      delay={delay}
      duration={duration}
      yOffset={yOffset}
      once={once}
      as={HeadingTag}
    >
      {children}
    </ScrollText>
  );
}

// Komponen untuk paragraph
export function AnimatedParagraph({
  children,
  className = "",
  delay = 0.2,
  duration = 0.6,
  yOffset = 20,
  once = true,
}: Omit<ScrollTextProps, "as">) {
  return (
    <ScrollText
      className={className}
      delay={delay}
      duration={duration}
      yOffset={yOffset}
      once={once}
      as="p"
    >
      {children}
    </ScrollText>
  );
}