"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import CartIcon from "@/components/ecommerce/basket/CartIcon";
import LoginButton from "@/components/ecommerce/login/LoginButton";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const navItems = ["about", "contact", "login", "cart"];

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <Image
            src="/assets/logo/logo.png"
            alt="Logo"
            width={150}
            height={40}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className={styles.desktopLinks}>
          {navItems.map((item) => (
            <Link key={item} href={`/${item}`} onClick={closeMenu}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>

        {/* Cart & Login Buttons */}
        <div className={styles.actions}>
          <CartIcon />
          <LoginButton />
        </div>

        {/* Hamburger */}
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
          <Icon icon={menuOpen ? "mdi:close" : "mdi:menu"} width="28" height="28" />
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map((item) => (
            <Link key={item} href={`/${item}`} onClick={closeMenu}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
