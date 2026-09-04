'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

export default function ContactPage() {
  const { showToast } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setIsSubmitting(true);
    const msgs = JSON.parse(localStorage.getItem('sb_contact_messages') || '[]');
    msgs.push({
      id: `msg-${Date.now()}`,
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString(),
      type: 'general_contact',
    });
    localStorage.setItem('sb_contact_messages', JSON.stringify(msgs));
    setTimeout(() => {
      setIsSubmitting(false);
      setName(''); setEmail(''); setSubject(''); setMessage('');
      showToast("Thanks for reaching out! We'll get back to you within 48 hours.", 'success');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="pt-20 flex-1">
        {/* Hero */}
        <section className="py-14 px-4 bg-gradient-to-br from-primary-fixed to-surface text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">mail</span>
            Contact Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface">Get in touch</h1>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto font-medium">
            Have a question, partnership inquiry, or feedback? We'd love to hear from you.
          </p>
        </section>

        <div className="max-w-container-max mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">Contact Information</h2>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
              Fill out the form and our team will get back to you within 48 hours. For urgent issues, use the Help Center.
            </p>

            <div className="space-y-4">
              {[
                { icon: 'mail', label: 'Email', val: 'hello@sharebytes.org' },
                { icon: 'phone', label: 'Phone', val: '+91 44 4567 8900' },
                { icon: 'location_on', label: 'Office', val: '14 Tech Park, Sholinganallur, Chennai 600119' },
                { icon: 'schedule', label: 'Working Hours', val: 'Mon–Sat, 9 AM – 6 PM IST' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-on-surface">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40">
              <p className="text-xs font-bold text-on-surface mb-2">For specific help:</p>
              <ul className="space-y-1 text-xs text-on-surface-variant font-medium">
                <li>• Technical issues → <a href="/help#report" className="text-primary hover:underline">Report a Problem</a></li>
                <li>• Platform questions → <a href="/help#chatbot" className="text-primary hover:underline">Help Bot</a></li>
                <li>• Admin escalations → <a href="/help#contact-admin" className="text-primary hover:underline">Contact Admin</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#e1bfb5]/40 shadow-sm p-8 space-y-5">
              <h2 className="text-xl font-bold text-on-surface">Send us a message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Full Name *</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Sharma" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Email Address *</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Subject</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Partnership inquiry / General question" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Message *</label>
                <textarea required rows={6} value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us how we can help..." className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-md">
                <span className="material-symbols-outlined text-[18px]">send</span>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              <p className="text-[11px] text-on-surface-variant text-center">We respond within 48 hours on business days.</p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
