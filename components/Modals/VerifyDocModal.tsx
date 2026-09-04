'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserProfile } from '@/lib/types';
import { DataService } from '@/lib/services/dataService';
import { useAuth } from '@/context/AuthContext';

interface VerifyDocModalProps {
  userProfile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerifyDocModal({ userProfile, isOpen, onClose, onSuccess }: VerifyDocModalProps) {
  const { user: adminUser, showToast } = useAuth();
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !userProfile) return null;

  const certUrl = userProfile.fssai_cert_url || userProfile.registration_cert_url;
  const photoUrl = userProfile.entity_photo_url;

  const handleApprove = () => {
    setIsSubmitting(true);
    try {
      DataService.verifyUser(userProfile.id, 'verified', undefined, adminUser?.id);
      showToast(`Approved verification for ${userProfile.business_name || userProfile.full_name}`, 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      showToast('Please specify a rejection reason for the applicant', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      DataService.verifyUser(userProfile.id, 'rejected', rejectReason, adminUser?.id);
      showToast(`Rejected application for ${userProfile.business_name || userProfile.full_name}`, 'info');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#e1bfb5]/40 max-h-[90vh] overflow-y-auto my-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-on-surface">Verification Review</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                {userProfile.role}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Submitted by {userProfile.business_name || userProfile.full_name} ({userProfile.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-2xl text-xs space-y-1">
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Business / Entity</span>
            <span className="font-bold text-on-surface">{userProfile.business_name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Contact Email</span>
            <span className="font-bold text-on-surface">{userProfile.email}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Phone</span>
            <span className="font-bold text-on-surface">{userProfile.phone || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Location Address</span>
            <span className="font-bold text-on-surface">{userProfile.address || 'N/A'}</span>
          </div>
        </div>

        {/* Uploaded Documents Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Uploaded Compliance Documents</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Certificate */}
            <div className="border border-[#e1bfb5]/40 rounded-2xl p-3 bg-surface-container-lowest">
              <span className="text-[11px] font-bold text-on-surface block mb-2">
                {userProfile.role === 'restaurant' ? 'FSSAI License Certificate' : 'NGO Registration Certificate'}
              </span>
              {certUrl ? (
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-100 border">
                  <img src={certUrl} alt="Certificate Document" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-44 rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant text-xs font-medium">
                  <span className="material-symbols-outlined text-[32px] text-gray-400 mb-1">description</span>
                  No certificate file uploaded
                </div>
              )}
            </div>

            {/* Kitchen / Entity Photo */}
            <div className="border border-[#e1bfb5]/40 rounded-2xl p-3 bg-surface-container-lowest">
              <span className="text-[11px] font-bold text-on-surface block mb-2">Premises & Kitchen Photo</span>
              {photoUrl ? (
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-gray-100 border">
                  <img src={photoUrl} alt="Premises Photo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-44 rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant text-xs font-medium">
                  <span className="material-symbols-outlined text-[32px] text-gray-400 mb-1">photo_camera</span>
                  No premises photo uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reject Reason Sub-form */}
        {showRejectForm && (
          <form onSubmit={handleReject} className="bg-error-container/30 p-4 rounded-2xl border border-error/30 space-y-3">
            <label className="block text-xs font-bold text-[#93000a]">Specify Rejection Reason (Required) *</label>
            <textarea
              required
              rows={2}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. FSSAI registration certificate is blurred / expired. Please re-upload clear document."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#ba1a1a]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ba1a1a]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-1.5 rounded-full bg-[#ba1a1a] text-white text-xs font-bold shadow-sm hover:bg-[#93000a]"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        )}

        {/* Bottom Actions */}
        {!showRejectForm && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowRejectForm(true)}
              className="px-5 py-2.5 rounded-full border border-tertiary text-tertiary font-bold text-xs hover:bg-tertiary-container/20 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
              Reject Application
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-full border border-[#e1bfb5] text-xs font-bold text-on-surface hover:bg-surface-container"
              >
                Close
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-secondary text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 hover:opacity-95"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                {isSubmitting ? 'Approving...' : 'Approve Partner'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
