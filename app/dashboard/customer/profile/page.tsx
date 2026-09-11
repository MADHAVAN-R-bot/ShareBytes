'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import ChangePasswordCard from '@/components/ChangePasswordCard';

export default function CustomerProfilePage() {
  const { user, updateProfile, showToast } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return <DashboardLayout><p className="text-xs text-on-surface-variant p-8">Please log in.</p></DashboardLayout>;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { showToast('Name is required', 'error'); return; }
    setIsSaving(true);
    setTimeout(() => { updateProfile({ full_name: fullName, phone, address }); setIsSaving(false); showToast('Profile updated!', 'success'); }, 600);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Customer Portal</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">My Profile</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Manage your personal information and account details.</p>
        </div>

        {/* Avatar card */}
        <div className="bg-white rounded-3xl p-6 border border-[#e1bfb5]/40 shadow-sm flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-fixed flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-primary text-[40px]">person</span>
          </div>
          <div>
            <p className="text-lg font-bold text-on-surface">{user.full_name}</p>
            <p className="text-xs text-on-surface-variant">{user.email}</p>
            <span className="mt-1 inline-block px-2.5 py-0.5 rounded-full bg-[#eaf4ee] text-[#005236] text-[11px] font-bold">Verified Customer</span>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-[#e1bfb5]/40 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-on-surface">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Full Name *</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Email (read-only)</label>
              <input type="email" readOnly value={user.email} className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium text-on-surface-variant cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Mobile Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Delivery Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Your address" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <button type="submit" disabled={isSaving} className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60">
            <span className="material-symbols-outlined text-[18px]">save</span>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <ChangePasswordCard />
      </div>
    </DashboardLayout>
  );
}
