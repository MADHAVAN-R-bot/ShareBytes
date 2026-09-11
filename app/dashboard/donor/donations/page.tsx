'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ListingCard from '@/components/ListingCard';
import AddListingModal from '@/components/Modals/AddListingModal';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { FoodListing } from '@/lib/types';

export default function DonorDonationsPage() {
  const { user, role, showToast } = useAuth();
  const [donations, setDonations] = useState<FoodListing[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadDonations = () => {
    if (user) {
      const myDonations = DataService.getListingsByUser(user.id);
      setDonations(myDonations);
    } else {
      setDonations(DataService.getListings().filter(l => l.role_type === 'food_donor'));
    }
  };

  useEffect(() => {
    loadDonations();
  }, [user]);

  const handleDeleteDonation = (id: string) => {
    DataService.deleteListing(id);
    showToast('Donation listing deleted', 'info');
    loadDonations();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Food Donor Portal</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">My Food Donations</h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Track surplus event trays and groceries posted for verified shelter rescue.</p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-full bg-[#006c49] hover:bg-[#005236] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            + Publish New Donation
          </button>
        </div>

        {donations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">volunteer_activism</span>
            <p className="text-xs font-bold text-on-surface-variant">No active donations posted yet.</p>
            <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 rounded-full bg-[#006c49] text-white text-xs font-bold shadow-sm">
              Post Surplus Donation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map(d => (
              <ListingCard
                key={d.id}
                listing={d}
                isOwner={true}
                onDelete={handleDeleteDonation}
                viewerRole={role}
              />
            ))}
          </div>
        )}
      </div>

      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadDonations}
      />
    </DashboardLayout>
  );
}
