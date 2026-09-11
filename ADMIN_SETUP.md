# ShareBytes — Admin Account Setup Guide

> This document explains how to correctly create and promote an Admin account.
> Read this **before** trying to create admin accounts via the Supabase Table Editor.
> First-time setup: ensure you have executed [`supabase/FINAL_SETUP.sql`](file:///m:/works/newui/supabase/FINAL_SETUP.sql) in your Supabase SQL Editor.

---

## Why you can't create an Admin by editing the Table directly

The `profiles` table has a **foreign key constraint** on `id` that references `auth.users(id)`.
This means:

- Creating a row directly in `profiles` via the Table Editor does **not** create a real login.
- Supabase Auth won't know about this user, so login will always say **"email not found"**.
- The `auth.users` row must exist first (created via Supabase Auth signup), and the `profiles` row is auto-created by the `handle_new_user()` trigger.

---

## Correct Admin Creation Process

### Step 1 — Sign up normally through the website

Navigate to `/auth` and sign up with **any role** (e.g. Customer or Restaurant).
Use the real email you want as the Admin login.

After signup:
- An `auth.users` row is created by Supabase Auth.
- The `handle_new_user()` trigger automatically creates a matching `profiles` row.

### Step 2 — Promote to Admin via SQL

Open the **Supabase SQL Editor** and run:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

Replace `your-admin-email@example.com` with the email you signed up with.

### Step 3 — Log in as Admin

On the Login page, click **"Admin? Sign in here"** at the bottom.  
Enter your email and password.  
You will be redirected to `/dashboard/admin`.

---

## Verify Admin Access

Once logged in as Admin, confirm you can see:

- ✅ **Verify Restaurants** — pending restaurant partner applications
- ✅ **Verify NGOs/Trusts** — pending NGO applications
- ✅ **Manage Users** — all user profiles
- ✅ **Analytics** — platform-wide stats
- ✅ **Audit Logs** — all platform actions

---

## Additional Admin SQL Snippets

### List all users by role

```sql
SELECT id, email, role, full_name, verified_status, created_at
FROM public.profiles
ORDER BY created_at DESC;
```

### Verify a pending restaurant or NGO partner

```sql
UPDATE public.profiles
SET verified_status = 'verified'
WHERE email = 'partner-email@example.com'
  AND role IN ('restaurant', 'ngo');
```

### Reject a pending application

```sql
UPDATE public.profiles
SET verified_status = 'rejected',
    rejection_reason = 'Incomplete or invalid documentation.'
WHERE email = 'applicant@example.com';
```

### Demote an Admin back to customer (if needed)

```sql
UPDATE public.profiles
SET role = 'customer'
WHERE email = 'former-admin@example.com';
```

---

## Canonical Role Values

The platform uses exactly these 5 role values everywhere:

| Role | Description |
|------|-------------|
| `customer` | Browses and reserves discounted meals |
| `restaurant` | Posts surplus food listings (verified partner) |
| `food_donor` | Donates free surplus from events/catering |
| `ngo` | Claims free donations; NGO priority window access |
| `admin` | Full platform administration |

> **Note**: The database `profiles_role_check` constraint enforces this exact set.
> Any other value (e.g. `'cafe'`, `'donor'`, `'ngo_trust'`) will be rejected at the DB level.
