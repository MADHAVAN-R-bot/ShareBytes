# 🍲 ShareBytes — Community Food Rescue & Surplus Network

> **"Every shared byte feeds hope."**  
> ShareBytes is a modern, web-based community food rescue platform connecting neighborhood kitchens, cafes, food donors, and restaurants with NGOs, shelters, and local citizens to minimize food waste and eliminate hunger.

---

## 🌟 Key Features

### 👥 Multi-Role Ecosystem
- **Restaurant / Cafe**: Post surplus food items with discounted prices, portion details, expiry timestamps, FSSAI compliance verification, and track real-time orders.
- **Food Donor**: Donate surplus meals directly to local verified NGOs and community kitchens.
- **NGO / Shelter**: Browse nearby food donations and claim surplus meals for community distribution (verified via NGO registration certificates).
- **Customer**: Discover surplus meals at heavily discounted prices, choose between **Razorpay Online Payment** or **Cash on Pickup/Delivery**, track active orders, and save favorite outlets.
- **Admin Command Center**: Verify new restaurant & NGO registrations (FSSAI & Trust documentation), manage user accounts, suspend policy violators, and monitor platform impact analytics.

### ⚡ Core Technical Capabilities
- **Next.js 14 App Router & TypeScript**: Fast, accessible, and type-safe server & client components.
- **Supabase Integration & Fallback**: Complete PostgreSQL schema with RLS policies, automated profile triggers, and fallback capabilities.
- **Razorpay Online Payments**: Server-side order creation (`/api/razorpay`) and seamless checkout widget integration.
- **Password Reset & Mobile OTP**: Self-service password updates via Supabase Auth.
- **Responsive Modern UI**: Styled with Tailwind CSS, custom design tokens, glassmorphism, and micro-interactions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL & GoTrue Auth)
- **Payment Gateway**: [Razorpay API](https://razorpay.com/)
- **Icons & Fonts**: Google Material Symbols Outlined & Plus Jakarta Sans

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/ShareBytes.git
cd ShareBytes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your actual environment credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay Test Keys (https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 4. Database Setup (Supabase)

Execute the SQL script located in [`supabase/FINAL_SETUP.sql`](file:///m:/works/newui/supabase/FINAL_SETUP.sql) inside your Supabase project's SQL Editor to set up:
- `public.profiles`, `public.listings`, `public.claims`, `public.saved_addresses`, and `public.audit_logs` tables.
- RLS Policies for secure multi-role access.
- `handle_new_user()` trigger for automated user profile creation upon signup.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Deployment

### Test Production Build

```bash
npm run build
```

### Deploy to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Add the required environment variables in **Project Settings -> Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
4. Click **Deploy**.

---

## 📁 Directory Structure

```
├── app/                      # Next.js App Router pages & API routes
│   ├── api/razorpay/         # Razorpay checkout API endpoint
│   ├── auth/                 # Login & Signup flows, password reset
│   ├── dashboard/            # Role-based dashboards (admin, customer, donor, ngo, restaurant)
│   ├── marketplace/          # Public food surplus marketplace
│   └── page.tsx              # Homepage
├── components/               # Reusable UI components & modals
├── context/                  # AuthContext & global state providers
├── lib/                      # Supabase client, services, and TypeScript types
│   ├── services/             # DataService & mock fallback data
│   ├── supabase/             # Supabase client & error parser
│   └── types.ts              # Data models & interfaces
├── public/                   # Static images & branding assets
└── supabase/                 # Database migrations & SQL setup scripts
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
