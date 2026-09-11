'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { FoodClaim } from '@/lib/types';

const STAGES = [
  { id: 'confirmed', label: 'Confirmed', icon: 'check_circle' },
  { id: 'preparing', label: 'Preparing', icon: 'skillet' },
  { id: 'ready', label: 'Ready', icon: 'takeout_dining' },
  { id: 'completed', label: 'Picked Up / Delivered', icon: 'local_shipping' },
];

function getStageIndex(status: string): number {
  if (status === 'pending') return 0;
  if (status === 'accepted') return 2; // Ready for pickup
  if (status === 'completed') return 3; // Finished
  return -1; // Declined/cancelled
}

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const claims: FoodClaim[] = user ? DataService.getClaimsForUser(user.id) : [];

  const statusColor = (s: string) =>
    s === 'accepted'
      ? 'bg-[#eaf4ee] text-[#005236]'
      : s === 'declined'
      ? 'bg-[#ffdad6] text-[#93000a]'
      : s === 'completed'
      ? 'bg-primary-fixed/40 text-primary'
      : 'bg-tertiary-container text-on-tertiary-container';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Customer Portal</div>
          <h1 className="text-2xl font-bold text-on-surface">My Orders & Order Tracking</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Real-time step-by-step order tracking for your reserved surplus meals.
          </p>
        </div>

        {claims.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">receipt_long</span>
            <p className="text-xs font-bold text-on-surface-variant">No orders yet. Browse the marketplace to claim a meal!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map(c => {
              const currentStep = getStageIndex(c.status);
              const isDeclined = c.status === 'declined';

              return (
                <div key={c.id} className="bg-white p-6 rounded-3xl border border-[#e1bfb5]/40 shadow-sm space-y-5">
                  {/* Top info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="space-y-0.5">
                      <p className="text-base font-bold text-on-surface">{c.listing?.title || 'Surplus Meal Order'}</p>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {c.listing?.creator_business || c.listing?.creator_name || 'Kitchen Partner'} • {c.portion_count} portion(s) •{' '}
                        <span className="font-bold text-primary">
                          {c.payment_method === 'online' ? 'Paid Online (Razorpay)' : c.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Cash on Pickup'}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-on-surface-variant">
                        {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${statusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Order Status Progress Stepper */}
                  {!isDeclined ? (
                    <div className="pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                        Live Order Progress Tracker
                      </div>
                      <div className="grid grid-cols-4 gap-2 relative">
                        {STAGES.map((stage, idx) => {
                          const isDone = currentStep >= idx;
                          const isCurrent = currentStep === idx;
                          return (
                            <div key={stage.id} className="flex flex-col items-center text-center space-y-1 relative z-10">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                  isDone
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-surface-container-low text-on-surface-variant border border-gray-200'
                                } ${isCurrent ? 'ring-4 ring-primary/20 scale-105' : ''}`}
                              >
                                <span className="material-symbols-outlined text-[18px]">{stage.icon}</span>
                              </div>
                              <span className={`text-[11px] font-bold ${isDone ? 'text-primary' : 'text-on-surface-variant/70'}`}>
                                {stage.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#ffdad6] p-3.5 rounded-2xl border border-[#ffb3ad] text-[#93000a] text-xs font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">cancel</span>
                      <span>This reservation request was declined by the restaurant/donor.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
