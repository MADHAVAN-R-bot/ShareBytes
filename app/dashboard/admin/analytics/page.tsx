'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DataService } from '@/lib/services/dataService';

export default function AdminAnalyticsPage() {
  const profiles = DataService.getProfiles();
  const listings = DataService.getListings();
  const claims = DataService.getClaims();

  const totalMealsRescued = claims.filter(c => c.status === 'accepted' || c.status === 'completed').reduce((a, c) => a + c.portion_count, 0);
  const pendingVerifications = profiles.filter(p => p.verified_status === 'pending').length;
  const activeDonations = listings.filter(l => l.is_donation_only && l.status === 'available').length;

  const stats = [
    { label: 'Total Users', val: profiles.length, icon: 'group', color: 'bg-primary-fixed text-primary' },
    { label: 'Active Listings', val: listings.filter(l => l.status === 'available').length, icon: 'takeout_dining', color: 'bg-[#eaf4ee] text-[#005236]' },
    { label: 'Meals Rescued', val: totalMealsRescued, icon: 'restaurant', color: 'bg-tertiary-container text-on-tertiary-container' },
    { label: 'Total Claims', val: claims.length, icon: 'receipt_long', color: 'bg-surface-container text-on-surface' },
    { label: 'Pending Verifications', val: pendingVerifications, icon: 'hourglass_top', color: 'bg-[#fff8f6] text-on-surface' },
    { label: 'Active Donations', val: activeDonations, icon: 'volunteer_activism', color: 'bg-[#eaf4ee] text-[#005236]' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-2xl font-bold text-on-surface">Platform Analytics</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Live platform statistics across all roles and listings.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#e1bfb5]/40 p-5 shadow-sm space-y-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
              </div>
              <p className="text-3xl font-bold text-on-surface">{s.val}</p>
              <p className="text-xs font-bold text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Role breakdown */}
        <div className="bg-white rounded-2xl border border-[#e1bfb5]/40 p-5 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-on-surface">Users by Role</h2>
          {(['customer', 'restaurant', 'food_donor', 'ngo', 'admin'] as const).map(role => {
            const count = profiles.filter(p => p.role === role).length;
            const pct = Math.round((count / profiles.length) * 100);
            return (
              <div key={role} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                  <span className="capitalize">{role.replace('_', ' ')}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full bg-surface-container-low rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
