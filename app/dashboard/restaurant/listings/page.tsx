'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ListingCard from '@/components/ListingCard';
import AddListingModal from '@/components/Modals/AddListingModal';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { FoodListing } from '@/lib/types';

export default function RestaurantListingsPage() {
  const { user, role, showToast } = useAuth();
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadListings = () => {
    if (user) {
      const myListings = DataService.getListingsByUser(user.id);
      setListings(myListings);
    } else {
      setListings(DataService.getListings().filter(l => l.role_type === 'restaurant'));
    }
  };

  useEffect(() => {
    loadListings();
  }, [user]);

  const handleDeleteListing = (id: string) => {
    DataService.deleteListing(id);
    showToast('Listing deleted', 'info');
    loadListings();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Restaurant Portal</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Surplus Food Listings</h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Manage active discounted meals and free surplus donations.</p>
          </div>

          <button
            onClick={() => {
              if (user?.verified_status !== 'verified') {
                showToast('Your account must be verified by Admin before you can list food.', 'error');
                return;
              }
              setIsAddModalOpen(true);
            }}
            disabled={user?.verified_status !== 'verified'}
            title={user?.verified_status !== 'verified' ? 'Your account must be verified before you can list food' : ''}
            className={`px-5 py-3 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto ${
              user?.verified_status !== 'verified'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            + Add New Listing
          </button>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">inventory_2</span>
            <p className="text-xs font-bold text-on-surface-variant">No surplus listings created yet.</p>
            <button
              onClick={() => {
                if (user?.verified_status !== 'verified') {
                  showToast('Your account must be verified by Admin before you can list food.', 'error');
                  return;
                }
                setIsAddModalOpen(true);
              }}
              disabled={user?.verified_status !== 'verified'}
              className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                user?.verified_status !== 'verified' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white'
              }`}
            >
              Publish First Listing
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
                viewerRole={role}
              />
            ))}
          </div>
        )}
      </div>

      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadListings}
      />
    </DashboardLayout>
  );
}
