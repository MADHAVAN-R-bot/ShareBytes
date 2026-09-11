'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import ChangePasswordCard from '@/components/ChangePasswordCard';

interface ProfileField {
  key: string;
  label: string;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
}

interface ProfilePageProps {
  title: string;
  subtitle: string;
  extraFields?: ProfileField[];
  roleLabel: string;
  roleIcon: string;
}

export default function ProfilePageTemplate({ title, subtitle, extraFields = [], roleLabel, roleIcon }: ProfilePageProps) {
  const { user, updateProfile, showToast } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [businessName, setBusinessName] = useState(user?.business_name || '');
  const [fssaiNumber, setFssaiNumber] = useState(user?.fssai_number || '');
  const [cuisineType, setCuisineType] = useState(user?.cuisine_type || '');
  const [orgRegNumber, setOrgRegNumber] = useState(user?.org_registration_number || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return (
    <DashboardLayout>
      <div className="text-center py-20">
        <p className="text-xs text-on-surface-variant">Not logged in.</p>
      </div>
    </DashboardLayout>
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { showToast('Name is required', 'error'); return; }
    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        full_name: fullName,
        phone,
        address,
        business_name: businessName,
        fssai_number: fssaiNumber,
        cuisine_type: cuisineType,
        org_registration_number: orgRegNumber,
      });
      setIsSaving(false);
      showToast('Profile updated successfully!', 'success');
    }, 600);
  };

  const verificationColor = user.verified_status === 'verified'
    ? 'bg-[#eaf4ee] text-[#005236] border-[#6ffbbe]/40'
    : user.verified_status === 'rejected'
    ? 'bg-[#ffdad6] text-[#93000a] border-[#ffb3ad]/40'
    : 'bg-tertiary-container text-on-tertiary-container border-tertiary/20';

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        {/* Header */}
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{roleLabel}</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">{title}</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">{subtitle}</p>
        </div>

        {/* Avatar & Status */}
        <div className="bg-white rounded-3xl p-6 border border-[#e1bfb5]/40 shadow-sm flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-fixed flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-primary text-[40px]">{roleIcon}</span>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-on-surface">{user.full_name}</p>
            <p className="text-xs text-on-surface-variant">{user.email}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-bold capitalize">
                {user.role.replace('_', ' ')}
              </span>
              {(user.role === 'restaurant' || user.role === 'ngo') && (
                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase ${verificationColor}`}>
                  {user.verified_status === 'pending' ? '⏳ Pending Review' : user.verified_status === 'verified' ? '✓ Verified' : '✗ Rejected'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-[#e1bfb5]/40 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-on-surface">Personal Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Full Name *</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Email Address</label>
              <input type="email" readOnly value={user.email} className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium text-on-surface-variant cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Mobile Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Address / Location</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Your address" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {/* Role-specific fields */}
          {extraFields.length > 0 && (
            <>
              <div className="border-t border-gray-100 pt-5">
                <h2 className="text-base font-bold text-on-surface mb-4">Role-Specific Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.role !== 'customer' ? (
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Business / Organisation Name</label>
                    <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Business name" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                ) : null}
                {extraFields.map(f => {
                  const fieldMap: Record<string, [string, React.Dispatch<React.SetStateAction<string>>]> = {
                    fssai_number: [fssaiNumber, setFssaiNumber],
                    cuisine_type: [cuisineType, setCuisineType],
                    org_registration_number: [orgRegNumber, setOrgRegNumber],
                  };
                  const entry = fieldMap[f.key];
                  if (!entry) return null;
                  const [val, setter] = entry;
                  return (
                    <div key={f.key}>
                      <label className="block text-xs font-bold text-on-surface mb-1">{f.label}</label>
                      <input type={f.type || 'text'} value={val} onChange={e => setter(e.target.value)} placeholder={f.placeholder} readOnly={f.readOnly} className={`w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary ${f.readOnly ? 'text-on-surface-variant cursor-not-allowed' : ''}`} />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Verification docs for restaurant/ngo */}
          {(user.role === 'restaurant' || user.role === 'ngo') && (
            <div className={`p-4 rounded-2xl border ${verificationColor} space-y-2`}>
              <p className="text-xs font-bold">Verification Status: {user.verified_status?.toUpperCase()}</p>
              {user.fssai_cert_url && (
                <a href={user.fssai_cert_url} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">description</span>
                  View FSSAI Certificate
                </a>
              )}
              {user.registration_cert_url && (
                <a href={user.registration_cert_url} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">description</span>
                  View Registration Certificate
                </a>
              )}
              {user.entity_photo_url && (
                <a href={user.entity_photo_url} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">photo</span>
                  View Entity Photo
                </a>
              )}
              {user.rejection_reason && (
                <p className="text-xs font-medium">Rejection reason: {user.rejection_reason}</p>
              )}
            </div>
          )}

          <button type="submit" disabled={isSaving} className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60">
            <span className="material-symbols-outlined text-[18px]">save</span>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Change Password Section */}
        <ChangePasswordCard />
      </div>
    </DashboardLayout>
  );
}

