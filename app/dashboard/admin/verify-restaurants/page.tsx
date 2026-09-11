'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DataService } from '@/lib/services/dataService';
import { UserProfile } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function AdminVerifyRestaurantsPage() {
  const { user: admin, showToast } = useAuth();
  const [pending, setPending] = useState<UserProfile[]>(() => DataService.getProfiles().filter(p => p.role === 'restaurant' && p.verified_status === 'pending'));
  const [rejectingUser, setRejectingUser] = useState<UserProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleVerify = (userId: string, status: 'verified' | 'rejected', reason?: string) => {
    DataService.verifyUser(userId, status, reason, admin?.id);
    setPending(prev => prev.filter(p => p.id !== userId));
    showToast(`Restaurant ${status === 'verified' ? 'approved' : 'rejected'} successfully.`, status === 'verified' ? 'success' : 'error');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingUser) return;
    if (!rejectionReason.trim()) {
      showToast('Please enter a rejection reason before confirming.', 'error');
      return;
    }
    handleVerify(rejectingUser.id, 'rejected', rejectionReason.trim());
    setRejectingUser(null);
    setRejectionReason('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-2xl font-bold text-on-surface">Verify Restaurants</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Review FSSAI certificates and approve or reject new restaurant registrations.</p>
        </div>

        {pending.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">task_alt</span>
            <p className="text-sm font-bold text-on-surface">All restaurant applications reviewed!</p>
            <p className="text-xs text-on-surface-variant">No pending restaurant verifications at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border border-[#e1bfb5]/40 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-on-surface">{p.business_name || p.full_name}</p>
                    <p className="text-xs text-on-surface-variant">{p.email} • {p.phone}</p>
                    {p.fssai_number && <p className="text-xs text-primary font-bold">FSSAI License: {p.fssai_number}</p>}
                    <p className="text-xs text-on-surface-variant">{p.address}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold">⏳ Pending</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.fssai_cert_url && <a href={p.fssai_cert_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">description</span>FSSAI Cert</a>}
                  {p.entity_photo_url && <a href={p.entity_photo_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">photo</span>Kitchen Photo</a>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleVerify(p.id, 'verified')} className="px-4 py-2 rounded-full bg-[#eaf4ee] text-[#005236] text-xs font-bold hover:opacity-80 transition-all flex items-center gap-1">✓ Approve</button>
                  <button onClick={() => { setRejectingUser(p); setRejectionReason(''); }} className="px-4 py-2 rounded-full bg-[#ffdad6] text-[#93000a] text-xs font-bold hover:opacity-80 transition-all flex items-center gap-1">✗ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Reason Modal */}
        {rejectingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e1bfb5]/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-on-surface">Reject Verification</h3>
                  <p className="text-xs text-on-surface-variant">{rejectingUser.business_name || rejectingUser.full_name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRejectingUser(null)}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <form onSubmit={handleConfirmReject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Custom Rejection Reason (Required) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder="Specify why this application was rejected (e.g. Invalid FSSAI license number, blurry certificate photo)..."
                    className="w-full p-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-[11px] text-on-surface-variant mt-1">This reason will be displayed on the restaurant's profile and sent via notification.</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectingUser(null)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-on-surface hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-[#ffdad6] text-[#93000a] hover:bg-red-200 text-xs font-bold transition-all"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

