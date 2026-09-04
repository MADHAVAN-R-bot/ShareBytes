'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function CustomerFavoritesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Customer Portal</div>
          <h1 className="text-2xl font-bold text-on-surface">Favorites</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Your saved restaurants and favourite listings.</p>
        </div>
        <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
          <span className="material-symbols-outlined text-[#e1bfb5] text-[48px]">favorite</span>
          <p className="text-sm font-bold text-on-surface">No favorites saved yet</p>
          <p className="text-xs text-on-surface-variant">Tap the ❤️ icon on any listing in the marketplace to save it here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
