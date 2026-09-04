'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ListingCard from '@/components/ListingCard';
import ClaimModal from '@/components/Modals/ClaimModal';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { FoodListing } from '@/lib/types';

export default function NGODashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'restaurant' | 'donor'>('restaurant');
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const loadData = () => {
    const allListings = DataService.getNGOListings();
    setListings(allListings);
  };

  useEffect(() => {
    loadData();
  }, []);

  const restaurantListings = listings.filter(l => l.role_type === 'restaurant');
  const donorListings = listings.filter(l => l.role_type === 'food_donor');
  const displayedListings = activeTab === 'restaurant' ? restaurantListings : donorListings;

  const handleClaimClick = (listing: FoodListing) => {
    setSelectedListing(listing);
    setIsClaimModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* NGO Exclusive Priority Window Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[#ffe9e2] p-6 border border-primary/20 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[28px]">timer</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                    Exclusive Advance Window
                  </span>
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    90 Minutes Priority Access
                  </span>
                </div>
                <h2 className="text-lg font-bold text-on-surface">
                  Exclusive NGO Bulk Priority Window Active
                </h2>
                <p className="text-xs text-on-surface-variant font-medium">
                  You have priority rights to large banquet, hotel, and restaurant surpluses for verified shelters.
                </p>
              </div>
            </div>

            <div className="bg-white px-4 py-2 rounded-2xl border border-primary/20 shadow-sm shrink-0">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Window Closes In</span>
              <span className="text-lg font-bold text-primary">01:19:20</span>
            </div>
          </div>
        </div>

        {/* 3 Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1bfb5]/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Meals Delivered</span>
              <div className="text-3xl font-bold text-on-surface mt-1">1,420</div>
              <span className="text-xs text-secondary font-bold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                +18% this month
              </span>
            </div>
            <span className="material-symbols-outlined text-primary text-[36px] opacity-40">soup_kitchen</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1bfb5]/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Shelters Supported</span>
              <div className="text-3xl font-bold text-on-surface mt-1">4</div>
              <span className="text-xs text-[#006c49] font-bold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                All drops active
              </span>
            </div>
            <span className="material-symbols-outlined text-[#006c49] text-[36px] opacity-40">handshake</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1bfb5]/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Active Requests</span>
              <div className="text-3xl font-bold text-on-surface mt-1">3</div>
              <span className="text-xs text-primary font-bold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                1 pending driver pickup
              </span>
            </div>
            <span className="material-symbols-outlined text-tertiary text-[36px] opacity-40">local_shipping</span>
          </div>
        </div>

        {/* 2 Separate Tab Views: Restaurant Surplus vs Food Donor Surplus */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-on-surface">NGO Emergency Surplus Feed</h2>
              <p className="text-xs text-on-surface-variant font-medium">
                Switch between commercial restaurant items and event food donor surpluses.
              </p>
            </div>

            {/* View Tabs */}
            <div className="inline-flex p-1 bg-surface-container rounded-2xl">
              <button
                onClick={() => setActiveTab('restaurant')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'restaurant' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">restaurant</span>
                Restaurant Surplus ({restaurantListings.length})
              </button>
              <button
                onClick={() => setActiveTab('donor')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'donor' ? 'bg-white text-[#006c49] shadow-sm' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                Food Donor Surplus ({donorListings.length})
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          {displayedListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#e1bfb5]/40 py-12">
              <span className="material-symbols-outlined text-gray-300 text-[48px]">check_circle</span>
              <p className="text-xs font-bold text-on-surface-variant mt-2">
                No active listings currently available in this category. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedListings.map(l => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  onClaim={handleClaimClick}
                  actionText="Reserve for NGO"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ClaimModal
        listing={selectedListing}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSuccess={loadData}
      />
    </DashboardLayout>
  );
}
