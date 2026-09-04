'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ListingCard from '@/components/ListingCard';
import AddListingModal from '@/components/Modals/AddListingModal';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { FoodListing, FoodClaim } from '@/lib/types';

export default function FoodDonorDashboard() {
  const { user, showToast } = useAuth();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [claims, setClaims] = useState<FoodClaim[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadData = () => {
    if (!user) return;
    const userListings = DataService.getListingsByUser(user.id);
    const ownerClaims = DataService.getClaimsForListingOwner(user.id);
    setListings(userListings);
    setClaims(ownerClaims);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleDeleteListing = (id: string) => {
    if (confirm('Remove this donation listing?')) {
      DataService.deleteListing(id);
      showToast('Donation listing removed', 'info');
      loadData();
    }
  };

  const totalMealsDonated = listings.reduce((acc, l) => acc + l.portion_count, 120);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
              Food Donor Partner Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Welcome, {user?.business_name || user?.full_name || 'Anand Caterers'}
            </h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Donate banquet, event, or function surplus food directly to verified shelters & NGOs.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-12 px-6 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
            <span>+ Post Event Donation</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1bfb5]/40">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[26px]">favorite</span>
              </div>
              <span className="text-[11px] font-bold text-[#005236] bg-[#eaf4ee] px-2.5 py-1 rounded-full">
                Verified Donor
              </span>
            </div>
            <div className="text-3xl font-bold text-on-surface">{totalMealsDonated}</div>
            <div className="text-xs font-bold text-on-surface mt-1">Total Meals Shared</div>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1">Direct community nourishment</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1bfb5]/40">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[26px]">handshake</span>
              </div>
              <span className="text-[11px] font-bold text-secondary bg-secondary-fixed/40 px-2.5 py-1 rounded-full">
                4 Shelters
              </span>
            </div>
            <div className="text-3xl font-bold text-on-surface">{claims.length}</div>
            <div className="text-xs font-bold text-on-surface mt-1">NGO Handover Batches</div>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1">Bulk trays claimed by verified trusts</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1bfb5]/40">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[26px]">eco</span>
              </div>
              <span className="text-[11px] font-bold text-on-surface bg-surface-container px-2.5 py-1 rounded-full">
                Zero Waste
              </span>
            </div>
            <div className="text-3xl font-bold text-on-surface">360 kg</div>
            <div className="text-xs font-bold text-on-surface mt-1">CO₂ Diverted</div>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1">Environmental impact recorded</p>
          </div>
        </div>

        {/* Active Donations Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-on-surface">Active Surplus Donations</h2>

          {listings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#e1bfb5]/40 space-y-3">
              <span className="material-symbols-outlined text-gray-300 text-[48px]">volunteer_activism</span>
              <p className="text-xs font-bold text-on-surface-variant">No active donations posted yet.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-xs shadow-sm"
              >
                + Post Event Donation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(l => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  isOwner={true}
                  onDelete={handleDeleteListing}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />
    </DashboardLayout>
  );
}
