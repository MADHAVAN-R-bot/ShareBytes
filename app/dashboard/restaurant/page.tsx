'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ListingCard from '@/components/ListingCard';
import AddListingModal from '@/components/Modals/AddListingModal';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { FoodListing, FoodClaim } from '@/lib/types';

export default function RestaurantDashboard() {
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

  const handleClaimStatus = (claimId: string, status: 'accepted' | 'declined') => {
    try {
      DataService.updateClaimStatus(claimId, status);
      showToast(`Claim request ${status}!`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleDeleteListing = (id: string) => {
    if (confirm('Are you sure you want to remove this food listing?')) {
      DataService.deleteListing(id);
      showToast('Listing removed', 'info');
      loadData();
    }
  };

  const activeCount = listings.filter(l => l.status === 'available').length;
  const claimedCount = claims.filter(c => c.status === 'accepted' || c.status === 'completed').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Verification Status Callout Banner */}
        <div className="bg-[#eaf4ee] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-[#6ffbbe]/50 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-bold text-[#005236] uppercase tracking-wider">
              Restaurant Partner Status:
            </span>
            <span className="text-xs font-bold text-secondary">Verified Partner</span>
            <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
          </div>
          <div className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
            <span>Daily food recovery sync active</span>
          </div>
        </div>

        {/* Page Header + Add Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              {user?.business_name || 'Golden Harvest Bakery'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Good day, {user?.full_name || 'Golden Harvest Bakery'}
            </h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Here is your live surplus distribution and incoming community claims for today.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-12 px-6 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Add Food Listing</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[26px]">restaurant_menu</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed text-[11px] font-bold">
                Live Now
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-on-surface leading-none">{activeCount}</div>
              <div className="text-xs font-bold text-on-surface mt-1">Active Food Batches</div>
              <p className="text-[11px] text-on-surface-variant font-medium mt-1">Surplus portions open for claim</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[26px]">shopping_bag</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/50 text-[#005236] text-[11px] font-bold">
                +12% vs yesterday
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-on-surface leading-none">{claimedCount}</div>
              <div className="text-xs font-bold text-on-surface mt-1">Meals Claimed Today</div>
              <p className="text-[11px] text-on-surface-variant font-medium mt-1">Accepted by NGOs & local neighbors</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[26px]">eco</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-[11px] font-bold">
                Hero Tier 3
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-on-surface leading-none">412 kg</div>
              <div className="text-xs font-bold text-on-surface mt-1">Total Surplus Diverted</div>
              <p className="text-[11px] text-on-surface-variant font-medium mt-1">Est. 1,030 kg CO₂ diverted from landfills</p>
            </div>
          </div>
        </div>

        {/* Operational Section: Active Listings & Incoming Claims */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Listings Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Active Surplus Listings</h2>
                <p className="text-xs text-on-surface-variant">Real-time portions available for pickup by community partners</p>
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#e1bfb5]/40 space-y-3">
                <span className="material-symbols-outlined text-gray-300 text-[48px]">no_food</span>
                <p className="text-xs font-bold text-on-surface-variant">No active listings created yet.</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-xs shadow-sm"
                >
                  + Add First Food Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Incoming Claims Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Incoming Requests</h2>
              <p className="text-xs text-on-surface-variant">NGO and customer pickup claims</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#e1bfb5]/40 space-y-4 shadow-sm">
              {claims.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-6">No incoming claims at the moment.</p>
              ) : (
                claims.map(c => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/30 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-on-surface block">
                          {c.claimer?.business_name || c.claimer?.full_name || 'Community Member'}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-medium">
                          {c.portion_count} portion(s) • {c.delivery_requested ? 'Delivery' : 'Pickup'}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.status === 'accepted' ? 'bg-[#eaf4ee] text-[#005236]' : c.status === 'declined' ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-tertiary-container text-on-tertiary-container'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-on-surface-variant truncate font-medium">
                      Listing: {c.listing?.title || 'Surplus Meal'}
                    </p>

                    {c.status === 'pending' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleClaimStatus(c.id, 'declined')}
                          className="flex-1 py-1.5 rounded-full border border-tertiary text-tertiary font-bold text-[11px] hover:bg-tertiary-container/20"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleClaimStatus(c.id, 'accepted')}
                          className="flex-1 py-1.5 rounded-full bg-secondary text-white font-bold text-[11px] shadow-sm hover:opacity-95"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
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
