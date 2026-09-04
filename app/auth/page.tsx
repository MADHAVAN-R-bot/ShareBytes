'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';

const ROLES: { id: UserRole; label: string; icon: string; desc: string; color: string }[] = [
  { id: 'customer', label: 'Customer', icon: 'shopping_bag', desc: 'Discover & rescue fresh meals at reduced cost.', color: '' },
  { id: 'restaurant', label: 'Restaurant / Cafe', icon: 'restaurant', desc: 'Post daily surplus inventory before closing hours.', color: 'bg-primary text-white' },
  { id: 'food_donor', label: 'Food Donor', icon: 'volunteer_activism', desc: 'Donate surplus catering, event trays & groceries.', color: '' },
  { id: 'ngo', label: 'NGO / Shelter Trust', icon: 'handshake', desc: 'Get priority bulk meal batch allocations for shelters.', color: 'bg-[#006c49] text-white' },
];

function RoleCard({ role, selected, onSelect }: { role: typeof ROLES[0]; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
        selected
          ? 'border-primary bg-primary-fixed/30 shadow-sm'
          : 'border-gray-200 bg-surface-container-low hover:border-primary/40'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl shadow flex items-center justify-center ${role.color || 'bg-white text-primary'}`}>
          <span className="material-symbols-outlined text-[24px]">{role.icon}</span>
        </div>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selected ? 'bg-primary text-white' : 'bg-gray-200 text-transparent'}`}>
          <span className="material-symbols-outlined text-[14px]">check</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-bold text-on-surface">{role.label}</h3>
        <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{role.desc}</p>
      </div>
    </div>
  );
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, showToast } = useAuth();

  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('restaurant');
  const [showPassword, setShowPassword] = useState(false);

  // Shared form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [fssaiCertUrl, setFssaiCertUrl] = useState('');
  const [regCertUrl, setRegCertUrl] = useState('');
  const [entityPhotoUrl, setEntityPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'login') setAuthTab('login');
    if (tabParam === 'signup') setAuthTab('signup');

    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam && roleParam !== 'admin') {
      setSelectedRole(roleParam);
    }
    if (roleParam === 'admin') {
      setAuthTab('login');
      setSelectedRole('admin' as UserRole);
    }
  }, [searchParams]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
        showToast(`Uploaded ${file.name}`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (selectedRole === 'restaurant' && (!fssaiCertUrl || !entityPhotoUrl)) {
      showToast('FSSAI Certificate and Kitchen Photo are required for Restaurants', 'error');
      return;
    }
    if (selectedRole === 'ngo' && (!regCertUrl || !entityPhotoUrl)) {
      showToast('Registration Certificate and Shelter Photo are required for NGOs', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await signup({
      role: selectedRole,
      email,
      password,
      full_name: fullName,
      phone,
      business_name: businessName || fullName,
      address,
      fssai_cert_url: fssaiCertUrl,
      registration_cert_url: regCertUrl,
      entity_photo_url: entityPhotoUrl,
    });
    setIsSubmitting(false);
    if (success) {
      router.push(`/dashboard/${selectedRole === 'food_donor' ? 'donor' : selectedRole}`);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }
    if (!password) {
      showToast('Please enter your password', 'error');
      return;
    }

    setIsSubmitting(true);
    // Issue 1 Fix: Pass both email AND password — never logs in on email alone
    const isAdmin = selectedRole === ('admin' as UserRole);
    const success = await login(email, password, isAdmin ? ('admin' as UserRole) : selectedRole);
    setIsSubmitting(false);

    if (success) {
      const dest = isAdmin || email.toLowerCase().includes('admin')
        ? 'admin'
        : selectedRole === 'food_donor' ? 'donor' : selectedRole;
      router.push(`/dashboard/${dest}`);
    }
  };

  const switchTab = (tab: 'signup' | 'login') => {
    setAuthTab(tab);
    setPassword('');
    setConfirmPassword('');
    setSignupStep(1);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 sm:p-6 font-body">
      <div className="w-full max-w-container-max mx-auto my-auto">
        <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-[#e1bfb5]/40">
          {/* Left Panel: Branding */}
          <div className="lg:w-5/12 bg-gradient-to-br from-primary-fixed to-surface-container p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-start gap-4">
              <Link href="/" className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
                <Image src="/logo.png" alt="ShareBytes Logo" width={130} height={36} className="h-8 w-auto object-contain" />
              </Link>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">eco</span>
                  Community Food Network
                </span>
                <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
                  Every shared byte <br className="hidden sm:inline" />
                  <span className="text-primary">feeds hope.</span>
                </h1>
                <p className="mt-2 text-xs sm:text-sm font-medium text-on-surface-variant max-w-md">
                  Connecting neighborhood kitchens, local cafes, and food donors with people and organizations who need it most.
                </p>
              </div>
            </div>

            <div className="relative z-10 my-6">
              <div className="relative rounded-2xl overflow-hidden shadow-md bg-white">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=60"
                  alt="Community Kitchen"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-xs font-bold">Local Impact Daily</p>
                  <p className="text-[11px] text-gray-200">14,280+ meals rescued this week across 28 neighborhoods</p>
                </div>
              </div>
            </div>

            {/* Demo credentials hint */}
            <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-3 text-xs space-y-1 border border-[#e1bfb5]/40">
              <p className="font-bold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">info</span>
                Demo Credentials
              </p>
              <p className="text-on-surface-variant">Email: <span className="font-bold text-on-surface">bakery@goldenharvest.com</span></p>
              <p className="text-on-surface-variant">Password: <span className="font-bold text-on-surface">demo1234</span></p>
            </div>
          </div>

          {/* Right Panel: Auth Forms */}
          <div className="lg:w-7/12 p-6 sm:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Tab Switcher */}
              <div className="flex items-center justify-between pb-6">
                <div className="inline-flex p-1 bg-surface-container rounded-2xl">
                  <button
                    onClick={() => switchTab('signup')}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${authTab === 'signup' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => switchTab('login')}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${authTab === 'login' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    Log In
                  </button>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant font-bold">
                  <span className="material-symbols-outlined text-[18px] text-[#006c49]">shield</span>
                  <span>Safe & Free Access</span>
                </div>
              </div>

              {/* ==================== SIGN UP FLOW ==================== */}
              {authTab === 'signup' && (
                <div className="space-y-6">
                  {signupStep === 1 ? (
                    <div className="space-y-6">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 1 of 2</span>
                        <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-1">Select your role to get started</h2>
                        <p className="text-xs text-on-surface-variant mt-1 font-medium">Choose how you will engage with the ShareBytes food rescue ecosystem.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ROLES.map(r => (
                          <RoleCard key={r.id} role={r} selected={selectedRole === r.id} onSelect={() => setSelectedRole(r.id)} />
                        ))}
                      </div>

                      <button
                        onClick={() => setSignupStep(2)}
                        className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span>Continue Registration</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 2 of 2 — {selectedRole.replace('_', ' ').toUpperCase()}</span>
                          <h2 className="text-xl font-bold text-on-surface mt-0.5">Enter Registration Details</h2>
                        </div>
                        <button type="button" onClick={() => setSignupStep(1)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                          Change Role
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">Full Name / Representative *</label>
                          <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Rahul Sharma" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">Email Address *</label>
                          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="user@example.com" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">Password *</label>
                          <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary pr-10" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-on-surface-variant hover:text-primary">
                              <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">Confirm Password *</label>
                          <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">Mobile Phone Number</label>
                          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        {(selectedRole === 'restaurant' || selectedRole === 'ngo' || selectedRole === 'food_donor') && (
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1">Business / Trust Name *</label>
                            <input type="text" required value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Golden Harvest Bakery / St. Jude Trust" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1">Pickup / Physical Address</label>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="42 MG Road, Downtown Chennai" className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>

                      {selectedRole === 'restaurant' && (
                        <div className="p-4 rounded-2xl bg-primary-fixed/20 border border-primary/30 space-y-3">
                          <span className="text-xs font-bold text-primary block">FSSAI Compliance Documents (Required)</span>
                          <div>
                            <label className="block text-[11px] font-bold text-on-surface mb-1">Upload FSSAI License Certificate *</label>
                            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setFssaiCertUrl)} className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-on-surface mb-1">Upload Kitchen / Store Front Photo *</label>
                            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setEntityPhotoUrl)} className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white" />
                          </div>
                        </div>
                      )}

                      {selectedRole === 'ngo' && (
                        <div className="p-4 rounded-2xl bg-secondary-fixed/20 border border-[#006c49]/30 space-y-3">
                          <span className="text-xs font-bold text-[#006c49] block">NGO / Trust Registration Documents (Required)</span>
                          <div>
                            <label className="block text-[11px] font-bold text-on-surface mb-1">Upload Trust Registration Certificate *</label>
                            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setRegCertUrl)} className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#006c49] file:text-white" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-on-surface mb-1">Upload Shelter / Premises Photo *</label>
                            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setEntityPhotoUrl)} className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#006c49] file:text-white" />
                          </div>
                        </div>
                      )}

                      <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                        <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ==================== LOG IN FLOW ==================== */}
              {authTab === 'login' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Welcome Back</h2>
                    <p className="text-xs text-on-surface-variant mt-1 font-medium">Sign in to manage food listings, claims, or partner verifications.</p>
                  </div>

                  {/* Issue 4 Fix: Role selection on Login tab */}
                  {selectedRole !== ('admin' as UserRole) && (
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-2">Select your role</label>
                      <div className="grid grid-cols-2 gap-3">
                        {ROLES.map(r => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setSelectedRole(r.id)}
                            className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
                              selectedRole === r.id
                                ? 'border-primary bg-primary-fixed/30 text-primary'
                                : 'border-gray-200 bg-surface-container-low text-on-surface-variant hover:border-primary/40'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                            <span className="truncate">{r.label}</span>
                            {selectedRole === r.id && <span className="material-symbols-outlined text-[14px] ml-auto shrink-0">check_circle</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Admin mode indicator */}
                  {selectedRole === ('admin' as UserRole) && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40">
                      <span className="material-symbols-outlined text-primary text-[18px]">admin_panel_settings</span>
                      <span className="text-xs font-bold text-on-surface">Signing in as Admin</span>
                      <button type="button" onClick={() => setSelectedRole('restaurant')} className="ml-auto text-xs text-primary hover:underline">Switch role</button>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">
                        Email Address *
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={selectedRole === ('admin' as UserRole) ? 'admin@sharebytes.org' : 'your@email.com'}
                        className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Issue 1 Fix: Password is REQUIRED and validated */}
                    <div>
                      <label className="block text-xs font-bold text-on-surface mb-1">Password *</label>
                      <div className="relative">
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-on-surface-variant hover:text-primary">
                          <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">login</span>
                      <span>{isSubmitting ? 'Signing in...' : `Sign In as ${selectedRole === ('admin' as UserRole) ? 'Admin' : ROLES.find(r => r.id === selectedRole)?.label || selectedRole}`}</span>
                    </button>
                  </form>

                  {/* Issue 5 Fix: "Admin? Sign in here" moved to Login page */}
                  {selectedRole !== ('admin' as UserRole) && (
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('admin' as UserRole)}
                        className="text-xs font-medium text-on-surface-variant hover:text-primary underline"
                      >
                        Admin? Sign in here
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center font-bold text-primary animate-pulse text-sm">Loading Auth Hub...</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
