'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import ChangePasswordCard from '@/components/ChangePasswordCard';

export default function NGOProfilePage() {
  const { user, updateProfile, showToast } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [businessName, setBusinessName] = useState(user?.business_name || '');
  const [orgRegNumber, setOrgRegNumber] = useState(user?.org_registration_number || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return <DashboardLayout><p className="text-xs text-on-surface-variant p-8">Please log in.</p></DashboardLayout>;

  const verificationColor = user.verified_status === 'verified' ? 'bg-[#eaf4ee] text-[#005236] border-[#6ffbbe]/40' : user.verified_status === 'rejected' ? 'bg-[#ffdad6] text-[#93000a] border-[#ffb3ad]/40' : 'bg-tertiary-container text-on-tertiary-container border-tertiary/20';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { showToast('Name is required', 'error'); return; }
    setIsSaving(true);
    setTimeout(() => { updateProfile({ full_name: fullName, phone, address, business_name: businessName, org_registration_number: orgRegNumber }); setIsSaving(false); showToast('Profile updated!', 'success'); }, 600);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">NGO / Trust Portal</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Organisation Profile</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Manage your trust's registration details and verification documents.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#e1bfb5]/40 shadow-sm flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#006c49]/10 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[#006c49] text-[40px]">handshake</span>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-on-surface">{user.business_name || user.full_name}</p>
            <p className="text-xs text-on-surface-variant">{user.email}</p>
            <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase ${verificationColor}`}>
              {user.verified_status === 'verified' ? '✓ Verified NGO' : user.verified_status === 'pending' ? '⏳ Verification Pending' : '✗ Rejected'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-[#e1bfb5]/40 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-on-surface">Organisation Details</h2>
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
              <label className="block text-xs font-bold text-on-surface mb-1">Organisation / Trust Name</label>
              <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="St. Jude Shelter Trust" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Mobile Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 44444" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Registration Number (12A/80G/CSR)</label>
              <input type="text" value={orgRegNumber} onChange={e => setOrgRegNumber(e.target.value)} placeholder="e.g. 12A/TN/2019/0042" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Shelter / Premises Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="102 Hope Avenue, Mylapore" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {(user.registration_cert_url || user.entity_photo_url) && (
            <div className={`p-4 rounded-2xl border space-y-2 ${verificationColor}`}>
              <p className="text-xs font-bold">Uploaded Verification Documents</p>
              {user.registration_cert_url && <a href={user.registration_cert_url} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">description</span>Registration Certificate</a>}
              {user.entity_photo_url && <a href={user.entity_photo_url} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">photo</span>Shelter Photo</a>}
              {user.rejection_reason && <p className="text-xs">Rejection reason: {user.rejection_reason}</p>}
            </div>
          )}

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
