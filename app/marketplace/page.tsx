'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { DataService } from '@/lib/services/dataService';
import { FoodListing } from '@/lib/types';

export default function MarketplacePage() {
  const [listings] = useState<FoodListing[]>(() => DataService.getCustomerListings());
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non_veg'>('all');

  const filtered = listings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.pickup_location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchVeg = vegFilter === 'all' ? true : l.food_type === vegFilter;
    return matchSearch && matchVeg;
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="pt-20 flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-fixed via-surface to-surface-container py-14 px-4">
          <div className="max-w-container-max mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              Public Marketplace
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-on-surface">Browse surplus meals near you</h1>
            <p className="text-base text-on-surface-variant max-w-xl mx-auto font-medium">
              Discounted restaurant surplus — save up to 80% and reduce food waste. Sign up to claim.
            </p>
            <Link href="/auth?tab=signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:scale-[1.02] transition-all">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              Sign up to claim meals
            </Link>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-6 px-4 border-b border-[#e1bfb5]/40 bg-white sticky top-20 z-30">
          <div className="max-w-container-max mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-on-surface-variant text-[20px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search meals, restaurants..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="inline-flex p-1 bg-surface-container-low rounded-2xl">
              {(['all', 'veg', 'non_veg'] as const).map(v => (
                <button key={v} onClick={() => setVegFilter(v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${vegFilter === v ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant'}`}>
                  {v === 'all' ? 'All' : v === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                </button>
              ))}
            </div>
            {(searchQuery.trim() !== '' || vegFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setVegFilter('all');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                Clear Filters
              </button>
            )}
            <span className="text-xs text-on-surface-variant font-medium ml-auto">{filtered.length} listings available</span>
          </div>
        </section>

        {/* Listings Grid */}
        <section className="py-8 px-4">
          <div className="max-w-container-max mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <span className="material-symbols-outlined text-gray-300 text-[48px]">search_off</span>
                <p className="text-xs font-bold text-on-surface-variant">No listings match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map(l => (
                  <div key={l.id} className="bg-white rounded-2xl border border-[#e1bfb5]/40 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="relative h-40 overflow-hidden">
                      <img src={l.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60'} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {l.is_donation_only && <span className="px-2 py-0.5 rounded-full bg-[#006c49] text-white text-[10px] font-bold">Free Donation</span>}
                        {!l.is_donation_only && <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">-{Math.round((1 - l.discounted_price / l.original_price) * 100)}%</span>}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-on-surface line-clamp-1">{l.title}</h3>
                      <p className="text-[11px] text-on-surface-variant">{l.creator_business || l.creator_name}</p>
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          {l.is_donation_only ? (
                            <span className="text-base font-bold text-[#006c49]">FREE</span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="text-base font-bold text-primary">₹{l.discounted_price}</span>
                              <span className="text-xs text-on-surface-variant line-through">₹{l.original_price}</span>
                            </div>
                          )}
                        </div>
                        <Link href="/auth?tab=signup" className="px-3 py-1.5 rounded-full bg-primary text-white text-[11px] font-bold hover:bg-primary-dark transition-colors">
                          Claim
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 px-4 bg-gradient-to-r from-primary to-[#006c49]">
          <div className="max-w-container-max mx-auto text-center text-white space-y-4">
            <h2 className="text-2xl font-bold">Ready to start saving?</h2>
            <p className="text-sm opacity-90">Create a free account and start claiming discounted surplus meals in minutes.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/auth?tab=signup" className="px-6 py-3 rounded-full bg-white text-primary font-bold text-sm hover:scale-[1.02] transition-all">Get started free</Link>
              <Link href="/auth?tab=login" className="px-6 py-3 rounded-full border border-white/50 text-white font-bold text-sm hover:bg-white/10 transition-all">Sign in</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
