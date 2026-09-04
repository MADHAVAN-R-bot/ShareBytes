'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';

export default function RestaurantDonationsPage() {
  const { user } = useAuth();
  const donations = user ? DataService.getListingsByUser(user.id).filter(l => l.is_donation_only) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Restaurant Portal</div>
          <h1 className="text-2xl font-bold text-on-surface">Donations</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Your free donation listings — batches offered to NGOs and shelters.</p>
        </div>
        {donations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">volunteer_activism</span>
            <p className="text-sm font-bold text-on-surface">No donation listings yet</p>
            <p className="text-xs text-on-surface-variant">Post a donation listing from your Overview to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {donations.map(d => (
              <div key={d.id} className="bg-white rounded-2xl border border-[#e1bfb5]/40 p-5 shadow-sm space-y-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-bold text-on-surface">{d.title}</p>
                  <span className="px-2 py-0.5 rounded-full bg-[#eaf4ee] text-[#005236] text-[10px] font-bold">Free</span>
                </div>
                <p className="text-xs text-on-surface-variant">{d.portion_count} portions • Expires: {new Date(d.expiry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${d.status === 'available' ? 'bg-[#eaf4ee] text-[#005236]' : 'bg-surface-container text-on-surface-variant'}`}>{d.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
