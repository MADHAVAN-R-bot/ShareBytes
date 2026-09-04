import { UserProfile, FoodListing, FoodClaim, UserNotification, AuditLog, UserRole, VerificationStatus, ClaimStatus } from '@/lib/types';
import { initialProfiles, initialListings, initialClaims, initialNotifications, initialAuditLogs } from './mockData';

const STORAGE_KEYS = {
  PROFILES: 'sb_profiles_v1',
  LISTINGS: 'sb_listings_v1',
  CLAIMS: 'sb_claims_v1',
  NOTIFICATIONS: 'sb_notifications_v1',
  AUDIT: 'sb_audit_v1',
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage error:', err);
  }
}

export class DataService {
  // Profiles
  static getProfiles(): UserProfile[] {
    return getItem<UserProfile[]>(STORAGE_KEYS.PROFILES, initialProfiles);
  }

  static getProfileById(id: string): UserProfile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  static getPendingProfiles(): UserProfile[] {
    return this.getProfiles().filter(p => p.verified_status === 'pending');
  }

  static saveProfile(profile: UserProfile): UserProfile {
    const profiles = this.getProfiles();
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.unshift(profile);
    }
    setItem(STORAGE_KEYS.PROFILES, profiles);
    return profile;
  }

  static verifyUser(userId: string, status: VerificationStatus, reason?: string, actorId?: string): UserProfile {
    const profiles = this.getProfiles();
    const target = profiles.find(p => p.id === userId);
    if (!target) throw new Error('User profile not found');

    target.verified_status = status;
    if (reason) target.rejection_reason = reason;

    setItem(STORAGE_KEYS.PROFILES, profiles);

    // Create notification for target user
    this.addNotification({
      user_id: userId,
      title: `Account Verification ${status === 'verified' ? 'Approved' : 'Rejected'}`,
      message: status === 'verified' 
        ? 'Congratulations! Your partner account is verified. You can now post and claim food.'
        : `Your verification was rejected. Reason: ${reason || 'Incomplete registration details.'}`,
      link: status === 'verified' ? `/dashboard/${target.role}` : '/auth',
    });

    // Create audit log
    this.addAuditLog({
      actor_id: actorId || 'usr-admin-01',
      action: status === 'verified' ? 'VERIFIED_USER' : 'REJECTED_USER',
      target: target.business_name || target.full_name || target.email,
      details: { role: target.role, status, reason },
    });

    return target;
  }

  // Listings
  static getListings(): FoodListing[] {
    return getItem<FoodListing[]>(STORAGE_KEYS.LISTINGS, initialListings);
  }

  static getCustomerListings(): FoodListing[] {
    // Customers can ONLY see discounted restaurant listings (never donation-only)
    return this.getListings().filter(l => !l.is_donation_only && l.status === 'available');
  }

  static getNGOListings(): FoodListing[] {
    // NGOs can see all available listings (both restaurant and donor surplus)
    return this.getListings().filter(l => l.status === 'available');
  }

  static getListingsByUser(userId: string): FoodListing[] {
    return this.getListings().filter(l => l.created_by === userId);
  }

  static addListing(data: Omit<FoodListing, 'id' | 'created_at' | 'status'>): FoodListing {
    const listings = this.getListings();
    const newListing: FoodListing = {
      ...data,
      id: `lst-${Date.now()}`,
      status: 'available',
      created_at: new Date().toISOString(),
    };
    listings.unshift(newListing);
    setItem(STORAGE_KEYS.LISTINGS, listings);

    // Create Audit Log
    this.addAuditLog({
      actor_id: data.created_by,
      action: 'CREATED_LISTING',
      target: data.title,
      details: { is_donation_only: data.is_donation_only, portions: data.portion_count },
    });

    return newListing;
  }

  static deleteListing(id: string): void {
    const listings = this.getListings().filter(l => l.id !== id);
    setItem(STORAGE_KEYS.LISTINGS, listings);
  }

  // Claims
  static getClaims(): FoodClaim[] {
    const claims = getItem<FoodClaim[]>(STORAGE_KEYS.CLAIMS, initialClaims);
    const listings = this.getListings();
    const profiles = this.getProfiles();

    return claims.map(c => ({
      ...c,
      listing: listings.find(l => l.id === c.listing_id),
      claimer: profiles.find(p => p.id === c.claimed_by),
    }));
  }

  static getClaimsForUser(userId: string): FoodClaim[] {
    return this.getClaims().filter(c => c.claimed_by === userId);
  }

  static getClaimsForListingOwner(ownerId: string): FoodClaim[] {
    const listings = this.getListingsByUser(ownerId).map(l => l.id);
    return this.getClaims().filter(c => listings.includes(c.listing_id));
  }

  static createClaim(data: Omit<FoodClaim, 'id' | 'created_at' | 'status'>): FoodClaim {
    const claims = getItem<FoodClaim[]>(STORAGE_KEYS.CLAIMS, initialClaims);
    const newClaim: FoodClaim = {
      ...data,
      id: `clm-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    claims.unshift(newClaim);
    setItem(STORAGE_KEYS.CLAIMS, claims);

    // Notify listing creator
    const listing = this.getListings().find(l => l.id === data.listing_id);
    if (listing) {
      this.addNotification({
        user_id: listing.created_by,
        title: 'New Food Claim Received!',
        message: `Someone requested ${data.portion_count} portion(s) of "${listing.title}".`,
        link: `/dashboard/${listing.role_type}`,
      });
    }

    return newClaim;
  }

  static updateClaimStatus(claimId: string, status: ClaimStatus): FoodClaim {
    const claims = getItem<FoodClaim[]>(STORAGE_KEYS.CLAIMS, initialClaims);
    const target = claims.find(c => c.id === claimId);
    if (!target) throw new Error('Claim not found');

    target.status = status;
    setItem(STORAGE_KEYS.CLAIMS, claims);

    // If accepted, update listing portion count or status
    if (status === 'accepted') {
      const listings = this.getListings();
      const listing = listings.find(l => l.id === target.listing_id);
      if (listing) {
        listing.portion_count = Math.max(0, listing.portion_count - target.portion_count);
        if (listing.portion_count === 0) {
          listing.status = 'claimed';
        }
        setItem(STORAGE_KEYS.LISTINGS, listings);
      }
    }

    // Notify claimer
    this.addNotification({
      user_id: target.claimed_by,
      title: `Claim ${status.toUpperCase()}`,
      message: `Your reservation request has been ${status}.`,
      link: '/dashboard/customer',
    });

    return target;
  }

  // Notifications
  static getNotifications(userId: string): UserNotification[] {
    const notifications = getItem<UserNotification[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    return notifications.filter(n => n.user_id === userId);
  }

  static addNotification(data: Omit<UserNotification, 'id' | 'read' | 'created_at'>): UserNotification {
    const notifications = getItem<UserNotification[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    const newNotif: UserNotification = {
      ...data,
      id: `ntf-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    notifications.unshift(newNotif);
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotif;
  }

  static markNotificationRead(id: string): void {
    const notifications = getItem<UserNotification[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    const target = notifications.find(n => n.id === id);
    if (target) {
      target.read = true;
      setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return getItem<AuditLog[]>(STORAGE_KEYS.AUDIT, initialAuditLogs);
  }

  static addAuditLog(data: Omit<AuditLog, 'id' | 'created_at'>): AuditLog {
    const logs = getItem<AuditLog[]>(STORAGE_KEYS.AUDIT, initialAuditLogs);
    const actor = this.getProfileById(data.actor_id);
    const newLog: AuditLog = {
      ...data,
      id: `aud-${Date.now()}`,
      created_at: new Date().toISOString(),
      actor_email: actor?.email || 'admin@sharebytes.org',
    };
    logs.unshift(newLog);
    setItem(STORAGE_KEYS.AUDIT, logs);
    return newLog;
  }

  // Platform Analytics
  static getPlatformStats() {
    const listings = this.getListings();
    const claims = this.getClaims();
    const profiles = this.getProfiles();

    const totalMealsRescued = claims.reduce((acc, c) => c.status === 'accepted' || c.status === 'completed' ? acc + c.portion_count : acc, 14280);
    const co2DivertedKg = Math.round(totalMealsRescued * 0.4);

    return {
      totalMealsRescued,
      co2DivertedKg,
      activeListingsCount: listings.filter(l => l.status === 'available').length,
      verifiedPartnersCount: profiles.filter(p => p.verified_status === 'verified').length,
      pendingVerificationsCount: profiles.filter(p => p.verified_status === 'pending').length,
      usersByRole: {
        customer: profiles.filter(p => p.role === 'customer').length,
        restaurant: profiles.filter(p => p.role === 'restaurant').length,
        food_donor: profiles.filter(p => p.role === 'food_donor').length,
        ngo: profiles.filter(p => p.role === 'ngo').length,
        admin: profiles.filter(p => p.role === 'admin').length,
      },
    };
  }
}
