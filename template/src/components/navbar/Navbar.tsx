"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.scss";
import { NAV_LINKS } from "@/config/menu.config";

// Lazy load only in ecommerce mode
let CartIcon: React.FC | null = null;
let LoginButton: React.FC | null = null;

export default function Navbar({ isEcommerce = false }: { isEcommerce?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const navItems = NAV_LINKS;

  if (isEcommerce) {
    try {
      CartIcon = require("@/components/ecommerce/basket/CartIcon").default;
      LoginButton = require("@/components/ecommerce/login/LoginButton").default;
    } catch {
      console.warn("⚠️ E-commerce components not found.");
    }
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <Image
            src="/assets/navbar.png"
            alt="Logo"
            width={350}
            height={350}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className={styles.desktopLinks}>
          {navItems.map(({ slug, label }) => {
            const href = `/${slug}`;
            const isActive = pathname === href;
            return (
              <Link
                key={slug}
                href={href}
                onClick={closeMenu}
                className={isActive ? styles.active : ""}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Ecommerce Actions */}
        {isEcommerce && CartIcon && LoginButton && (
          <div className={styles.actions}>
            <CartIcon />
            <LoginButton />
          </div>
        )}

        {/* Mobile Toggle */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <Icon icon={menuOpen ? "mdi:close" : "mdi:menu"} width="28" height="28" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
        {navItems.map(({ slug, label }) => {
          const href = `/${slug}`;
          const isActive = pathname === href;
          return (
            <Link
              key={slug}
              href={href}
              onClick={closeMenu}
              className={isActive ? styles.active : ""}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
