'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/lib/types';
import { DataService } from '@/lib/services/dataService';

interface ToastState {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  signup: (data: Partial<UserProfile> & { role: UserRole; email: string; full_name: string }) => Promise<boolean>;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    // Load persisted active user or default demo user
    const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('sb_active_user_id') : null;
    const profiles = DataService.getProfiles();
    
    let activeUser = profiles.find(p => p.id === savedUserId);
    if (!activeUser) {
      activeUser = profiles.find(p => p.role === 'restaurant') || profiles[0];
    }
    
    if (activeUser) {
      setUser(activeUser);
      setRole(activeUser.role);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, preferredRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const profiles = DataService.getProfiles();
      let matchedUser = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

      if (!matchedUser) {
        // Create demo account if not exists
        const targetRole = preferredRole || 'customer';
        matchedUser = {
          id: `usr-${Date.now()}`,
          email,
          role: targetRole,
          full_name: email.split('@')[0],
          verified_status: targetRole === 'restaurant' || targetRole === 'ngo' ? 'pending' : 'verified',
          created_at: new Date().toISOString(),
        };
        DataService.saveProfile(matchedUser);
      }

      setUser(matchedUser);
      setRole(matchedUser.role);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sb_active_user_id', matchedUser.id);
      }
      showToast(`Welcome back, ${matchedUser.full_name || matchedUser.email}!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: Partial<UserProfile> & { role: UserRole; email: string; full_name: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        email: data.email,
        role: data.role,
        full_name: data.full_name,
        phone: data.phone || '',
        business_name: data.business_name || data.full_name,
        address: data.address || 'Chennai, Tamil Nadu',
        fssai_cert_url: data.fssai_cert_url || '',
        registration_cert_url: data.registration_cert_url || '',
        entity_photo_url: data.entity_photo_url || '',
        verified_status: data.role === 'restaurant' || data.role === 'ngo' ? 'pending' : 'verified',
        created_at: new Date().toISOString(),
      };

      DataService.saveProfile(newProfile);
      setUser(newProfile);
      setRole(newProfile.role);

      if (typeof window !== 'undefined') {
        localStorage.setItem('sb_active_user_id', newProfile.id);
      }

      if (newProfile.verified_status === 'pending') {
        showToast('Registration submitted! Account pending Admin verification.', 'info');
      } else {
        showToast('Account created successfully!', 'success');
      }
      return true;
    } catch (err: any) {
      showToast(err.message || 'Signup failed', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole: UserRole) => {
    const profiles = DataService.getProfiles();
    const matched = profiles.find(p => p.role === newRole);
    if (matched) {
      setUser(matched);
      setRole(matched.role);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sb_active_user_id', matched.id);
      }
      showToast(`Switched active role to ${newRole.toUpperCase()} (${matched.full_name})`, 'info');
    } else if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      setRole(newRole);
      showToast(`Role set to ${newRole.toUpperCase()}`, 'info');
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sb_active_user_id');
    }
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        toasts,
        showToast,
        removeToast,
        login,
        signup,
        switchRole,
        logout,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-sm font-bold flex items-center justify-between gap-3 animate-slide-up transition-all ${
              toast.type === 'success'
                ? 'bg-[#eaf4ee] text-[#005236] border-[#6ffbbe]'
                : toast.type === 'error'
                ? 'bg-[#ffdad6] text-[#93000a] border-[#ffb3ad]'
                : 'bg-[#fff8f6] text-[#261814] border-[#e1bfb5]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
              </span>
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-70 hover:opacity-100"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
