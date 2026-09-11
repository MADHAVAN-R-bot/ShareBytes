'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FoodListing, PaymentMethod } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import NumericInput from '@/components/NumericInput';

interface ClaimModalProps {
  listing: FoodListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ── Razorpay type declaration (loaded via CDN script tag) ─────────────────────
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: Record<string, unknown>) => void) => void;
    };
  }
}

// ── Utility: format seconds as "Xm Ys" ───────────────────────────────────────
function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function ClaimModal({ listing, isOpen, onClose, onSuccess }: ClaimModalProps) {
  const { user, role, showToast } = useAuth();
  const [portionCount, setPortionCount] = useState<number | string>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  // NGO priority countdown
  const [ngoCountdownSecs, setNgoCountdownSecs] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute NGO priority window state (ONLY applies to donation-only listings)
  const isNGO = role === 'ngo';
  const ngoPriorityUntil = listing?.ngo_priority_until;
  const ngoPriorityActive = Boolean(
    listing?.is_donation_only && ngoPriorityUntil && Date.now() < new Date(ngoPriorityUntil).getTime()
  );
  // Customer/restaurant is blocked during NGO window; NGO and donors/owner are not
  const isBlockedByNGOWindow = ngoPriorityActive && !isNGO;

  // ── Countdown timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !ngoPriorityUntil) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const tick = () => {
      const secsLeft = Math.max(0, Math.ceil((new Date(ngoPriorityUntil).getTime() - Date.now()) / 1000));
      setNgoCountdownSecs(secsLeft);
      if (secsLeft === 0 && timerRef.current) clearInterval(timerRef.current);
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isOpen, ngoPriorityUntil]);

  if (!isOpen || !listing) return null;

  const maxPortions = listing.portion_count;
  const isDonation = listing.is_donation_only;
  const numericPortions = Number(portionCount) || 1;
  const totalPrice = isDonation ? 0 : listing.discounted_price * numericPortions;
  const isNGOUser = role === 'ngo';

  // ── Load Razorpay SDK on-demand (CDN) ────────────────────────────────────────
  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise(resolve => {
      if (typeof window !== 'undefined' && window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });

  // ── Razorpay paid flow ───────────────────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    if (!user) { showToast('Please log in to continue', 'error'); return; }
    setIsLoadingPayment(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      showToast('Payment gateway unavailable. Check your internet connection.', 'error');
      setIsLoadingPayment(false);
      return;
    }

    try {
      // Create order server-side
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice, currency: 'INR' }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Order creation failed' }));
        showToast(err.error || 'Failed to create payment order', 'error');
        setIsLoadingPayment(false);
        return;
      }

      const { orderId, amount, currency, key_id } = await res.json();

      const options = {
        key: key_id,
        amount,
        currency,
        name: 'ShareBytes',
        description: `Meal Reservation — ${listing.title}`,
        order_id: orderId,
        theme: { color: '#6750A4' },
        prefill: {
          name: user.full_name,
          email: user.email,
          contact: user.phone || '',
        },
        notes: { listing_id: listing.id, portions: portionCount },
        handler: async (response: Record<string, unknown>) => {
          // Payment successful — create claim
          console.log('[ShareBytes] Razorpay payment success:', response);
          try {
            DataService.createClaim({
              listing_id: listing.id,
              claimed_by: user.id,
              portion_count: Number(portionCount) || 1,
              payment_method: 'online',
              delivery_requested: false,
            }, role);
            showToast('Payment successful! Meal reserved. Check your email for confirmation.', 'success');
            onSuccess();
            onClose();
          } catch (err: any) {
            showToast(err.message || 'Payment succeeded but reservation failed. Contact support.', 'error');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: Record<string, unknown>) => {
        console.error('[ShareBytes] Razorpay payment failed:', response);
        showToast('Payment failed. Please try again.', 'error');
      });
      rzp.open();
    } catch (err: any) {
      console.error('[ShareBytes] Razorpay error:', err);
      showToast(err.message || 'Payment setup failed', 'error');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const isNGOUnverified = isNGOUser && user?.verified_status !== 'verified';

  // ── Free / NGO / donation claim (no payment) ─────────────────────────────────
  const handleConfirmClaim = () => {
    if (!user) { showToast('Please log in to claim meals', 'error'); return; }
    if (isNGOUnverified) {
      showToast('Your NGO account must be verified by Admin before you can claim food.', 'error');
      return;
    }
    if (isBlockedByNGOWindow) {
      showToast(`NGO priority window active — ${formatCountdown(ngoCountdownSecs)} remaining`, 'error');
      return;
    }
    const numPortions = Number(portionCount);
    if (isNaN(numPortions) || numPortions < 1) {
      showToast('Portions must be at least 1.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      DataService.createClaim({
        listing_id: listing.id,
        claimed_by: user.id,
        portion_count: numPortions,
        payment_method: 'cash_on_pickup',
        delivery_requested: false,
      }, role);
      showToast(
        isDonation
          ? 'Donation claimed! The donor will contact you for pickup coordination.'
          : 'Meal reserved! Present your confirmation at pickup.',
        'success'
      );
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
            <h2 className="text-lg font-bold text-on-surface">
              {isDonation ? 'Claim Free Donation' : isNGOUser ? 'Reserve Meal Batch (NGO)' : 'Reserve Meal Batch'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">{listing.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* NGO Priority Window Banner */}
        {ngoPriorityActive && (
          <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
            isNGOUser
              ? 'bg-[#eaf4ee] border-[#6ffbbe]/50'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <span className={`material-symbols-outlined text-[22px] shrink-0 ${isNGOUser ? 'text-[#005236]' : 'text-amber-600'}`}>
              {isNGOUser ? 'verified' : 'lock_clock'}
            </span>
            <div>
              {isNGOUser ? (
                <>
                  <p className="text-xs font-bold text-[#005236]">NGO Priority Access — You have first priority</p>
                  <p className="text-[11px] text-[#005236]/70">Window closes in {formatCountdown(ngoCountdownSecs)}</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-amber-800">NGO priority window active</p>
                  <p className="text-[11px] text-amber-700">Available to you in <strong>{formatCountdown(ngoCountdownSecs)}</strong>. NGOs have first access on new listings.</p>
                </>
              )}
            </div>
          </div>
        )}

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
        <div>
          <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-on-surface block">Select Portions</span>
              <span className="text-[11px] text-on-surface-variant">{maxPortions} portions remaining</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#e1bfb5]/40">
              <button
                type="button"
                onClick={() => setPortionCount(Math.max(1, (Number(portionCount) || 1) - 1))}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface hover:bg-primary hover:text-white transition-colors"
              >
                -
              </button>
              <NumericInput
                min={1}
                max={maxPortions}
                value={portionCount}
                onChange={val => setPortionCount(val)}
                className="w-12 text-center text-sm font-bold bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setPortionCount(Math.min(maxPortions, (Number(portionCount) || 1) + 1))}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface hover:bg-primary hover:text-white transition-colors"
              >
                +
              </button>
            </div>
          </div>
          {(portionCount === '' || Number(portionCount) < 1) && (
            <p className="text-[11px] text-red-500 font-medium mt-1 px-1">Portions must be at least 1.</p>
          )}
        </div>

        {/* Payment Section */}
        {isDonation || isNGOUser ? (
          /* NGO / Donation: Free, no payment */
          <div className="bg-[#eaf4ee] p-4 rounded-2xl border border-[#6ffbbe]/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#005236] text-[22px]">check_circle</span>
            <div>
              <p className="text-xs font-bold text-[#005236]">
                {isDonation ? 'Free Donation — No payment required' : 'NGO Claim — Free of charge'}
              </p>
              <p className="text-[11px] text-[#005236]/70">
                {isDonation
                  ? 'This listing is a free surplus donation. Coordinate pickup with the donor.'
                  : 'NGOs receive surplus food at zero cost. Coordinate pickup directly.'}
              </p>
            </div>
          </div>
        ) : (
          /* Customer: Choice between Razorpay and Cash on Pickup/Delivery */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-on-surface">Select Payment Method</label>
              <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">science</span>
                TEST MODE
              </span>
            </div>

            {/* Option 1: Pay Online via Razorpay */}
            <div
              onClick={() => setPaymentMethod('online')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                paymentMethod === 'online'
                  ? 'border-primary bg-primary-fixed/20 shadow-sm'
                  : 'border-gray-200 bg-surface-container-low hover:border-primary/40'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                {paymentMethod === 'online' && <span className="material-symbols-outlined text-[12px]">check</span>}
              </div>
              <span className="material-symbols-outlined text-primary text-[24px]">payment</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-on-surface">Pay Online via Razorpay</p>
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">Instant</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">UPI · Card · Net Banking (Razorpay Widget)</p>
              </div>
            </div>

            {/* Option 2: Cash on Pickup / Delivery */}
            <div
              onClick={() => setPaymentMethod(listing.delivery_available ? 'cash_on_delivery' : 'cash_on_pickup')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                paymentMethod !== 'online'
                  ? 'border-primary bg-primary-fixed/20 shadow-sm'
                  : 'border-gray-200 bg-surface-container-low hover:border-primary/40'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod !== 'online' ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                {paymentMethod !== 'online' && <span className="material-symbols-outlined text-[12px]">check</span>}
              </div>
              <span className="material-symbols-outlined text-emerald-600 text-[24px]">payments</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-on-surface">
                    {listing.delivery_available ? 'Cash on Delivery / Pickup' : 'Cash on Pickup'}
                  </p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Pay Later</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">Pay cash directly when receiving your food batch</p>
              </div>
            </div>

            {paymentMethod === 'online' && (
              <p className="text-[10px] text-on-surface-variant px-1">
                Test card: <strong>4111 1111 1111 1111</strong> · Exp: any future date · CVV: <strong>123</strong>
              </p>
            )}
          </div>
        )}

        {/* Total Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">Total Payable</span>
            <div className="text-xl font-bold text-primary">
              {isDonation || isNGOUser ? 'FREE' : `₹${totalPrice}`}
            </div>
            {!isDonation && !isNGOUser && (
              <p className="text-[11px] text-on-surface-variant">
                {portionCount} × ₹{listing.discounted_price} · {paymentMethod === 'online' ? 'Razorpay (Online)' : 'Cash on Pickup'}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2.5 rounded-full border border-[#e1bfb5] text-xs font-bold text-on-surface hover:bg-surface-container">
              Cancel
            </button>

            {/* Blocked by unverified NGO status */}
            {isNGOUnverified ? (
              <button
                disabled
                title="Your NGO account must be verified by Admin before you can claim food"
                className="px-5 py-2.5 rounded-full bg-gray-300 text-gray-500 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                Verification Pending
              </button>
            ) : isBlockedByNGOWindow ? (
              <button
                disabled
                className="px-5 py-2.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold opacity-80 flex items-center gap-1.5 cursor-not-allowed"
                title={`NGO priority window — ${formatCountdown(ngoCountdownSecs)} remaining`}
              >
                <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                {formatCountdown(ngoCountdownSecs)} left
              </button>
            ) : isDonation || isNGOUser || paymentMethod !== 'online' ? (
              /* Free or Cash claim confirm */
              <button
                onClick={handleConfirmClaim}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                {isSubmitting ? 'Confirming...' : 'Confirm Claim'}
              </button>
            ) : (
              /* Razorpay online payment */
              <button
                onClick={handleRazorpayPayment}
                disabled={isLoadingPayment}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">payment</span>
                {isLoadingPayment ? 'Opening...' : `Pay ₹${totalPrice}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
