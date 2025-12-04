﻿"use client";

import "@/styles/globals.css";
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo-client';
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/footer";
import { CartProvider } from "@/app/Context/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNav =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/Auth") ||
    pathname.startsWith("/admin");

  return (
    <html lang="id">
      <body>
        <CartProvider>
         <ApolloProvider client={client}>
          {!hideNav && <Nav />}
          {children}
          <Footer />
         </ApolloProvider>
        </CartProvider>
        
      </body>
    </html>
  );
}