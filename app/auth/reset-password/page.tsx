'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showToast } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      showToast('Please enter a new password', 'error');
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

    setIsSubmitting(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const hasRealSupabase =
        supabaseUrl && !supabaseUrl.includes('placeholder') &&
        supabaseKey && !supabaseKey.includes('placeholder');

      if (hasRealSupabase) {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
          showToast(error.message || 'Failed to update password', 'error');
          setIsSubmitting(false);
          return;
        }
      }

      showToast('Password reset successfully! Please sign in with your new password.', 'success');
      router.push('/auth?tab=login');
    } catch (err: any) {
      showToast(err.message || 'Password reset failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 sm:p-6 font-body">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#e1bfb5]/40 space-y-6">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block">
              <Image src="/logo.png" alt="ShareBytes Logo" width={130} height={36} className="h-8 w-auto mx-auto object-contain" />
            </Link>
            <h1 className="text-2xl font-bold text-on-surface">Set New Password</h1>
            <p className="text-xs text-on-surface-variant font-medium">
              Enter your new account password below.
            </p>
          </div>

          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">New Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-on-surface-variant hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Confirm New Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{isSubmitting ? 'Updating Password...' : 'Save New Password & Sign In'}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100">
            <Link href="/auth?tab=login" className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
