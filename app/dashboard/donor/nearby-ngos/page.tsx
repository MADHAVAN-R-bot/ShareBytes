'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DataService } from '@/lib/services/dataService';

export default function DonorNearbyNGOsPage() {
  const ngos = DataService.getProfiles().filter(p => p.role === 'ngo' && p.verified_status === 'verified');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Food Donor Portal</div>
          <h1 className="text-2xl font-bold text-on-surface">Nearby NGOs & Shelters</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Verified NGOs and shelters you can contact to arrange direct donations.</p>
        </div>

        {ngos.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">handshake</span>
            <p className="text-xs font-bold text-on-surface-variant">No verified NGOs found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ngos.map(ngo => (
              <div key={ngo.id} className="bg-white rounded-2xl border border-[#e1bfb5]/40 p-5 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#006c49]/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#006c49] text-[24px]">handshake</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-on-surface">{ngo.business_name || ngo.full_name}</p>
                  <p className="text-xs text-on-surface-variant">{ngo.address}</p>
                  {ngo.phone && <p className="text-xs text-on-surface font-bold">{ngo.phone}</p>}
                  <span className="inline-block px-2 py-0.5 rounded-full bg-[#eaf4ee] text-[#005236] text-[10px] font-bold">✓ Verified Shelter</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
