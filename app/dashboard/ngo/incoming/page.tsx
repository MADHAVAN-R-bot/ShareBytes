'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ListingCard from '@/components/ListingCard';
import ClaimModal from '@/components/Modals/ClaimModal';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { FoodListing } from '@/lib/types';

export default function NGOIncomingRequestsPage() {
  const { role } = useAuth();
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
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">NGO / Trust Portal</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Incoming Surplus Requests</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Browse available commercial restaurant food and donor catering surpluses ready for immediate allocation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
          <div className="inline-flex p-1 bg-surface-container rounded-2xl">
            <button
              onClick={() => setActiveTab('restaurant')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'restaurant' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">restaurant</span>
              Restaurant Surplus ({restaurantListings.length})
            </button>
            <button
              onClick={() => setActiveTab('donor')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'donor' ? 'bg-white text-[#006c49] shadow-sm' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
              Food Donor Surplus ({donorListings.length})
            </button>
          </div>

          <span className="text-xs text-on-surface-variant font-medium">
            Showing {displayedListings.length} active allocation feed(s)
          </span>
        </div>

        {/* Feed list */}
        {displayedListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-2">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">inbox</span>
            <p className="text-xs font-bold text-on-surface-variant">No active incoming surplus in this category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedListings.map(l => (
              <ListingCard
                key={l.id}
                listing={l}
                onClaim={handleClaimClick}
                actionText="Reserve for NGO"
                viewerRole="ngo"
              />
            ))}
          </div>
        )}
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
