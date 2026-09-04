'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

const stats = [
  { label: 'Meals Rescued', value: '14,280+', icon: 'restaurant' },
  { label: 'Partner Restaurants', value: '180+', icon: 'store' },
  { label: 'NGOs Supported', value: '42', icon: 'handshake' },
  { label: 'CO₂ Diverted', value: '6.2 tonnes', icon: 'eco' },
];

const team = [
  { name: 'Priya Krishnan', role: 'Co-Founder & CEO', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60' },
  { name: 'Arjun Mehta', role: 'Co-Founder & CTO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60' },
  { name: 'Divya Nair', role: 'Head of NGO Partnerships', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=60' },
];

const values = [
  { icon: 'favorite', title: 'Community First', desc: 'Every decision we make is guided by the impact on our local food community.' },
  { icon: 'verified_user', title: 'Trust & Transparency', desc: 'Verified FSSAI restaurants, certified NGOs, and open audit trails.' },
  { icon: 'eco', title: 'Zero Waste Vision', desc: 'We believe no meal should go to waste when someone is hungry nearby.' },
  { icon: 'electric_bolt', title: 'Speed & Simplicity', desc: 'Reserve surplus portions in less than 3 taps. No friction, no waste.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="pt-20 flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-primary-fixed via-surface to-surface-container">
          <div className="max-w-container-max mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#006c49]/10 text-[#006c49] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">eco</span>
              Our Story
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold text-on-surface leading-tight">
              Built to rescue <span className="text-primary">food</span>,<br />
              nourish <span className="text-[#006c49]">communities</span>.
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed">
              ShareBytes was born in Chennai in 2024 out of a simple frustration: thousands of fresh meals were being thrown away nightly while families and shelters nearby went hungry. We built the platform to connect both sides — simply, reliably, and at scale.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4 bg-white border-y border-[#e1bfb5]/40">
          <div className="max-w-container-max mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-primary text-[24px]">{s.icon}</span>
                </div>
                <div className="text-3xl font-bold text-on-surface">{s.value}</div>
                <p className="text-xs font-bold text-on-surface-variant">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-4">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Our Mission</span>
              <h2 className="text-3xl font-bold text-on-surface">Turning surplus into sustenance</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                India wastes 68.7 million tonnes of food every year — enough to feed every hungry person in the country. ShareBytes directly tackles this by creating an intelligent, real-time marketplace where restaurants and food donors can list surplus, NGOs can claim it in bulk, and everyday customers can rescue meals at up to 80% discount.
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                We verify every restaurant with FSSAI checks and every NGO with registration certificates — because trust is everything when food is the product.
              </p>
              <Link href="/auth?tab=signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:scale-[1.02] transition-all">
                Join the movement
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl h-80">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60"
                alt="Food sharing community"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-bold">Community Impact</p>
                <p className="text-xs opacity-80">14,280+ meals rescued this week alone</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4 bg-surface-container-low">
          <div className="max-w-container-max mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">What drives us</span>
              <h2 className="text-3xl font-bold text-on-surface">Our core values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(v => (
                <div key={v.title} className="bg-white p-6 rounded-2xl border border-[#e1bfb5]/40 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[24px]">{v.icon}</span>
                  </div>
                  <h3 className="font-bold text-on-surface">{v.title}</h3>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4">
          <div className="max-w-container-max mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">The people</span>
              <h2 className="text-3xl font-bold text-on-surface">Meet the team</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {team.map(t => (
                <div key={t.name} className="text-center space-y-3 w-48">
                  <img src={t.img} alt={t.name} className="w-24 h-24 rounded-full mx-auto object-cover shadow-md" />
                  <div>
                    <p className="font-bold text-on-surface text-sm">{t.name}</p>
                    <p className="text-xs text-on-surface-variant font-medium">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary to-[#006c49]">
          <div className="max-w-container-max mx-auto text-center text-white space-y-4">
            <h2 className="text-3xl font-bold">Ready to make a difference?</h2>
            <p className="text-sm opacity-90 max-w-md mx-auto">Whether you're a restaurant, NGO, food donor, or customer — there's a role for you in the ShareBytes ecosystem.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/auth?tab=signup" className="px-6 py-3 rounded-full bg-white text-primary font-bold text-sm hover:scale-[1.02] transition-all">Join ShareBytes</Link>
              <Link href="/contact" className="px-6 py-3 rounded-full border border-white/50 text-white font-bold text-sm hover:bg-white/10 transition-all">Contact Us</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
