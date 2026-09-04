'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import VerifyDocModal from '@/components/Modals/VerifyDocModal';
import { DataService } from '@/lib/services/dataService';
import { UserProfile, AuditLog } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { showToast } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const loadData = () => {
    const pending = DataService.getPendingProfiles();
    const profiles = DataService.getProfiles();
    const logs = DataService.getAuditLogs();
    const platformStats = DataService.getPlatformStats();

    setPendingUsers(pending);
    setAllUsers(profiles);
    setAuditLogs(logs);
    setStats(platformStats);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReviewUser = (u: UserProfile) => {
    setSelectedUser(u);
    setIsVerifyModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
              Platform Administration HQ
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Verification & Analytics Command Center
            </h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Review commercial FSSAI & NGO registration certificates, track platform impact metrics, and audit actions.
            </p>
          </div>

          <div className="bg-[#eaf4ee] px-4 py-2 rounded-full border border-[#6ffbbe]/50 text-xs font-bold text-[#005236] flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse" />
            <span>Platform Status: Healthy (All Nodes Active)</span>
          </div>
        </div>

        {/* Platform Stat Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-[#e1bfb5]/40 shadow-sm">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase">Pending Verifications</span>
              <div className="text-3xl font-bold text-primary mt-1">{stats.pendingVerificationsCount}</div>
              <p className="text-[11px] text-on-surface-variant font-medium mt-1">Requires document review</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e1bfb5]/40 shadow-sm">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase">Total Meals Rescued</span>
              <div className="text-3xl font-bold text-on-surface mt-1">{stats.totalMealsRescued.toLocaleString()}</div>
              <p className="text-[11px] text-[#005236] font-bold mt-1">+{stats.co2DivertedKg} kg CO₂ diverted</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e1bfb5]/40 shadow-sm">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase">Verified Partners</span>
              <div className="text-3xl font-bold text-on-surface mt-1">{stats.verifiedPartnersCount}</div>
              <p className="text-[11px] text-on-surface-variant font-medium mt-1">Active kitchens & NGOs</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#e1bfb5]/40 shadow-sm">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase">Active Listings</span>
              <div className="text-3xl font-bold text-on-surface mt-1">{stats.activeListingsCount}</div>
              <p className="text-[11px] text-on-surface-variant font-medium mt-1">Live surplus batches</p>
            </div>
          </div>
        )}

        {/* Verification Queue Table */}
        <div id="queue" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Partner Verification Queue</h2>
              <p className="text-xs text-on-surface-variant font-medium">
                Review FSSAI licenses and NGO registration documents uploaded during signup.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {pendingUsers.length} Pending Approval
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-[#e1bfb5]/40 overflow-hidden shadow-sm">
            {pendingUsers.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <span className="material-symbols-outlined text-[#006c49] text-[40px]">check_circle</span>
                <p className="text-xs font-bold text-on-surface">Verification Queue Cleared!</p>
                <p className="text-[11px] text-on-surface-variant">All partner applications have been reviewed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase font-bold border-b border-[#e1bfb5]/30">
                      <th className="p-4">Business / Entity</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Contact Email</th>
                      <th className="p-4">Doc Upload Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium">
                    {pendingUsers.map(u => (
                      <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="p-4 font-bold text-on-surface">
                          {u.business_name || u.full_name}
                          <span className="block text-[11px] text-on-surface-variant font-normal">{u.address || 'Chennai'}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase text-[10px]">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-on-surface-variant">{u.email}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-[#005236] font-bold text-[11px]">
                            <span className="material-symbols-outlined text-[16px]">task</span>
                            Doc & Photo Attached
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleReviewUser(u)}
                            className="px-4 py-2 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            Review Application
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Platform Users Directory */}
        <div id="users" className="space-y-4 pt-4 border-t border-gray-200">
          <h2 className="text-lg font-bold text-on-surface">Registered User Directory ({allUsers.length})</h2>

          <div className="bg-white rounded-3xl border border-[#e1bfb5]/40 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase font-bold border-b border-[#e1bfb5]/30">
                    <th className="p-4">Name / Entity</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-medium">
                  {allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-4 font-bold text-on-surface">{u.business_name || u.full_name}</td>
                      <td className="p-4 text-on-surface-variant">{u.email}</td>
                      <td className="p-4 uppercase text-[11px] font-bold">{u.role}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.verified_status === 'verified'
                            ? 'bg-[#eaf4ee] text-[#005236]'
                            : u.verified_status === 'rejected'
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : 'bg-tertiary-container text-on-tertiary-container'
                        }`}>
                          {u.verified_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div id="audit" className="space-y-4 pt-4 border-t border-gray-200">
          <h2 className="text-lg font-bold text-on-surface">Platform Audit Log</h2>

          <div className="bg-white rounded-3xl border border-[#e1bfb5]/40 p-5 space-y-3 shadow-sm">
            {auditLogs.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low text-xs border border-[#e1bfb5]/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
                  <div>
                    <span className="font-bold text-on-surface">{a.action}: </span>
                    <span className="text-on-surface-variant">{a.target}</span>
                    <span className="text-[11px] text-gray-400 block font-normal">By {a.actor_email}</span>
                  </div>
                </div>

                <span className="text-[11px] text-on-surface-variant font-medium">
                  {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <VerifyDocModal
        userProfile={selectedUser}
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onSuccess={loadData}
      />
    </DashboardLayout>
  );
}
