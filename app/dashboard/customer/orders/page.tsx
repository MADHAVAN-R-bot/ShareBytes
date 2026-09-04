'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { FoodClaim } from '@/lib/types';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const claims: FoodClaim[] = user ? DataService.getClaimsForUser(user.id) : [];

  const statusColor = (s: string) => s === 'accepted' ? 'bg-[#eaf4ee] text-[#005236]' : s === 'declined' ? 'bg-[#ffdad6] text-[#93000a]' : s === 'completed' ? 'bg-primary-fixed/40 text-primary' : 'bg-tertiary-container text-on-tertiary-container';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Customer Portal</div>
          <h1 className="text-2xl font-bold text-on-surface">My Orders</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">All your meal reservations and claims — past and present.</p>
        </div>

        {claims.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">receipt_long</span>
            <p className="text-xs font-bold text-on-surface-variant">No orders yet. Browse the marketplace to claim a meal!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-[#e1bfb5]/40 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-on-surface">{c.listing?.title || 'Meal Order'}</p>
                  <p className="text-xs text-on-surface-variant">{c.portion_count} portion(s) • {c.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Cash on Pickup'}</p>
                  <p className="text-[11px] text-on-surface-variant">{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${statusColor(c.status)}`}>{c.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
