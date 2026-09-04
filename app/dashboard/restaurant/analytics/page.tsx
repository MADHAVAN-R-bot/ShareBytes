'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';

export default function RestaurantAnalyticsPage() {
  const { user } = useAuth();
  const listings = user ? DataService.getListingsByUser(user.id) : [];
  const claims = user ? DataService.getClaimsForListingOwner(user.id) : [];

  const totalPortionsPosted = listings.reduce((acc, l) => acc + l.portion_count, 0);
  const totalRevenue = claims.filter(c => c.status === 'accepted' || c.status === 'completed').reduce((acc, c) => acc + (c.listing?.discounted_price || 0) * c.portion_count, 0);
  const donationCount = listings.filter(l => l.is_donation_only).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Restaurant Portal</div>
          <h1 className="text-2xl font-bold text-on-surface">Analytics</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Your ShareBytes performance at a glance.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Listings Posted', val: listings.length, icon: 'takeout_dining', color: 'bg-primary-fixed text-primary' },
            { label: 'Total Claims', val: claims.length, icon: 'receipt_long', color: 'bg-[#eaf4ee] text-[#005236]' },
            { label: 'Portions Posted', val: totalPortionsPosted, icon: 'set_meal', color: 'bg-tertiary-container text-on-tertiary-container' },
            { label: 'Revenue (₹)', val: `₹${totalRevenue}`, icon: 'payments', color: 'bg-[#fff8f6] text-on-surface' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#e1bfb5]/40 p-5 shadow-sm space-y-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
              </div>
              <p className="text-2xl font-bold text-on-surface">{s.val}</p>
              <p className="text-xs font-bold text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#e1bfb5]/40 p-6 shadow-sm">
          <h2 className="text-base font-bold text-on-surface mb-4">Recent Claims</h2>
          {claims.slice(0, 8).map(c => (
            <div key={c.id} className="py-3 border-b border-gray-100 last:border-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface">{c.listing?.title}</p>
                <p className="text-[11px] text-on-surface-variant">{c.portion_count} portion(s) • {new Date(c.created_at).toLocaleDateString('en-IN')}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.status === 'accepted' ? 'bg-[#eaf4ee] text-[#005236]' : c.status === 'pending' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-container text-on-surface-variant'}`}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
