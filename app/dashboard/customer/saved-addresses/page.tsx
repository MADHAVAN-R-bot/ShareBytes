'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

const initialAddresses: SavedAddress[] = [
  { id: 'addr-1', label: 'Home', address: 'Flat 4B, Emerald Heights, MG Road', city: 'Chennai', pincode: '600001', isDefault: true },
  { id: 'addr-2', label: 'Office', address: 'Tech Park Tower B, 5th Floor, OMR', city: 'Chennai', pincode: '600096', isDefault: false },
];

export default function CustomerSavedAddressesPage() {
  const { showToast } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [label, setLabel] = useState('Home');
  const [addressStr, setAddressStr] = useState('');
  const [city, setCity] = useState('Chennai');
  const [pincode, setPincode] = useState('600001');

  const openAddModal = () => {
    setEditingId(null);
    setLabel('Home');
    setAddressStr('');
    setCity('Chennai');
    setPincode('600001');
    setIsModalOpen(true);
  };

  const openEditModal = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setLabel(addr.label);
    setAddressStr(addr.address);
    setCity(addr.city);
    setPincode(addr.pincode);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast('Address removed', 'info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressStr.trim()) {
      showToast('Please enter address details', 'error');
      return;
    }

    if (editingId) {
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...a, label, address: addressStr, city, pincode } : a));
      showToast('Address updated successfully!', 'success');
    } else {
      const newAddr: SavedAddress = {
        id: `addr-${Date.now()}`,
        label,
        address: addressStr,
        city,
        pincode,
        isDefault: addresses.length === 0,
      };
      setAddresses(prev => [...prev, newAddr]);
      showToast('New address saved!', 'success');
    }
    setIsModalOpen(false);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    showToast('Default delivery address updated', 'info');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Customer Portal</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Saved Delivery Addresses</h1>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Manage your delivery locations for fast meal checkouts.</p>
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
            + Add New Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e1bfb5]/40 space-y-3">
            <span className="material-symbols-outlined text-gray-300 text-[48px]">location_off</span>
            <p className="text-xs font-bold text-on-surface-variant">No saved addresses yet.</p>
            <button onClick={openAddModal} className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-sm">
              Add First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white rounded-3xl p-6 border border-[#e1bfb5]/40 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-primary-fixed/30 text-primary text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">home</span>
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#eaf4ee] text-[#005236] text-[10px] font-bold uppercase">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-on-surface leading-tight pt-1">{addr.address}</p>
                  <p className="text-xs text-on-surface-variant">{addr.city} • {addr.pincode}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Make Default
                    </button>
                  ) : <span className="text-xs font-bold text-[#005236]">Default Address</span>}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(addr)}
                      className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit Address"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-[#ba1a1a] transition-colors"
                      title="Delete Address"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e1bfb5]/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-on-surface">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Address Label</label>
                <select
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-bold"
                >
                  <option value="Home">Home</option>
                  <option value="Work / Office">Work / Office</option>
                  <option value="Friends & Family">Friends & Family</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Full Street Address *</label>
                <input
                  type="text"
                  required
                  value={addressStr}
                  onChange={e => setAddressStr(e.target.value)}
                  placeholder="Door No, Street Name, Landmark"
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-surface-container-low border border-[#e1bfb5]/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-full border border-[#e1bfb5] text-xs font-bold text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md transition-all"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
