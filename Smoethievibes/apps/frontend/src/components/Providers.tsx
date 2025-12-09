"use client";

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/apollo-client';
import Nav from './Nav';
import Footer from './footer';
import { CartProvider } from '@/app/Context/CartContext';

// @komponen Provider root untuk Apollo GraphQL dan Cart state management
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {/* @fitur GraphQL client provider untuk query/mutation */}
      <ApolloProvider client={client}>
        <Nav />
        {children}
        <Footer />
      </ApolloProvider>
    </CartProvider>
  );
}
