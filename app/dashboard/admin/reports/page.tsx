'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AdminReportsPage() {
  const [reports] = useState<any[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('sb_reports') || '[]');
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-2xl font-bold text-on-surface">User Reports</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Submitted problem reports and platform bug reports from users.</p>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">bug_report</span>
            <p className="text-sm font-bold text-on-surface">No reports submitted yet</p>
            <p className="text-xs text-on-surface-variant">Reports submitted from the Help Center will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((r: any) => (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-[#e1bfb5]/40 shadow-sm space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-bold text-on-surface">{r.subject}</p>
                  <span className="text-[11px] text-on-surface-variant shrink-0">{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                <p className="text-xs text-on-surface-variant">{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
