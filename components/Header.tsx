'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { UserRole } from '@/lib/types';

export default function Header() {
  const { user, role, switchRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const notifications = user ? DataService.getNotifications(user.id) : [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesList: { id: UserRole; label: string; icon: string }[] = [
    { id: 'customer', label: 'Customer', icon: 'shopping_bag' },
    { id: 'restaurant', label: 'Restaurant', icon: 'restaurant' },
    { id: 'food_donor', label: 'Food Donor', icon: 'volunteer_activism' },
    { id: 'ngo', label: 'NGO / Trust', icon: 'handshake' },
    { id: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-[#e1bfb5]/40 shadow-sm h-20">
      <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="ShareBytes Logo"
            width={150}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className="px-4 py-1.5 bg-[#e5ede9] text-[#2d5a43] font-bold text-sm rounded-full transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dashboard/customer"
            className="px-4 py-1.5 text-sm font-bold text-[#594139] hover:text-[#261814] hover:bg-surface-container rounded-full transition-colors"
          >
            Marketplace
          </Link>
          <a
            href="/#how-it-works"
            className="px-4 py-1.5 text-sm font-bold text-[#594139] hover:text-[#261814] hover:bg-surface-container rounded-full transition-colors"
          >
            How it works
          </a>
          <a
            href="/#trust"
            className="px-4 py-1.5 text-sm font-bold text-[#594139] hover:text-[#261814] hover:bg-surface-container rounded-full transition-colors"
          >
            Trust & Safety
          </a>
        </nav>

        {/* Right Section: Role Switcher, Notifications, Auth */}
        <div className="flex items-center gap-3">
          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="bg-surface-container-low hover:bg-surface-container border border-[#e1bfb5]/60 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-on-surface shadow-sm transition-all"
            >
              <span className="text-on-surface-variant font-normal">Role:</span>
              <span className="text-primary font-bold uppercase tracking-wider">{role.replace('_', ' ')}</span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#e1bfb5]/40 py-2 z-50">
                <div className="px-3 py-1 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Switch Demo Persona
                </div>
                {rolesList.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRole(r.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center justify-between hover:bg-surface-container transition-colors ${
                      role === r.id ? 'bg-primary-fixed/40 text-primary' : 'text-on-surface'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                      {r.label}
                    </span>
                    {role === r.id && (
                      <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors relative"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e1bfb5]/40 py-3 px-4 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="font-bold text-sm text-on-surface">Notifications</span>
                    <span className="text-xs text-primary font-bold">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 py-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-on-surface-variant text-center py-4">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-surface-container-low text-xs space-y-1 hover:bg-surface-container transition-colors"
                        >
                          <p className="font-bold text-on-surface">{n.title}</p>
                          <p className="text-on-surface-variant">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Menu / Dashboard Link */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/${role === 'food_donor' ? 'donor' : role}`}
                className="px-4 py-2 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                title="Log Out"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth?tab=login"
                className="inline-flex items-center gap-1 text-sm font-bold text-on-surface hover:text-primary transition-colors px-3 py-1.5"
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
        </div>
      </div>
    </header>
  );
}
