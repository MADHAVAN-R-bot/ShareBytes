'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DataService } from '@/lib/services/dataService';
import { UserProfile, UserRole } from '@/lib/types';

const roleColor: Record<UserRole, string> = {
  customer: 'bg-primary-fixed/30 text-primary',
  restaurant: 'bg-[#fff8f6] text-on-surface',
  food_donor: 'bg-[#eaf4ee] text-[#005236]',
  ngo: 'bg-secondary-fixed/30 text-secondary',
  admin: 'bg-on-surface/10 text-on-surface',
};

export default function AdminManageUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const allProfiles = DataService.getProfiles();

  const filtered = allProfiles.filter(p => {
    const matchSearch = p.full_name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || p.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-2xl font-bold text-on-surface">Manage Users</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Browse and search all registered platform users.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-on-surface-variant text-[20px]">search</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)} className="px-4 py-2.5 rounded-2xl bg-white border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="restaurant">Restaurant</option>
            <option value="food_donor">Food Donor</option>
            <option value="ngo">NGO/Trust</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-[#e1bfb5]/40 shadow-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-surface-container-low border-b border-[#e1bfb5]/40">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-on-surface-variant uppercase text-[10px] tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'}`}>
                  <td className="px-4 py-3 font-bold text-on-surface">{p.full_name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{p.email}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${roleColor[p.role]}`}>{p.role.replace('_', ' ')}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.verified_status === 'verified' ? 'bg-[#eaf4ee] text-[#005236]' : p.verified_status === 'rejected' ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-tertiary-container text-on-tertiary-container'}`}>{p.verified_status}</span></td>
                  <td className="px-4 py-3 text-on-surface-variant">{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-8 text-center text-xs text-on-surface-variant">No users match your search.</div>}
        </div>
        <p className="text-xs text-on-surface-variant">{filtered.length} of {allProfiles.length} users shown</p>
      </div>
    </DashboardLayout>
  );
}
