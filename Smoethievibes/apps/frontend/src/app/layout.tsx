"use client";

import "@/src/styles/globals.css";
import { usePathname } from "next/navigation";
import Nav from "@/src/components/Nav";
import Footer from "@/src/components/footer";

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
