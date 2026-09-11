# ShareBytes Internal Testing Guide & Seed Credentials

This file contains internal developer/tester reference credentials for local testing across all user role personas in ShareBytes.

> [!NOTE]
> All seed accounts in local demo mode accept password **`demo1234`**.

---

## Seed Accounts by Role Persona

### 1. Platform Administrator
- **Email**: `admin@sharebytes.org`
- **Password**: `demo1234`
- **Role**: `admin`
- **Dashboard URL**: `/dashboard/admin`
- **Capabilities**: Full administration, partner verification queue (Restaurants & NGOs), user directory management, audit logs, analytics.

---

### 2. Restaurant / Cafe Partner (Verified)
- **Email**: `bakery@goldenharvest.com`
- **Password**: `demo1234`
- **Role**: `restaurant`
- **Dashboard URL**: `/dashboard/restaurant`
- **Business**: Golden Harvest Bakery & Cafe
- **Status**: Verified

---

### 3. Restaurant / Cafe Partner (Pending Verification)
- **Email**: `bistro@greenearth.com`
- **Password**: `demo1234`
- **Role**: `restaurant`
- **Dashboard URL**: `/dashboard/restaurant`
- **Business**: Green Earth Organic Bistro
- **Status**: Pending Verification (FSSAI review in Admin HQ)

---

### 4. Food Donor (Caterers / Event Organizers)
- **Email**: `donor@anandcaterers.com`
- **Password**: `demo1234`
- **Role**: `food_donor`
- **Dashboard URL**: `/dashboard/donor`
- **Business**: Anand Event & Banquet Caterers
- **Status**: Verified

---

### 5. NGO / Shelter Trust (Verified)
- **Email**: `ngo@stjude.org`
- **Password**: `demo1234`
- **Role**: `ngo`
- **Dashboard URL**: `/dashboard/ngo`
- **Trust Name**: St. Jude Shelter & Hope Trust
- **Status**: Verified

---

### 6. NGO / Shelter Trust (Pending Verification)
- **Email**: `ngo@hopehaven.org`
- **Password**: `demo1234`
- **Role**: `ngo`
- **Dashboard URL**: `/dashboard/ngo`
- **Trust Name**: Hope Haven Children Trust
- **Status**: Pending Verification

---

### 7. Customer / Rescuer
- **Email**: `customer@gmail.com`
- **Password**: `demo1234`
- **Role**: `customer`
- **Dashboard URL**: `/dashboard/customer`
- **Name**: Rahul Sharma
- **Status**: Verified

---

## Environment & Supabase Configuration Notes

- App runs with `.env` containing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- If real Supabase credentials are not provided or remain placeholders, the authentication context gracefully falls back to local seed data without throwing hard errors.
