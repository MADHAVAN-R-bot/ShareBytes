'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />

      <main className="pt-20 flex-1">
        {/* HERO SECTION */}
        <section className="w-full relative overflow-hidden pt-8 pb-16 bg-surface">
          <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4">
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-7 flex flex-col items-start gap-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e3eae4] text-[#3b6b55] text-xs font-bold">
                  <span className="material-symbols-outlined text-[18px] text-[#2d5a43]">eco</span>
                  <span>India's community food sharing platform</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-bold text-on-surface tracking-tight leading-[1.12]">
                  Don't waste <br />
                  food. <span className="text-[#006c49]">Share</span> it. <br />
                  <span className="text-primary">Bytes</span> at a time.
                </h1>

                <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed font-medium">
                  ShareBytes connects restaurants, food donors, customers, NGOs and trusts on one intelligent platform — turning surplus food into meals, savings, and community impact.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/auth?tab=signup"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Start sharing</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                  <Link
                    href="/dashboard/customer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-surface-container-low border border-[#e1bfb5] text-on-surface font-bold text-sm transition-all hover:scale-[1.02]"
                  >
                    <span>Browse food</span>
                    <span>🍴</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-bold text-on-surface">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">verified</span>
                    FSSAI verified
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#006c49] text-[18px]">eco</span>
                    Eco-friendly
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">favorite</span>
                    Community-first
                  </span>
                </div>
              </div>

              {/* Right Column: Live Surplus Card Preview */}
              <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
                <div className="w-full max-w-[420px] bg-white rounded-3xl overflow-hidden shadow-xl border border-[#e1bfb5]/40 transition-all hover:shadow-2xl">
                  <div className="relative h-64 w-full bg-gray-900 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=60"
                      alt="Fresh authentic Indian feast spread"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
                      <span className="text-xs font-bold text-[#006c49]">Active Community Surplus</span>
                    </div>
                    <div className="absolute top-3.5 right-3.5 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-tertiary">schedule</span>
                      <span>48m remaining</span>
                    </div>
                    <div className="absolute bottom-3.5 left-3.5 bg-on-surface/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                      <div className="leading-tight">
                        <p className="text-[10px] text-gray-300 font-bold uppercase">NGO Window Open</p>
                        <p className="text-xs font-bold">Verified Shelters Priority</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-on-surface">Fresh Catering Surplus Meals (Veg)</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">Central Chennai • 2.1 km away</p>
                      </div>
                      <span className="text-xs font-bold text-[#006c49] bg-[#eaf4ee] px-2.5 py-1 rounded-full shrink-0">
                        100% Veg
                      </span>
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-[11px] uppercase font-bold text-on-surface-variant block">Available</span>
                        <span className="text-base font-bold text-on-surface">40 hot meals</span>
                      </div>
                      <Link
                        href="/auth?tab=signup"
                        className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] inline-flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">handshake</span>
                        <span>Reserve Batch</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHO IS THIS FOR? SECTION */}
        <section className="w-full py-16 bg-surface-container-low/40">
          <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col items-center text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                Inclusive Eco-System
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">Built For Our Entire Community</h2>
              <p className="text-sm text-on-surface-variant max-w-xl mt-2 font-medium">
                Every participant plays a vital role in closing the food loop and safeguarding nourishment.
              </p>
            </div>

            {/* 4 Icon Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Customer */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[32px]">shopping_bag</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wide">For Neighbors</span>
                    <h3 className="text-xl font-bold text-on-surface mt-1">Customer</h3>
                    <p className="text-xs font-medium text-on-surface-variant mt-1">
                      Rescue affordable fresh meals nearby before closing hours.
                    </p>
                  </div>
                </div>
                <Link
                  href="/auth?role=customer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark mt-6 group"
                >
                  <span>Join as Customer</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Card 2: Restaurant */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-[32px]">restaurant</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wide">For Food Outlets</span>
                    <h3 className="text-xl font-bold text-on-surface mt-1">Restaurant</h3>
                    <p className="text-xs font-medium text-on-surface-variant mt-1">
                      Turn excess daily batches into community goodwill and reduced waste.
                    </p>
                  </div>
                </div>
                <Link
                  href="/auth?role=restaurant"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-dark mt-6 group"
                >
                  <span>Join as Restaurant</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Card 3: Food Donor */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed-dim flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[32px]">volunteer_activism</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wide">For Event Hosts</span>
                    <h3 className="text-xl font-bold text-on-surface mt-1">Food Donor</h3>
                    <p className="text-xs font-medium text-on-surface-variant mt-1">
                      Donate surplus catering events and banquet rations with ease.
                    </p>
                  </div>
                </div>
                <Link
                  href="/auth?role=food_donor"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark mt-6 group"
                >
                  <span>Join as Donor</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* Card 4: NGO / Trust */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-fixed-dim flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-[32px]">handshake</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wide">For Non-Profits</span>
                    <h3 className="text-xl font-bold text-on-surface mt-1">NGO / Trust</h3>
                    <p className="text-xs font-medium text-on-surface-variant mt-1">
                      Get priority bulk meal batch allocations for verified shelters.
                    </p>
                  </div>
                </div>
                <Link
                  href="/auth?role=ngo"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-secondary-dark mt-6 group"
                >
                  <span>Join as NGO</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="w-full py-16 bg-surface">
          <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col items-center text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">
                Simple 4-Step Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">How ShareBytes Works</h2>
              <p className="text-sm text-on-surface-variant max-w-xl mt-2 font-medium">
                Clear, self-explanatory transitions built for maximum speed and food safety.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col relative transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shadow-md">
                    01
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[26px]">photo_camera</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-on-surface">List Surplus Food</h3>
                <p className="text-xs font-medium text-on-surface-variant mt-1">
                  Snap photo, set portions, and choose Sell or Donate.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[#006c49] text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  <span>Takes under 45 seconds</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col relative transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#006c49] text-white font-bold text-sm flex items-center justify-center shadow-md">
                    02
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#006c49] text-[26px]">verified_user</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-on-surface">NGO Priority Window</h3>
                <p className="text-xs font-medium text-on-surface-variant mt-1">
                  Verified shelters claim large batches first.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                  <span>Exclusive 60-min window</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col relative transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shadow-md">
                    03
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[26px]">explore</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-on-surface">Customer Access</h3>
                <p className="text-xs font-medium text-on-surface-variant mt-1">
                  Nearby users reserve remaining discounted meals.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[#006c49] text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">touch_app</span>
                  <span>1-tap instant reservation</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1bfb5]/40 flex flex-col relative transition-transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-full bg-[#006c49] text-white font-bold text-sm flex items-center justify-center shadow-md">
                    04
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#006c49] text-[26px]">local_shipping</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-on-surface">Pickup or Delivery</h3>
                <p className="text-xs font-medium text-on-surface-variant mt-1">
                  Quick pickup with secure verification check-in.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                  <span>Zero-contact handover</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST INDICATORS SECTION */}
        <section id="trust" className="w-full py-16 bg-surface-container-low/40">
          <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Safety & Transparency</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mt-1">Why Choose ShareBytes?</h2>
              </div>
              <p className="text-sm font-medium text-on-surface-variant max-w-md">
                Every kitchen, food lot, and NGO is validated with strict health standards so food is shared with complete dignity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white shadow-sm border border-[#e1bfb5]/40 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">gpp_good</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">Verified Restaurants</h3>
                <p className="text-xs font-medium text-on-surface-variant">
                  Active commercial food safety FSSAI licenses inspected before listing authorization.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white shadow-sm border border-[#e1bfb5]/40 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#006c49] text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">approval_delegation</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">Verified NGOs</h3>
                <p className="text-xs font-medium text-on-surface-variant">
                  Vetted community shelters and soup kitchens ensuring food reaches genuine need.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white shadow-sm border border-[#e1bfb5]/40 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-tertiary text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">eco</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">Zero Waste Goal</h3>
                <p className="text-xs font-medium text-on-surface-variant">
                  Direct emissions diversion prevents organic matter from methane-producing landfills.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white shadow-sm border border-[#e1bfb5]/40 flex flex-col gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#2d5a43] text-white flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">groups_3</span>
                </div>
                <h3 className="text-base font-bold text-on-surface">Community Powered</h3>
                <p className="text-xs font-medium text-on-surface-variant">
                  A decentralized network of neighbors, chefs, and couriers working together.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-on-surface text-white py-12 border-t border-gray-800">
        <div className="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="ShareBytes Logo" width={140} height={40} className="h-9 w-auto bg-white rounded-lg p-1" />
            <span className="text-xs text-gray-400 font-medium">Share Food, Spread Kindness.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/dashboard/customer" className="hover:text-white transition-colors">Marketplace</Link>
            <Link href="/auth?tab=signup" className="hover:text-white transition-colors">Get Started</Link>
            <Link href="/auth?role=admin" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>

          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} ShareBytes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
