"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
import Nav from './Nav';
import Footer from './footer';
import { CartProvider } from '@/app/Context/CartContext';

// Lightweight top progress bar to improve perceived navigation speed
function TopProgress() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // if this is the first render, initialize prev and do nothing
    if (prev.current === null) {
      prev.current = pathname;
      return;
    }

    if (pathname !== prev.current) {
      // show the bar when pathname changes
      setVisible(true);

      // ensure the bar hides after a short delay to avoid sticking
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current as unknown as number);
      // hide after 1.2s (navigation usually finishes sooner)
      timeoutRef.current = window.setTimeout(() => {
        setVisible(false);
      }, 1200) as unknown as number;

      prev.current = pathname;
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current as unknown as number);
        timeoutRef.current = null;
      }
    };
  }, [pathname]);

  return (
    <div
      aria-hidden
      className={`fixed left-0 top-0 h-0.5 z-50 transition-all duration-300 ease-out ${
        visible ? 'w-full bg-green-500' : 'w-0 bg-transparent'
      }`}
      style={{ pointerEvents: 'none' }}
    />
  );
}

// @komponen Provider root untuk Apollo GraphQL dan Cart state management
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {/* @fitur GraphQL client provider untuk query/mutation */}
      <ApolloProvider client={client}>
        <TopProgress />
        <Nav />
        {children}
        <Footer />
      </ApolloProvider>
    </CartProvider>
  );
}
