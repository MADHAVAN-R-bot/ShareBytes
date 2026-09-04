'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ListingCard from '@/components/ListingCard';
import ClaimModal from '@/components/Modals/ClaimModal';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { FoodListing, FoodClaim } from '@/lib/types';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [myClaims, setMyClaims] = useState<FoodClaim[]>([]);
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non_veg'>('all');
  const [deliveryOnly, setDeliveryOnly] = useState(false);

  const loadData = () => {
    // Customers can ONLY see discounted restaurant listings (never donation-only)
    const customerListings = DataService.getCustomerListings();
    setListings(customerListings);

    if (user) {
      const claims = DataService.getClaimsForUser(user.id);
      setMyClaims(claims);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.pickup_location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = vegFilter === 'all' ? true : l.food_type === vegFilter;
    const matchesDelivery = deliveryOnly ? l.delivery_available : true;
    return matchesSearch && matchesVeg && matchesDelivery;
  });

  const handleClaimClick = (listing: FoodListing) => {
    setSelectedListing(listing);
    setIsClaimModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header & Location Pill */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
              Neighborhood Surplus Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Rescue fresh meals nearby, save up to 80%
            </h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Discounted surplus portions from top restaurants & cafes in your area.
            </p>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-full border border-[#e1bfb5]/40 shadow-sm flex items-center gap-2 text-xs font-bold text-on-surface shrink-0">
            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
            <span>Chennai Central • 2.5 km radius</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#e1bfb5]/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search biryani, bakery, paratha..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Veg/Non-Veg & Delivery Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Veg Pill Filter */}
            <div className="inline-flex p-1 bg-surface-container-low rounded-2xl">
              <button
                onClick={() => setVegFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  vegFilter === 'all' ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant'
                }`}
              >
                All Meals
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  vegFilter === 'veg' ? 'bg-[#eaf4ee] text-[#005236] shadow-sm' : 'text-on-surface-variant'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#006c49]" />
                Veg Only
              </button>
            </div>

            {/* Delivery Toggle */}
            <button
              onClick={() => setDeliveryOnly(!deliveryOnly)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                deliveryOnly
                  ? 'border-primary bg-primary-fixed/30 text-primary'
                  : 'border-[#e1bfb5]/40 bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              Delivery Only
            </button>
          </div>
        </div>

        {/* Listings Catalog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-on-surface">Available Discounted Meals ({filteredListings.length})</h2>
            <span className="text-xs text-on-surface-variant font-medium">Updated 2 minutes ago</span>
          </div>

          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
              <span className="material-symbols-outlined text-gray-300 text-[48px]">search_off</span>
              <p className="text-xs font-bold text-on-surface-variant">No discounted meals match your search filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setVegFilter('all');
                  setDeliveryOnly(false);
                }}
                className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(l => (
                <ListingCard
                  key={l.id}
                  listing={l}
                  onClaim={handleClaimClick}
                  actionText="Claim Discounted Meal"
                />
              ))}
            </div>
          )}
        </div>

        {/* My Reserved Claims Section */}
        {myClaims.length > 0 && (
          <div id="my-claims" className="space-y-4 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-bold text-on-surface">My Meal Reservations</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myClaims.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-2xl border border-[#e1bfb5]/40 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-on-surface block">
                      {c.listing?.title || 'Discounted Surplus Meal'}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">
                      {c.portion_count} portion(s) • Cash on {c.payment_method === 'cash_on_delivery' ? 'Delivery' : 'Pickup'}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    c.status === 'accepted' ? 'bg-[#eaf4ee] text-[#005236]' : c.status === 'declined' ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-tertiary-container text-on-tertiary-container'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
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
