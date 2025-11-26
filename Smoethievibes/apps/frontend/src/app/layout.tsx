"use client";

import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNav =
    pathname.startsWith("/Auth") ||
    pathname.startsWith("/admin");

  return (
    <html lang="id">
      <body>
        {!hideNav && <Nav />}
        {children}
        <Footer />
      </body>
    </html>
  );
}
