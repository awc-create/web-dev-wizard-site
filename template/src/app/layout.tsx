"use client";

import type { Metadata } from "next";
import "@/styles/Global.scss";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const isEcommerce = process.env.NEXT_PUBLIC_SITE_MODE === "ecommerce";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <html lang="en">
      <body>
        <Navbar isEcommerce={isEcommerce} />
        <main style={{ paddingTop: isHome ? 0 : "var(--navbar-height)" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
