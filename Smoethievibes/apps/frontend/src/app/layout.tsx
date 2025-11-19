"use client";

import "@/src/styles/globals.css";
import { usePathname } from "next/navigation";
import Nav from "@/src/components/Nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNav =
    pathname.startsWith("/Login") ||
    pathname.startsWith("/SignUp");

  return (
    <html lang="id">
      <body>
        {!hideNav && <Nav />}
        {children}
      </body>
    </html>
  );
}
