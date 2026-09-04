'use client';

import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

const FAQ_ITEMS = [
  { q: 'What is ShareBytes?', a: 'ShareBytes is a community food rescue platform that connects restaurants and food donors with NGOs and customers, turning daily food surplus into affordable or free meals.' },
  { q: 'How do I claim a meal?', a: 'Sign up as a Customer or NGO, browse the Marketplace, and click "Claim" on any available listing. You can choose pickup or delivery (if available).' },
  { q: 'Is the food safe to eat?', a: 'Yes — all restaurant partners are FSSAI verified. Listings expire and are removed automatically. Food quality and safety compliance is a non-negotiable requirement for all partners.' },
  { q: 'How do restaurants get verified?', a: 'Restaurants upload their FSSAI license and kitchen photos during signup. Our admin team reviews and approves within 24–48 hours. Unverified accounts cannot post listings.' },
  { q: 'Can NGOs get bulk meals?', a: 'Yes! Verified NGOs have a 90-minute exclusive advance window to claim large batches before listings open to the public. This ensures shelters and food banks get priority access.' },
  { q: 'What is a Food Donor?', a: 'A Food Donor is an individual or business (caterer, event organizer) who has large quantities of leftover food from events or functions and wants to donate it free to NGOs.' },
  { q: 'How does payment work?', a: 'For discounted listings, payment is Cash on Pickup or Cash on Delivery. Donation listings are completely free — no payment required.' },
  { q: 'How do I report a problem with a listing?', a: 'Use the "Report a Problem" form below. Our team reviews all reports within 12 hours.' },
  { q: 'How can I contact the admin team?', a: 'Use the "Contact Admin" section below or visit our Contact page. Admin responds within 24 hours on business days.' },
  { q: 'Is ShareBytes available outside Chennai?', a: 'We are currently live in Chennai with plans to expand to Bangalore, Mumbai, and Hyderabad in 2025. Join the waitlist via our Contact page.' },
];

// Chatbot keyword-matching rules
const BOT_RULES: { keywords: string[]; answer: string }[] = [
  { keywords: ['claim', 'reserve', 'how claim', 'get meal'], answer: 'To claim a meal: Sign up as a Customer or NGO → Browse Marketplace → Click "Claim" on a listing → Confirm your pickup or delivery preference.' },
  { keywords: ['payment', 'pay', 'cost', 'price', 'how much'], answer: 'Discounted meals are paid via Cash on Pickup or Delivery. Donation listings are 100% free — no payment needed.' },
  { keywords: ['ngo', 'bulk', 'shelter', 'trust'], answer: 'Verified NGOs get a 90-minute priority window to claim bulk batches before they open to the public. Register as an NGO and complete verification to get access.' },
  { keywords: ['restaurant', 'fssai', 'verify', 'verification'], answer: 'Restaurants upload their FSSAI license and kitchen photo during signup. Admin approves within 24–48 hours. Approved restaurants can then post surplus listings.' },
  { keywords: ['donor', 'event', 'catering', 'banquet'], answer: 'Food Donors are caterers or event organizers with surplus food. Register as Food Donor, then post a donation listing — NGOs will claim it.' },
  { keywords: ['signup', 'sign up', 'register', 'create account'], answer: 'Click "Get started" in the top right corner of the page. Choose your role (Customer, Restaurant, Food Donor, or NGO), then fill in your details.' },
  { keywords: ['login', 'sign in', 'password', 'forgot'], answer: 'Click "Sign in" in the top right. If you forgot your password, contact admin@sharebytes.org and we will reset it for you.' },
  { keywords: ['contact', 'admin', 'team', 'support'], answer: 'You can contact the admin team using the "Contact Admin" form on this page, or email admin@sharebytes.org directly.' },
  { keywords: ['safe', 'safety', 'quality', 'expire'], answer: 'All restaurant partners are FSSAI verified. Each listing has an expiry time — listings automatically close when they expire. We take food safety seriously.' },
  { keywords: ['delivery', 'pickup', 'handoff', 'collect'], answer: 'Each listing shows whether delivery is available or pickup only. Delivery availability is set by the restaurant — you can filter by delivery on the marketplace.' },
  { keywords: ['hello', 'hi', 'hey', 'greetings'], answer: 'Hello! 👋 I\'m the ShareBytes Help Bot. Ask me anything about claiming meals, verifying restaurants, NGO access, payment, or general platform questions!' },
  { keywords: ['help', 'assist', 'what can you do'], answer: 'I can answer questions about: claiming meals, payment methods, NGO bulk access, restaurant verification, food donors, account issues, and general platform features. Just ask!' },
];

function getbotResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const rule of BOT_RULES) {
    if (rule.keywords.some(k => lower.includes(k))) {
      return rule.answer;
    }
  }
  return "I'm not sure about that specific question. Please use the \"Report a Problem\" form below or contact admin@sharebytes.org and our team will assist you within 24 hours.";
}

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  time: string;
}

export default function HelpPage() {
  const { showToast } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { from: 'bot', text: 'Hi! 👋 I\'m the ShareBytes Help Bot. Ask me anything about the platform — meals, verification, payments, NGOs, and more!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Report form
  const [reportSubject, setReportSubject] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // Contact Admin form
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminMsg, setAdminMsg] = useState('');
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { from: 'user', text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const botText = getbotResponse(chatInput.trim());
    const botMsg: ChatMessage = { from: 'bot', text: botText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg, botMsg]);
    setChatInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleChatKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportSubject || !reportDesc) { showToast('Please fill in subject and description', 'error'); return; }
    setReportSubmitting(true);
    const reports = JSON.parse(localStorage.getItem('sb_reports') || '[]');
    reports.push({ id: `rpt-${Date.now()}`, subject: reportSubject, description: reportDesc, created_at: new Date().toISOString() });
    localStorage.setItem('sb_reports', JSON.stringify(reports));
    setTimeout(() => {
      setReportSubmitting(false);
      setReportSubject(''); setReportDesc('');
      showToast('Report submitted! Our team will review it within 12 hours.', 'success');
    }, 800);
  };

  const handleAdminContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminMsg) { showToast('Please fill in your email and message', 'error'); return; }
    setAdminSubmitting(true);
    const msgs = JSON.parse(localStorage.getItem('sb_contact_messages') || '[]');
    msgs.push({ id: `msg-${Date.now()}`, name: adminName, email: adminEmail, message: adminMsg, created_at: new Date().toISOString(), type: 'admin_contact' });
    localStorage.setItem('sb_contact_messages', JSON.stringify(msgs));
    setTimeout(() => {
      setAdminSubmitting(false);
      setAdminName(''); setAdminEmail(''); setAdminMsg('');
      showToast('Message sent to Admin! Expect a reply within 24 hours.', 'success');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="pt-20 flex-1">
        {/* Hero */}
        <section className="py-14 px-4 bg-gradient-to-br from-primary-fixed to-surface text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">help</span>
            Help Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface">How can we help you?</h1>
          <p className="text-base text-on-surface-variant max-w-xl mx-auto font-medium">Browse FAQs, chat with our bot, report a problem, or contact the admin team directly.</p>
        </section>

        <div className="max-w-container-max mx-auto px-4 py-12 space-y-16">
          {/* FAQ Section */}
          <section id="faq" className="space-y-6">
            <h2 className="text-2xl font-bold text-on-surface">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e1bfb5]/40 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left gap-4"
                  >
                    <span className="text-sm font-bold text-on-surface">{item.q}</span>
                    <span className={`material-symbols-outlined text-[20px] text-primary shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4 text-sm text-on-surface-variant font-medium leading-relaxed border-t border-gray-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Chatbot */}
          <section id="chatbot" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Ask our Help Bot</h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Type any question about ShareBytes — meals, verification, NGOs, payment, and more.</p>
            </div>
            <div className="bg-white rounded-3xl border border-[#e1bfb5]/40 shadow-sm overflow-hidden">
              {/* Chat Header */}
              <div className="bg-primary px-5 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">ShareBytes Help Bot</p>
                  <p className="text-white/70 text-[11px]">Keyword-powered FAQ assistant</p>
                </div>
                <span className="ml-auto flex items-center gap-1 text-white/80 text-[11px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#6ffbbe] animate-pulse" /> Online
                </span>
              </div>

              {/* Messages */}
              <div className="h-72 overflow-y-auto p-4 space-y-3 bg-surface-container-low/30">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-white text-on-surface border border-[#e1bfb5]/40 rounded-bl-sm'
                    }`}>
                      {msg.text}
                      <span className={`block text-[10px] mt-1 ${msg.from === 'user' ? 'text-white/60' : 'text-on-surface-variant'}`}>{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-[#e1bfb5]/40 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={handleChatKeydown}
                  placeholder="Ask a question... (press Enter to send)"
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button onClick={sendChatMessage} disabled={!chatInput.trim()} className="px-4 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold disabled:opacity-40 transition-all hover:bg-primary-dark flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Send
                </button>
              </div>
            </div>
          </section>

          {/* Two-column: Report + Contact Admin */}
          <section id="report" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Report a Problem */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">Report a Problem</h2>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Report listing issues, verification problems, or platform bugs.</p>
              </div>
              <form onSubmit={handleReportSubmit} className="bg-white rounded-3xl border border-[#e1bfb5]/40 shadow-sm p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Subject *</label>
                  <input type="text" required value={reportSubject} onChange={e => setReportSubject(e.target.value)} placeholder="e.g. Listing has wrong information" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Description *</label>
                  <textarea required rows={4} value={reportDesc} onChange={e => setReportDesc(e.target.value)} placeholder="Describe the problem in detail..." className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Screenshot (optional)</label>
                  <input type="file" accept="image/*" className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white" />
                </div>
                <button type="submit" disabled={reportSubmitting} className="w-full py-3 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-60">
                  <span className="material-symbols-outlined text-[18px]">bug_report</span>
                  {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </form>
            </div>

            {/* Contact Admin */}
            <div id="contact-admin" className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-on-surface">Contact Admin</h2>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Send a direct message to the ShareBytes admin team.</p>
              </div>
              <form onSubmit={handleAdminContact} className="bg-white rounded-3xl border border-[#e1bfb5]/40 shadow-sm p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Your Name</label>
                  <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="Rahul Sharma" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Email Address *</label>
                  <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Message *</label>
                  <textarea required rows={4} value={adminMsg} onChange={e => setAdminMsg(e.target.value)} placeholder="What do you need help with?" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                </div>
                <button type="submit" disabled={adminSubmitting} className="w-full py-3 rounded-full bg-[#006c49] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60">
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  {adminSubmitting ? 'Sending...' : 'Send to Admin'}
                </button>
                <p className="text-[11px] text-on-surface-variant text-center">Admin responds within 24 hours on business days.</p>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
