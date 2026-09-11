'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { FoodType } from '@/lib/types';
import NumericInput from '@/components/NumericInput';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddListingModal({ isOpen, onClose, onSuccess }: AddListingModalProps) {
  const { user, role, showToast } = useAuth();

  const isDonorRole = role === 'food_donor';
  const [isDonationOnly, setIsDonationOnly] = useState(isDonorRole); // Donors always donate
  const [foodType, setFoodType] = useState<FoodType>('veg');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [portionCount, setPortionCount] = useState<number | string>(10);
  const [originalPrice, setOriginalPrice] = useState<number | string>(250);
  const [discountedPrice, setDiscountedPrice] = useState<number | string>(60);
  const getMinExpiryISO = () => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const [expiryTime, setExpiryTime] = useState<string>(() => getMinExpiryISO());
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [pickupLocation, setPickupLocation] = useState(user?.address || 'Chennai Central Hub');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const numPortions = Number(portionCount);
  const isPortionInvalid = portionCount === '' || isNaN(numPortions) || numPortions < 1;
  const isPriceInvalid = !isDonationOnly && originalPrice !== '' && discountedPrice !== '' && Number(discountedPrice) >= Number(originalPrice);
  const selectedExpiryMs = expiryTime ? new Date(expiryTime).getTime() : 0;
  const isExpiryInvalid = !expiryTime || isNaN(selectedExpiryMs) || selectedExpiryMs < Date.now() + 59 * 60 * 1000;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a listing title', 'error');
      return;
    }
    if (isPortionInvalid) {
      showToast('Portions must be at least 1.', 'error');
      return;
    }
    if (isPriceInvalid) {
      showToast('Discounted price should be lower than the original price.', 'error');
      return;
    }
    if (isExpiryInvalid) {
      showToast('Expiry time must be at least 1 hour from now.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const defaultImg = foodType === 'veg'
        ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60'
        : 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=60';

      DataService.addListing({
        title,
        description,
        food_type: foodType,
        portion_count: numPortions,
        original_price: isDonationOnly ? 0 : Number(originalPrice),
        discounted_price: isDonationOnly ? 0 : Number(discountedPrice),
        is_donation_only: isDonationOnly,
        expiry_time: new Date(expiryTime).toISOString(),
        delivery_available: deliveryAvailable,
        pickup_location: pickupLocation,
        image_url: imagePreview || defaultImg,
        created_by: user?.id || 'usr-rest-01',
        role_type: role === 'food_donor' ? 'food_donor' : 'restaurant',
        creator_name: user?.full_name || 'Kitchen Partner',
        creator_business: user?.business_name || user?.full_name || 'Kitchen Partner',
      });

      showToast('Food listing published successfully!', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to create listing', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e1bfb5]/40 max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-on-surface">+ Add Food Listing</h2>
            <p className="text-xs text-on-surface-variant">Post daily surplus batches for immediate community rescue.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Sell vs Donate Toggle — only shown for Restaurants; Donors always donate for free */}
          {isDonorRole ? (
            <div className="bg-[#eaf4ee] p-3 rounded-2xl flex items-center gap-3 border border-[#6ffbbe]/40">
              <span className="material-symbols-outlined text-[#005236] text-[22px]">volunteer_activism</span>
              <div>
                <p className="text-xs font-bold text-[#005236]">Donation Only — always free for NGOs</p>
                <p className="text-[11px] text-[#005236]/70">Food Donors can only post free surplus. The pickup address below is required per listing.</p>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-low p-2 rounded-2xl flex gap-2">
              <button
                type="button"
                onClick={() => setIsDonationOnly(false)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  !isDonationOnly ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">sell</span>
                Sell at Discount (Customers + NGOs)
              </button>
              <button
                type="button"
                onClick={() => setIsDonationOnly(true)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                  isDonationOnly ? 'bg-[#006c49] text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                Donate Free (NGOs Only)
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Listing Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Fresh Veg Dum Biryani Trays"
              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Description & Ingredients</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe prepared meals, packaging, freshness window..."
              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Photo File Upload */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Food Photo Upload *</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-xl object-cover border" />
              )}
            </div>
          </div>

          {/* Food Type & Portions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Food Category</label>
              <select
                value={foodType}
                onChange={e => setFoodType(e.target.value as FoodType)}
                className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="veg">100% Veg</option>
                <option value="non_veg">Non-Veg</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Portions (Meals) *</label>
              <NumericInput
                min={1}
                required
                value={portionCount}
                onChange={val => setPortionCount(val)}
                className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {isPortionInvalid && (
                <p className="text-[11px] text-red-500 font-medium mt-1">Portions must be at least 1.</p>
              )}
            </div>
          </div>

          {/* Pricing Row (if not donation only) */}
          {!isDonationOnly && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Original Price (₹)</label>
                <NumericInput
                  min={0}
                  value={originalPrice}
                  onChange={val => setOriginalPrice(val)}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Discounted Price (₹)</label>
                <NumericInput
                  min={0}
                  value={discountedPrice}
                  onChange={val => setDiscountedPrice(val)}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary text-primary"
                />
                {isPriceInvalid && (
                  <p className="text-[11px] text-red-500 font-medium mt-1">
                    Discounted price should be lower than the original price.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Expiry Time Picker */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Expiry Time *</label>
            <input
              type="datetime-local"
              required
              min={getMinExpiryISO()}
              value={expiryTime}
              onChange={e => setExpiryTime(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {isExpiryInvalid && (
              <p className="text-[11px] text-red-500 font-medium mt-1">
                Expiry time must be at least 1 hour from now.
              </p>
            )}
          </div>

          {/* Pickup & Delivery */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Pickup Address</label>
            <input
              type="text"
              required
              value={pickupLocation}
              onChange={e => setPickupLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="deliveryCheck"
              checked={deliveryAvailable}
              onChange={e => setDeliveryAvailable(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <label htmlFor="deliveryCheck" className="text-xs font-bold text-on-surface cursor-pointer">
              Local Delivery / Courier Available
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-[#e1bfb5] text-on-surface font-bold text-xs hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isPriceInvalid || isPortionInvalid || isExpiryInvalid}
              className={`flex-1 py-3 rounded-full font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isPriceInvalid || isPortionInvalid || isExpiryInvalid
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
