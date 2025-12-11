"use client";

import { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface WithScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
}

// HOC untuk membungkus komponen dengan animasi scroll
export function withScrollAnimation<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultProps?: Partial<WithScrollAnimationProps>
) {
  return function AnimatedComponent(props: P & WithScrollAnimationProps) {
    const {
      className = "",
      delay = defaultProps?.delay || 0,
      duration = defaultProps?.duration || 0.6,
      yOffset = defaultProps?.yOffset || 30,
      once = defaultProps?.once ?? true,
      ...restProps
    } = props;

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
        <WrappedComponent {...(restProps as P)}>
          {children}
        </WrappedComponent>
      </motion.div>
    );
  };
}

// Komponen utility untuk teks biasa
export function AnimatedText({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  once = true,
}: WithScrollAnimationProps) {
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

// Hook untuk animasi scroll custom
export function useScrollAnimation(options?: {
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: options?.once ?? true, 
    margin: "-50px" 
  });

  const animationProps = {
    ref,
    initial: { opacity: 0, y: options?.yOffset ?? 30 },
    animate: isInView 
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: options?.yOffset ?? 30 },
    transition: {
      duration: options?.duration ?? 0.6,
      delay: options?.delay ?? 0,
      ease: "easeOut",
    },
  };

  return { ref, isInView, animationProps };
}