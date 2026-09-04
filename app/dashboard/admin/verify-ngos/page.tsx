'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DataService } from '@/lib/services/dataService';
import { UserProfile } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function AdminVerifyNGOsPage() {
  const { user: admin, showToast } = useAuth();
  const [pending, setPending] = useState<UserProfile[]>(() => DataService.getProfiles().filter(p => p.role === 'ngo' && p.verified_status === 'pending'));

  const handleVerify = (userId: string, status: 'verified' | 'rejected') => {
    DataService.verifyUser(userId, status, status === 'rejected' ? 'Registration documents incomplete' : undefined, admin?.id);
    setPending(prev => prev.filter(p => p.id !== userId));
    showToast(`NGO ${status === 'verified' ? 'approved' : 'rejected'}.`, status === 'verified' ? 'success' : 'error');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-2xl font-bold text-on-surface">Verify NGOs & Trusts</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Review registration certificates for NGOs and shelter trusts.</p>
        </div>

        {pending.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">task_alt</span>
            <p className="text-sm font-bold text-on-surface">All NGO applications reviewed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border border-[#e1bfb5]/40 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-on-surface">{p.business_name || p.full_name}</p>
                    <p className="text-xs text-on-surface-variant">{p.email} • {p.phone}</p>
                    <p className="text-xs text-on-surface-variant">{p.address}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold">⏳ Pending</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.registration_cert_url && <a href={p.registration_cert_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">description</span>Reg. Certificate</a>}
                  {p.entity_photo_url && <a href={p.entity_photo_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">photo</span>Shelter Photo</a>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleVerify(p.id, 'verified')} className="px-4 py-2 rounded-full bg-[#eaf4ee] text-[#005236] text-xs font-bold hover:opacity-80">✓ Approve</button>
                  <button onClick={() => handleVerify(p.id, 'rejected')} className="px-4 py-2 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-bold hover:opacity-80">✗ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
