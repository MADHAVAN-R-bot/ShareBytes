'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, showToast } = useAuth();

  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('restaurant');
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [fssaiCertUrl, setFssaiCertUrl] = useState('');
  const [regCertUrl, setRegCertUrl] = useState('');
  const [entityPhotoUrl, setEntityPhotoUrl] = useState('');

  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'login') setAuthTab('login');
    if (tabParam === 'signup') setAuthTab('signup');

    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam) {
      setSelectedRole(roleParam);
      if (roleParam === 'admin') {
        setAuthTab('login');
      }
    }
  }, [searchParams]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleProceedToStep2 = () => {
    setSignupStep(2);
  };

  // Mock File Upload handlers
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
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
    if (!email || !fullName) {
      showToast('Please fill in required fields', 'error');
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

    setIsSubmitting(true);
    const success = await login(email, selectedRole);
    setIsSubmitting(false);

    if (success) {
      const dest = email.includes('admin') ? 'admin' : selectedRole === 'food_donor' ? 'donor' : selectedRole;
      router.push(`/dashboard/${dest}`);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      showToast('Please enter phone number', 'error');
      return;
    }
    setOtpSent(true);
    showToast(`Verification code sent to ${phone}`, 'info');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      showToast('Please enter valid OTP code', 'error');
      return;
    }
    setIsSubmitting(true);
    const success = await login(phone ? `${phone}@mobile.user` : 'user@mobile.com', selectedRole);
    setIsSubmitting(false);
    if (success) {
      router.push(`/dashboard/${selectedRole === 'food_donor' ? 'donor' : selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 sm:p-6 font-body">
      <div className="w-full max-w-container-max mx-auto my-auto">
        <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-[#e1bfb5]/40">
          {/* Left Panel: Branding & Narrative */}
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

            {/* Visual Artwork Box */}
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

            {/* Trust Pillars */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#006c49]/20 flex items-center justify-center text-[#006c49] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div className="text-xs">
                  <p className="font-bold text-on-surface">Verified Charities & Kitchens</p>
                  <p className="text-on-surface-variant font-medium">Stringent FSSAI & certified NGO distribution</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
                </div>
                <div className="text-xs">
                  <p className="font-bold text-on-surface">Instant Pickup & Delivery</p>
                  <p className="text-on-surface-variant font-medium">Reserve surplus portions in less than 3 taps</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Auth Hub */}
          <div className="lg:w-7/12 p-6 sm:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Tab Switcher */}
              <div className="flex items-center justify-between pb-6">
                <div className="inline-flex p-1 bg-surface-container rounded-2xl">
                  <button
                    onClick={() => setAuthTab('signup')}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      authTab === 'signup' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => setAuthTab('login')}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      authTab === 'login' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
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
                    /* Step 1: Role Selection */
                    <div className="space-y-6">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Step 1 of 2</span>
                        <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-1">
                          Select your role to get started
                        </h2>
                        <p className="text-xs text-on-surface-variant mt-1 font-medium">
                          Choose how you will engage with the ShareBytes food rescue ecosystem.
                        </p>
                      </div>

                      {/* 2x2 Role Selector Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Customer */}
                        <div
                          onClick={() => handleRoleSelect('customer')}
                          className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                            selectedRole === 'customer'
                              ? 'border-primary bg-primary-fixed/30 shadow-sm'
                              : 'border-gray-200 bg-surface-container-low hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              selectedRole === 'customer' ? 'bg-primary text-white' : 'bg-gray-200 text-transparent'
                            }`}>
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h3 className="text-sm font-bold text-on-surface">Customer</h3>
                            <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                              Discover & rescue fresh meals at reduced cost.
                            </p>
                          </div>
                        </div>

                        {/* Restaurant */}
                        <div
                          onClick={() => handleRoleSelect('restaurant')}
                          className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                            selectedRole === 'restaurant'
                              ? 'border-primary bg-primary-fixed/30 shadow-sm'
                              : 'border-gray-200 bg-surface-container-low hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white shadow flex items-center justify-center">
                              <span className="material-symbols-outlined text-[24px]">restaurant</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              selectedRole === 'restaurant' ? 'bg-primary text-white' : 'bg-gray-200 text-transparent'
                            }`}>
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-on-surface">Restaurant / Cafe</h3>
                              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold">Popular</span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                              Post daily surplus inventory before closing hours.
                            </p>
                          </div>
                        </div>

                        {/* Food Donor */}
                        <div
                          onClick={() => handleRoleSelect('food_donor')}
                          className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                            selectedRole === 'food_donor'
                              ? 'border-primary bg-primary-fixed/30 shadow-sm'
                              : 'border-gray-200 bg-surface-container-low hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              selectedRole === 'food_donor' ? 'bg-primary text-white' : 'bg-gray-200 text-transparent'
                            }`}>
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h3 className="text-sm font-bold text-on-surface">Food Donor</h3>
                            <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                              Donate surplus catering, event trays & groceries.
                            </p>
                          </div>
                        </div>

                        {/* NGO / Trust */}
                        <div
                          onClick={() => handleRoleSelect('ngo')}
                          className={`cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                            selectedRole === 'ngo'
                              ? 'border-primary bg-primary-fixed/30 shadow-sm'
                              : 'border-gray-200 bg-surface-container-low hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-[#006c49] text-white shadow flex items-center justify-center">
                              <span className="material-symbols-outlined text-[24px]">handshake</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              selectedRole === 'ngo' ? 'bg-primary text-white' : 'bg-gray-200 text-transparent'
                            }`}>
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <h3 className="text-sm font-bold text-on-surface">NGO / Shelter Trust</h3>
                            <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                              Get priority bulk meal batch allocations for shelters.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Small Muted Admin Sign-in Link */}
                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRole('admin');
                            setAuthTab('login');
                          }}
                          className="text-xs font-medium text-on-surface-variant hover:text-primary underline"
                        >
                          Admin? Sign in here
                        </button>
                      </div>

                      <button
                        onClick={handleProceedToStep2}
                        className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span>Continue Registration</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  ) : (
                    /* Step 2: Role-Specific Form */
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">
                            Step 2 of 2 — {selectedRole.toUpperCase()}
                          </span>
                          <h2 className="text-xl font-bold text-on-surface mt-0.5">Enter Registration Details</h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSignupStep(1)}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                          Change Role
                        </button>
                      </div>

                      {/* Common Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">Full Name / Representative *</label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Rahul Sharma"
                            className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">Mobile Phone Number</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        {(selectedRole === 'restaurant' || selectedRole === 'ngo' || selectedRole === 'food_donor') && (
                          <div>
                            <label className="block text-xs font-bold text-on-surface mb-1">Business / Trust Name *</label>
                            <input
                              type="text"
                              required
                              value={businessName}
                              onChange={e => setBusinessName(e.target.value)}
                              placeholder="Golden Harvest Bakery / St. Jude Trust"
                              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1">Pickup / Physical Address</label>
                        <input
                          type="text"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          placeholder="42 MG Road, Downtown Chennai"
                          className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* Required Certificate & Photo Uploads for Restaurant & NGO */}
                      {selectedRole === 'restaurant' && (
                        <div className="p-4 rounded-2xl bg-primary-fixed/20 border border-primary/30 space-y-3">
                          <span className="text-xs font-bold text-primary block">
                            FSSAI Compliance Verification Documents (Required During Signup)
                          </span>
                          <div>
                            <label className="block text-[11px] font-bold text-on-surface mb-1">
                              Upload FSSAI License Certificate (Image/PDF) *
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(e, setFssaiCertUrl)}
                              className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-on-surface mb-1">
                              Upload Kitchen / Store Front Photo *
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(e, setEntityPhotoUrl)}
                              className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white"
                            />
                          </div>
                        </div>
                      )}

                      {selectedRole === 'ngo' && (
                        <div className="p-4 rounded-2xl bg-secondary-fixed/20 border border-[#006c49]/30 space-y-3">
                          <span className="text-xs font-bold text-[#006c49] block">
                            Trust / NGO Registration Verification Documents (Required During Signup)
                          </span>
                          <div>
                            <label className="block text-[11px] font-bold text-on-surface mb-1">
                              Upload Trust Registration Certificate (12A/80G/CSR) *
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(e, setRegCertUrl)}
                              className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#006c49] file:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-on-surface mb-1">
                              Upload Shelter / Kitchen Premises Photo *
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(e, setEntityPhotoUrl)}
                              className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#006c49] file:text-white"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                        <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ==================== LOG IN FLOW ==================== */}
              {authTab === 'login' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">Welcome Back</h2>
                    <p className="text-xs text-on-surface-variant mt-1 font-medium">
                      Sign in to manage food listings, claims, or partner verifications.
                    </p>
                  </div>

                  {/* Login Toggle: Email vs Mobile OTP */}
                  <div className="flex gap-2 bg-surface-container-low p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        loginMethod === 'email' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'
                      }`}
                    >
                      Email & Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('otp')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        loginMethod === 'otp' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'
                      }`}
                    >
                      Mobile OTP
                    </button>
                  </div>

                  {loginMethod === 'email' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="bakery@goldenharvest.com / admin@sharebytes.org"
                          className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">login</span>
                        <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                      {!otpSent ? (
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">Mobile Number *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-on-surface mb-1">Enter 6-Digit OTP Code *</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otpCode}
                            onChange={e => setOtpCode(e.target.value)}
                            placeholder="123456"
                            className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-sm font-bold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        <span>{otpSent ? 'Verify OTP & Login' : 'Send Verification OTP'}</span>
                      </button>
                    </form>
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

