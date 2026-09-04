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
  const [deliveryRequested, setDeliveryRequested] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_pickup');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !listing) return null;

  const maxPortions = listing.portion_count;
  const totalPrice = listing.is_donation_only ? 0 : listing.discounted_price * portionCount;

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
        payment_method: paymentMethod,
        delivery_requested: deliveryRequested,
      });

      showToast('Meal reserved successfully! Present QR or ID at pickup.', 'success');
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
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Reserve Meal Batch</h2>
            <p className="text-xs text-on-surface-variant">{listing.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
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

        {/* Pickup / Delivery Toggle */}
        <div>
          <label className="block text-xs font-bold text-on-surface mb-2">Handoff Method</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setDeliveryRequested(false);
                setPaymentMethod('cash_on_pickup');
              }}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                !deliveryRequested
                  ? 'border-primary bg-primary-fixed/20 text-primary'
                  : 'border-[#e1bfb5]/40 bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">location_on</span>
              Self Pickup
            </button>

            <button
              type="button"
              disabled={!listing.delivery_available}
              onClick={() => {
                if (listing.delivery_available) {
                  setDeliveryRequested(true);
                  setPaymentMethod('cash_on_delivery');
                }
              }}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                !listing.delivery_available
                  ? 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                  : deliveryRequested
                  ? 'border-primary bg-primary-fixed/20 text-primary'
                  : 'border-[#e1bfb5]/40 bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              {listing.delivery_available ? 'Delivery Available' : 'Delivery Unavailable'}
            </button>
          </div>
        </div>

        {/* Payment Method Notice */}
        <div className="bg-surface-container-low p-3.5 rounded-2xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
            <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
            Payment Mode: Cash on {deliveryRequested ? 'Delivery' : 'Pickup'}
          </div>
          <p className="text-[11px] text-on-surface-variant">
            {listing.is_donation_only
              ? 'This is a free surplus donation. No payment required.'
              : `Pay ₹${totalPrice} in cash upon receiving your meals.`}
          </p>
        </div>

        {/* Total Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">Total Payable</span>
            <div className="text-xl font-bold text-primary">
              {listing.is_donation_only ? 'FREE' : `₹${totalPrice}`}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-[#e1bfb5] text-xs font-bold text-on-surface hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClaim}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {isSubmitting ? 'Confirming...' : 'Confirm Claim'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
