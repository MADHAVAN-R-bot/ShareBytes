'use client';

import React, { useState } from 'react';
import { FoodListing, PaymentMethod } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';

interface ClaimModalProps {
  listing: FoodListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ClaimModal({ listing, isOpen, onClose, onSuccess }: ClaimModalProps) {
  const { user, showToast } = useAuth();
  const [portionCount, setPortionCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_pickup');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !listing) return null;

  const maxPortions = listing.portion_count;
  const isDonation = listing.is_donation_only;
  const totalPrice = isDonation ? 0 : listing.discounted_price * portionCount;

  const handleConfirmClaim = () => {
    if (!user) {
      showToast('Please log in to claim meals', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      DataService.createClaim({
        listing_id: listing.id,
        claimed_by: user.id,
        portion_count: portionCount,
        payment_method: isDonation ? 'cash_on_pickup' : paymentMethod,
        // delivery_requested is derived from paymentMethod choice for paid items
        delivery_requested: !isDonation && paymentMethod === 'cash_on_delivery',
      });

      showToast(isDonation ? 'Donation claimed! Contact the donor for pickup details.' : 'Meal reserved successfully! Present your confirmation at pickup.', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit claim', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e1bfb5]/40 my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-on-surface">{isDonation ? 'Claim Free Donation' : 'Reserve Meal Batch'}</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{listing.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Listing info badges */}
        <div className="flex flex-wrap gap-2">
          {isDonation && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eaf4ee] text-[#005236] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
              Free Donation
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
            listing.delivery_available
              ? 'bg-primary-fixed/30 text-primary'
              : 'bg-surface-container text-on-surface-variant'
          }`}>
            <span className="material-symbols-outlined text-[14px]">{listing.delivery_available ? 'local_shipping' : 'location_on'}</span>
            {listing.delivery_available ? 'Delivery available' : 'Pickup only'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {new Date(listing.expiry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Portion Selector */}
        <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-on-surface block">Select Portions</span>
            <span className="text-[11px] text-on-surface-variant">{maxPortions} portions remaining</span>
          </div>
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#e1bfb5]/40">
            <button
              onClick={() => setPortionCount(Math.max(1, portionCount - 1))}
              className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface hover:bg-primary hover:text-white transition-colors"
            >
              -
            </button>
            <span className="text-sm font-bold w-6 text-center">{portionCount}</span>
            <button
              onClick={() => setPortionCount(Math.min(maxPortions, portionCount + 1))}
              className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface hover:bg-primary hover:text-white transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Issue 8: Payment section - only for paid listings. No Handoff Method selector. */}
        {isDonation ? (
          /* Donation: no payment needed */
          <div className="bg-[#eaf4ee] p-4 rounded-2xl border border-[#6ffbbe]/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#005236] text-[22px]">check_circle</span>
            <div>
              <p className="text-xs font-bold text-[#005236]">Free Donation — No payment required</p>
              <p className="text-[11px] text-[#005236]/70">This listing is a free surplus donation. Coordinate pickup with the donor.</p>
            </div>
          </div>
        ) : (
          /* Paid listing: show UPI vs Cash choice */
          <div className="space-y-2">
            <label className="block text-xs font-bold text-on-surface">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_pickup')}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'cash_on_pickup'
                    ? 'border-primary bg-primary-fixed/20 text-primary'
                    : 'border-[#e1bfb5]/40 bg-surface-container-low text-on-surface-variant hover:border-primary/40'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">payments</span>
                Cash on Pickup
              </button>
              <button
                type="button"
                disabled={!listing.delivery_available}
                onClick={() => listing.delivery_available && setPaymentMethod('cash_on_delivery')}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  !listing.delivery_available
                    ? 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                    : paymentMethod === 'cash_on_delivery'
                    ? 'border-primary bg-primary-fixed/20 text-primary'
                    : 'border-[#e1bfb5]/40 bg-surface-container-low text-on-surface-variant hover:border-primary/40'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                {listing.delivery_available ? 'Cash on Delivery' : 'No Delivery'}
              </button>
            </div>
          </div>
        )}

        {/* Total Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">Total Payable</span>
            <div className="text-xl font-bold text-primary">
              {isDonation ? 'FREE' : `₹${totalPrice}`}
            </div>
            {!isDonation && (
              <p className="text-[11px] text-on-surface-variant">
                {portionCount} × ₹{listing.discounted_price} via {paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Cash on Pickup'}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2.5 rounded-full border border-[#e1bfb5] text-xs font-bold text-on-surface hover:bg-surface-container">
              Cancel
            </button>
            <button
              onClick={handleConfirmClaim}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {isSubmitting ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
