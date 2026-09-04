'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AdminContactMessagesPage() {
  const [messages] = useState<any[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('sb_contact_messages') || '[]');
  });

  const typeLabel = (type: string) => type === 'admin_contact' ? 'Help → Admin' : 'Contact Page';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-2xl font-bold text-on-surface">Contact Messages</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Messages received from the Help Center and Contact page.</p>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">mail</span>
            <p className="text-sm font-bold text-on-surface">No messages yet</p>
            <p className="text-xs text-on-surface-variant">Contact form submissions and Help Center admin messages will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m: any) => (
              <div key={m.id} className="bg-white p-5 rounded-2xl border border-[#e1bfb5]/40 shadow-sm space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-on-surface">{m.name || 'Anonymous'}</p>
                    <p className="text-xs text-on-surface-variant">{m.email}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[11px] text-on-surface-variant">{new Date(m.created_at).toLocaleDateString('en-IN')}</span>
                    <p className="block px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">{typeLabel(m.type)}</p>
                  </div>
                </div>
                {m.subject && <p className="text-xs font-bold text-on-surface">Re: {m.subject}</p>}
                <p className="text-xs text-on-surface-variant">{m.message}</p>
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  <span className="material-symbols-outlined text-[14px]">reply</span>
                  Reply via email
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
