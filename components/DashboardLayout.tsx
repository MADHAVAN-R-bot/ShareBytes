'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';

interface SidebarLink {
  href: string;
  label: string;
  icon: string;
}

const roleLinks: Record<UserRole, SidebarLink[]> = {
  customer: [
    { href: '/dashboard/customer', label: 'Browse Meals', icon: 'storefront' },
    { href: '/dashboard/customer#my-claims', label: 'My Claims', icon: 'shopping_bag' },
  ],
  restaurant: [
    { href: '/dashboard/restaurant', label: 'Overview', icon: 'grid_view' },
    { href: '/dashboard/restaurant#active-shares', label: 'Active Shares', icon: 'takeout_dining' },
    { href: '/dashboard/restaurant#claims-history', label: 'Incoming Claims', icon: 'history' },
  ],
  food_donor: [
    { href: '/dashboard/donor', label: 'Overview', icon: 'grid_view' },
    { href: '/dashboard/donor#active-donations', label: 'Active Donations', icon: 'featured_seasonal_and_gifts' },
  ],
  ngo: [
    { href: '/dashboard/ngo', label: 'Surplus Feed', icon: 'rss_feed' },
    { href: '/dashboard/ngo#accepted-allocations', label: 'My Allocations', icon: 'assignment_turned_in' },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Verification Queue', icon: 'how_to_reg' },
    { href: '/dashboard/admin#analytics', label: 'Analytics', icon: 'analytics' },
    { href: '/dashboard/admin#users', label: 'User Directory', icon: 'group' },
    { href: '/dashboard/admin#audit', label: 'Audit Logs', icon: 'shield' },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role, switchRole, logout } = useAuth();
  const links = roleLinks[role] || roleLinks.customer;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Sidebar (Desktop) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-[#e1bfb5]/40 z-50 hidden lg:flex flex-col py-6 px-4 shadow-sm">
        <div className="px-2 mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="ShareBytes Logo"
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          <div className="px-3 py-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            {role.replace('_', ' ')} Portal
          </div>
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Role Switcher Widget */}
        <div className="pt-4 border-t border-[#e1bfb5]/40 space-y-3">
          <div className="bg-surface-container rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">eco</span>
              <div>
                <p className="text-[10px] font-bold uppercase text-on-surface-variant">Role Persona</p>
                <p className="text-xs font-bold text-on-surface capitalize">{role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-xs font-bold text-on-surface-variant">
            <span className="truncate max-w-[120px]">{user?.full_name || user?.email}</span>
            <button
              onClick={logout}
              className="text-primary hover:underline flex items-center gap-1 text-[11px]"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-[#e1bfb5]/40 h-16 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="lg:hidden">
              <Image src="/logo.png" alt="Logo" width={110} height={32} className="h-7 w-auto" />
            </Link>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-on-surface">
              Role: <strong className="text-primary uppercase">{role.replace('_', ' ')}</strong>
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              Home
            </Link>
            <Link
              href="/dashboard/customer"
              className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              Marketplace
            </Link>
          </div>
        </header>

        {/* Verification Status Banner if pending */}
        {user && user.verified_status === 'pending' && (
          <div className="bg-tertiary-container/40 text-on-tertiary-container px-6 py-2.5 text-xs font-bold flex items-center justify-between border-b border-tertiary/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
              <span>Verification Pending: Your uploaded certificates are currently being reviewed by Admin.</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-tertiary text-white text-[10px] uppercase font-bold">
              In Review
            </span>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 max-w-container-max w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
