'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ChangePasswordCard() {
  const { user, showToast, updateProfile } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      showToast('Please enter a new password', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setIsChanging(true);

    try {
      // Check if real Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const hasRealSupabase =
        supabaseUrl && !supabaseUrl.includes('placeholder') &&
        supabaseKey && !supabaseKey.includes('placeholder');

      if (hasRealSupabase) {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          showToast(error.message || 'Failed to update password in Supabase', 'error');
          setIsChanging(false);
          return;
        }
      }

      // Also update local demo password profile
      updateProfile({ demo_password: newPassword });

      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#e1bfb5]/40 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-on-surface">Security & Password</h2>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            Update your login password securely.
          </p>
        </div>
        <span className="material-symbols-outlined text-primary text-[24px]">lock_reset</span>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">Current Password (optional)</label>
          <input
            type={showPass ? 'text' : 'password'}
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">New Password *</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPass ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Confirm New Password *</label>
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isChanging}
          className="w-full py-3.5 rounded-full bg-surface-container hover:bg-primary hover:text-white text-on-surface font-bold text-xs flex items-center justify-center gap-2 transition-all border border-[#e1bfb5]/60 shadow-sm disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">key</span>
          {isChanging ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
