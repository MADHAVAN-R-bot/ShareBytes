export type UserRole = 'customer' | 'restaurant' | 'food_donor' | 'ngo' | 'admin';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type FoodType = 'veg' | 'non_veg';
export type ListingStatus = 'available' | 'claimed' | 'completed' | 'cancelled';
export type ClaimStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash_on_pickup' | 'cash_on_delivery';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  business_name?: string;
  address?: string;
  fssai_cert_url?: string;
  registration_cert_url?: string;
  entity_photo_url?: string;
  verified_status: VerificationStatus;
  rejection_reason?: string;
  created_at: string;
  // Demo-mode only: stored password for local auth validation (not for production)
  demo_password?: string;
  // Additional profile fields
  fssai_number?: string;
  cuisine_type?: string;
  org_registration_number?: string;
}

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  food_type: FoodType;
  portion_count: number;
  original_price: number;
  discounted_price: number;
  is_donation_only: boolean;
  expiry_time: string;
  delivery_available: boolean;
  pickup_location: string;
  image_url: string;
  status: ListingStatus;
  created_by: string;
  role_type: 'restaurant' | 'food_donor';
  created_at: string;
  creator_name?: string;
  creator_business?: string;
}

export interface FoodClaim {
  id: string;
  listing_id: string;
  claimed_by: string;
  portion_count: number;
  status: ClaimStatus;
  payment_method: PaymentMethod;
  delivery_requested: boolean;
  created_at: string;
  listing?: FoodListing;
  claimer?: UserProfile;
}

export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  target: string;
  details: Record<string, any>;
  created_at: string;
  actor_email?: string;
}
