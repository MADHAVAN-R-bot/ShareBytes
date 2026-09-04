'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e1bfb5]/40 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-surface-container-low">
        <h2 className="text-xs font-bold text-on-surface uppercase tracking-wider">{title}</h2>
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}

function SettingsRow({ icon, label, desc, action }: { icon: string; label: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-4">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{icon}</span>
        <div>
          <p className="text-xs font-bold text-on-surface">{label}</p>
          {desc && <p className="text-[11px] text-on-surface-variant">{desc}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default function SettingsPage({ roleLabel, profileHref }: { roleLabel: string; profileHref: string }) {
  const { logout } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{roleLabel}</div>
          <h1 className="text-2xl font-bold text-on-surface">Settings</h1>
        </div>

        <SettingsSection title="Account">
          <SettingsRow icon="person" label="Edit Profile" desc="Update name, phone, address, and business details" action={<Link href={profileHref} className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold">Edit</Link>} />
          <SettingsRow icon="lock" label="Change Password" desc="Password changes are handled via Supabase Auth" action={<span className="text-xs text-on-surface-variant">Via email reset</span>} />
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingsRow icon="notifications" label="Email Notifications" desc="Receive updates on claims and verifications" action={<span className="px-2.5 py-0.5 rounded-full bg-[#eaf4ee] text-[#005236] text-[11px] font-bold">ON</span>} />
          <SettingsRow icon="phone" label="SMS Alerts" desc="Critical alerts sent to your registered mobile" action={<span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold">OFF</span>} />
        </SettingsSection>

        <SettingsSection title="Privacy">
          <SettingsRow icon="public" label="Profile Visibility" desc="Your business profile visible to platform users" action={<span className="px-2.5 py-0.5 rounded-full bg-[#eaf4ee] text-[#005236] text-[11px] font-bold">Public</span>} />
        </SettingsSection>

        <SettingsSection title="Danger Zone">
          <SettingsRow icon="logout" label="Log Out" desc="Sign out of your current session" action={<button onClick={logout} className="px-4 py-1.5 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-bold hover:opacity-80">Log Out</button>} />
        </SettingsSection>
      </div>
    </DashboardLayout>
  );
}
