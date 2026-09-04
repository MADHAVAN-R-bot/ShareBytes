'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

export default function RestaurantProfilePage() {
  const { user, updateProfile, showToast } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [businessName, setBusinessName] = useState(user?.business_name || '');
  const [fssaiNumber, setFssaiNumber] = useState(user?.fssai_number || '');
  const [cuisineType, setCuisineType] = useState(user?.cuisine_type || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return <DashboardLayout><p className="text-xs text-on-surface-variant p-8">Please log in.</p></DashboardLayout>;

  const verificationColor = user.verified_status === 'verified' ? 'bg-[#eaf4ee] text-[#005236] border-[#6ffbbe]/40' : user.verified_status === 'rejected' ? 'bg-[#ffdad6] text-[#93000a] border-[#ffb3ad]/40' : 'bg-tertiary-container text-on-tertiary-container border-tertiary/20';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { showToast('Name is required', 'error'); return; }
    setIsSaving(true);
    setTimeout(() => { updateProfile({ full_name: fullName, phone, address, business_name: businessName, fssai_number: fssaiNumber, cuisine_type: cuisineType }); setIsSaving(false); showToast('Profile updated!', 'success'); }, 600);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Restaurant Portal</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Restaurant Profile</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Update your business details, FSSAI info, and view verification status.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#e1bfb5]/40 shadow-sm flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-fixed flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-primary text-[40px]">restaurant</span>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-on-surface">{user.business_name || user.full_name}</p>
            <p className="text-xs text-on-surface-variant">{user.email}</p>
            <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase ${verificationColor}`}>
              {user.verified_status === 'verified' ? '✓ FSSAI Verified' : user.verified_status === 'pending' ? '⏳ Verification Pending' : '✗ Rejected'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-[#e1bfb5]/40 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-on-surface">Personal & Business Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Representative Name *</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Email (read-only)</label>
              <input type="email" readOnly value={user.email} className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs text-on-surface-variant cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Business Name</label>
              <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Golden Harvest Bakery" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Mobile Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 11111" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">FSSAI License Number</label>
              <input type="text" value={fssaiNumber} onChange={e => setFssaiNumber(e.target.value)} placeholder="e.g. 10019043000123" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Cuisine Type</label>
              <input type="text" value={cuisineType} onChange={e => setCuisineType(e.target.value)} placeholder="e.g. South Indian, Bakery, Multi-cuisine" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-on-surface mb-1">Business Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="42 MG Road, Chennai" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {/* Verification docs */}
          {(user.fssai_cert_url || user.entity_photo_url) && (
            <div className={`p-4 rounded-2xl border space-y-2 ${verificationColor}`}>
              <p className="text-xs font-bold">Uploaded Documents</p>
              {user.fssai_cert_url && <a href={user.fssai_cert_url} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">description</span>FSSAI Certificate</a>}
              {user.entity_photo_url && <a href={user.entity_photo_url} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">photo</span>Kitchen Photo</a>}
              {user.rejection_reason && <p className="text-xs">Rejection reason: {user.rejection_reason}</p>}
            </div>
          )}

          <button type="submit" disabled={isSaving} className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60">
            <span className="material-symbols-outlined text-[18px]">save</span>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
