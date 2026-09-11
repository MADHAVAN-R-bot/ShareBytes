'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FoodListing } from '@/lib/types';

interface ListingCardProps {
  listing: FoodListing;
  onClaim?: (listing: FoodListing) => void;
  showActions?: boolean;
  actionText?: string;
  isOwner?: boolean;
  onDelete?: (id: string) => void;
  /** Pass the viewer's role so the card can show/lock NGO priority window */
  viewerRole?: string;
}

function useNgoPriorityCountdown(ngo_priority_until?: string) {
  const [secsLeft, setSecsLeft] = useState(0);

  useEffect(() => {
    if (!ngo_priority_until) return;
    const tick = () => {
      const s = Math.max(0, Math.ceil((new Date(ngo_priority_until).getTime() - Date.now()) / 1000));
      setSecsLeft(s);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [ngo_priority_until]);

  return secsLeft;
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function ListingCard({
  listing,
  onClaim,
  showActions = true,
  actionText = 'Claim Meal',
  isOwner = false,
  onDelete,
  viewerRole,
}: ListingCardProps) {
  const isVeg = listing.food_type === 'veg';
  const secsLeft = useNgoPriorityCountdown(listing.ngo_priority_until);

  const ngoPriorityActive = Boolean(
    listing.is_donation_only && listing.ngo_priority_until && secsLeft > 0
  );
  const isViewerNgo = viewerRole === 'ngo';
  const isLockedForViewer = ngoPriorityActive && !isViewerNgo && !isOwner;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-[#e1bfb5]/40 flex flex-col justify-between h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div>
        {/* Top Image Box */}
        <div className="relative h-48 w-full rounded-xl overflow-hidden bg-surface-container mb-4">
          <Image
            src={listing.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60'}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Top Left Veg/Non-Veg + Donation Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 ${
                isVeg ? 'bg-[#eaf4ee] text-[#005236]' : 'bg-[#ffdad6] text-[#93000a]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-[#006c49]' : 'bg-[#ba1a1a]'}`} />
              {isVeg ? '100% Veg' : 'Non-Veg'}
            </span>

            {listing.is_donation_only && (
              <span className="px-2.5 py-1 rounded-full bg-secondary text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
                Free Donation
              </span>
            )}
          </div>

          {/* Top Right Delivery Indicator */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-on-surface flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[14px] text-primary">
              {listing.delivery_available ? 'local_shipping' : 'location_on'}
            </span>
            {listing.delivery_available ? 'Delivery Available' : 'Pickup Only'}
          </div>

          {/* Bottom: NGO Priority Countdown OR Expiry badge */}
          {ngoPriorityActive ? (
            <div className={`absolute bottom-3 left-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
              isViewerNgo
                ? 'bg-[#006c49] text-white'
                : 'bg-amber-600/90 backdrop-blur-md text-white'
            }`}>
              <span className="material-symbols-outlined text-[14px]">
                {isViewerNgo ? 'verified' : 'lock_clock'}
              </span>
              {isViewerNgo
                ? `NGO Priority: ${formatCountdown(secsLeft)} left`
                : `NGO window — ${formatCountdown(secsLeft)} left`}
            </div>
          ) : (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary">schedule</span>
              <span>Expiring Today</span>
            </div>
          )}
        </div>

        {/* Creator Info */}
        <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
          {listing.creator_business || listing.creator_name || 'Verified Kitchen Partner'}
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-on-surface leading-tight mb-2">{listing.title}</h3>
        <p className="text-xs text-on-surface-variant line-clamp-2 mb-4">{listing.description}</p>
      </div>

      {/* Footer & Pricing */}
      <div className="pt-3 border-t border-[#e1bfb5]/30">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[10px] font-bold uppercase text-on-surface-variant">Available Portions</div>
            <div className="text-lg font-bold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[20px]">restaurant</span>
              {listing.portion_count} meals
            </div>
          </div>

          <div className="text-right">
            {listing.is_donation_only ? (
              <span className="text-base font-bold text-[#006c49] bg-[#eaf4ee] px-3 py-1 rounded-full inline-block">
                FREE
              </span>
            ) : (
              <div>
                <span className="text-xs text-on-surface-variant line-through mr-1.5">
                  ₹{listing.original_price}
                </span>
                <span className="text-xl font-bold text-primary">₹{listing.discounted_price}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location snippet */}
        <div className="flex items-center gap-1 text-[11px] text-on-surface-variant mb-4 truncate">
          <span className="material-symbols-outlined text-[14px] text-primary shrink-0">place</span>
          <span className="truncate">{listing.pickup_location}</span>
        </div>

        {/* Action Button */}
        {showActions && (
          <div>
            {isOwner ? (
              <div className="flex gap-2">
                {onDelete && (
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="flex-1 py-2.5 rounded-full border border-[#ba1a1a] text-[#ba1a1a] font-bold text-xs hover:bg-[#ffdad6] transition-colors"
                  >
                    Delete Listing
                  </button>
                )}
              </div>
            ) : isLockedForViewer ? (
              /* Locked during NGO priority window */
              <button
                disabled
                className="w-full py-3 rounded-full bg-amber-100 text-amber-700 font-bold text-sm border border-amber-200 flex items-center justify-center gap-2 cursor-not-allowed"
                title={`NGO priority active — ${formatCountdown(secsLeft)} remaining`}
              >
                <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                <span>NGO priority — {formatCountdown(secsLeft)} left</span>
              </button>
            ) : (
              <button
                onClick={() => onClaim && onClaim(listing)}
                className="w-full py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>{actionText}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
