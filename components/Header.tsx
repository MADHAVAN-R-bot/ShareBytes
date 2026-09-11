'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/about', label: 'About' },
    { href: '/help', label: 'Help' },
    { href: '/contact', label: 'Contact' },
  ];

  const dashboardHref = `/dashboard/${role === 'food_donor' ? 'donor' : role}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-[#e1bfb5]/40 shadow-sm h-20">
      <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="ShareBytes Logo"
            width={150}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation — exactly 5 links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-1.5 text-sm font-bold text-[#594139] hover:text-[#261814] hover:bg-surface-container rounded-full transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Auth only (NO role badge/switcher on public header) */}
        <div className="flex items-center gap-3">
          {user ? (
            /* Logged-in: show name pill + single Dashboard button + logout */
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-surface-container border border-[#e1bfb5]/40 text-xs font-bold text-on-surface">
                <span className="text-on-surface-variant font-normal">Hi, </span>
                {user.full_name?.split(' ')[0] || user.email.split('@')[0]}
              </span>
              <Link
                href={dashboardHref}
                className="px-4 py-2 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                Dashboard
              </Link>
              <button
                onClick={() => logout(() => router.push('/auth?tab=login'))}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                title="Log Out"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            /* Logged-out: Sign in + Get started */
            <div className="flex items-center gap-2">
              <Link
                href="/auth?tab=login"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-on-surface hover:text-primary transition-colors px-3 py-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Sign in
              </Link>
              <Link
                href="/auth?tab=signup"
                className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                Get started
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-[#e1bfb5]/40 shadow-lg py-3 px-4 space-y-1 z-50">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-2xl text-sm font-bold text-on-surface hover:bg-surface-container transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <Link href="/auth?tab=login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-2xl border border-[#e1bfb5] text-sm font-bold text-on-surface">Sign in</Link>
              <Link href="/auth?tab=signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-2xl bg-primary text-white text-sm font-bold">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
