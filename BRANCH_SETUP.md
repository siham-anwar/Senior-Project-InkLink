# InkLink - Branch Setup Guide

This repository is organized for separate branch deployment.

## Branch Structure

### Branch 1: Author Features (author-features)
**Contains:** Author Dashboard + Author Monetization Pages

**Routes:**
- `/author/dashboard` - Author dashboard with stats and story overview
- `/author/monetization` - Earnings management and withdrawal requests

**Files Included:**
- `app/author/layout.tsx` - Author pages layout with navigation
- `app/author/dashboard/page.tsx` - Dashboard page
- `app/author/monetization/page.tsx` - Monetization page
- `components/shared/author-nav.tsx` - Navigation between author pages
- `components/shared/stat-card.tsx` - Stats cards component
- `components/shared/earnings-chart.tsx` - Revenue chart component
- `components/shared/revenue-table.tsx` - Earnings table component
- `components/shared/withdrawal-form.tsx` - Withdrawal form component
- `lib/mock-data.ts` - Mock data for development
- All UI components in `components/ui/`

**How to Deploy:**
```bash
git checkout -b author-features
git add .
git commit -m "Add author dashboard and monetization pages"
git push origin author-features
```

---

### Branch 2: Premium Features (premium-features)
**Contains:** Reader Premium Subscription Page

**Routes:**
- `/premium` - Premium subscription options page

**Files Included:**
- `app/premium/page.tsx` - Premium pricing and features page
- `components/shared/pricing-card.tsx` - Pricing tier card component
- `lib/mock-data.ts` - Mock data (pricing tiers, FAQ)
- All UI components in `components/ui/`

**How to Deploy:**
```bash
git checkout -b premium-features
git add .
git commit -m "Add premium subscription page"
git push origin premium-features
```

---

## Component Files

### Shared Components (Used in Both Branches)
These components are used across the application and should be included in both branches:

- `components/shared/pricing-card.tsx` - Premium pricing cards
- `components/shared/stat-card.tsx` - Dashboard statistics
- `components/shared/earnings-chart.tsx` - Revenue visualization
- `components/shared/revenue-table.tsx` - Earnings breakdown table
- `components/shared/withdrawal-form.tsx` - Withdrawal management
- `components/shared/author-nav.tsx` - Author section navigation
- `lib/mock-data.ts` - All mock data (pricing, earnings, stories)

### Deleted Components
The following components were removed as they are not needed:
- `components/shared/navbar.tsx` - Global navigation (removed)
- `components/shared/author-sidebar.tsx` - Author sidebar (removed)
- `app/author/editor/page.tsx` - Story editor stub (removed)
- `app/author/settings/page.tsx` - Settings page (removed)
- `app/page.tsx` - Home page (handled by another team)

---

## Setup Instructions

### For Author Features Branch
1. Clone the repository
2. Create new branch: `git checkout -b author-features`
3. Keep only these routes/components:
   - `/author/dashboard`
   - `/author/monetization`
   - Author navigation component
4. Remove premium page if needed from your build
5. Deploy to your server/Vercel

### For Premium Features Branch
1. Clone the repository
2. Create new branch: `git checkout -b premium-features`
3. Keep only:
   - `/premium` page
   - Pricing cards component
4. Remove author routes if needed from your build
5. Deploy to your server/Vercel

---

## Environment Variables
Add these to your `.env.local`:
```
# No external API keys needed - uses mock data
# Add your own when connecting to backend
```

---

## Tech Stack
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization
- **React Hook Form** - Form handling

---

## Development

### Running Locally
```bash
npm install
npm run dev
# Visit http://localhost:3000/author/dashboard or http://localhost:3000/premium
```

### Building for Production
```bash
npm run build
npm start
```

---

## Note for Team Members
- **Author Features**: Focus on dashboard stats, earnings tracking, and payout management
- **Premium Features**: Focus on pricing tiers, feature comparison, and subscription benefits
- Both branches use mock data - integrate with your backend API as needed
- Keep navigation internal to each feature set (no cross-linking between branches)

