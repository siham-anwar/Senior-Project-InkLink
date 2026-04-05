# Author Features Branch Setup

## Overview
This branch contains **Author Dashboard & Monetization** features - allows authors to manage their stories, track earnings, and request withdrawals.

## Structure
```
app/
├── author/
│   ├── layout.tsx              # Author layout with navigation
│   ├── dashboard/
│   │   └── page.tsx            # Author dashboard page
│   └── monetization/
│       └── page.tsx            # Author earnings & payouts page
├── layout.tsx                  # Root layout (no global navbar)
└── page.tsx                    # Redirects to /author/dashboard

components/shared/
├── author-nav.tsx              # Author page navigation (Dashboard & Earnings)
├── stat-card.tsx               # Display metrics (views, earnings, etc.)
├── earnings-chart.tsx          # Revenue chart visualization
├── revenue-table.tsx           # Per-story earnings breakdown
├── withdrawal-form.tsx         # Withdrawal request modal form
└── [other shared components]

lib/
└── mock-data.ts                # Mock author, stories, and earnings data
```

## What's Included
- Author Dashboard (`/author/dashboard`)
  - Welcome greeting with author name
  - 4 metric cards (Stories, Views, Earnings, Followers)
  - 12-month earnings chart (Recharts)
  - Top performing stories table
  - Sortable stories list with stats

- Author Monetization (`/author/monetization`)
  - 4 earnings metric cards (Lifetime, Current Month, Pending, Available)
  - 12-month revenue trend chart
  - Per-story earnings breakdown table
  - Withdrawal request modal with form
  - Withdrawal history
  - Payment method display (Chapa)

## Features
✓ Dashboard and Monetization linked together
✓ Internal navigation between pages
✓ Fully styled with green & gold color scheme
✓ Responsive design (mobile & desktop)
✓ Form validation (withdrawal form)
✓ Mock data for testing
✓ Production-ready components

## Independent Features
✓ Author pages are **completely linked together**
✓ **Separate from premium page**
✓ Can be developed independently
✓ Merged together as one branch

## To Use This Branch

```bash
# Create author features branch
git checkout -b author-features

# Push to GitHub
git push origin author-features
```

## Files to Include in Author Branch
```
app/
  author/
    layout.tsx
    dashboard/
      page.tsx
    monetization/
      page.tsx
  page.tsx
  layout.tsx
  globals.css

components/
  ui/
    [all shadcn components]
  shared/
    author-nav.tsx
    stat-card.tsx
    earnings-chart.tsx
    revenue-table.tsx
    withdrawal-form.tsx

lib/
  mock-data.ts
  utils.ts

package.json
tsconfig.json
next.config.mjs
```

## Navigation
```
Dashboard ↔ Monetization
(Connected via author-nav.tsx at top)
```

## Customization Points

### Author Data
Edit `lib/mock-data.ts`:
```typescript
export const mockAuthor = {
  name: 'Almaz Tekle',
  email: 'almaz@example.com',
  totalStories: 8,
  totalViews: 45230,
  totalEarnings: 125750,
  // ...
}
```

### Earnings History
Edit `lib/mock-data.ts`:
```typescript
export const mockEarningHistory = [
  { month: 'May', earnings: 12500 },
  { month: 'June', earnings: 15300 },
  // ...
]
```

### Stories Data
Edit `lib/mock-data.ts`:
```typescript
export const mockStories = [
  {
    id: 1,
    title: 'The Lost Kingdom',
    views: 5230,
    earnings: 45000,
    // ...
  },
  // More stories...
]
```

## Colors & Styling
- Primary color: Deep green (`oklch(0.45 0.18 150)`)
- Secondary color: Warm gold (`oklch(0.92 0.05 50)`)
- Edit `app/globals.css` for theme customization

## Integration with Backend

### Dashboard Integration
Replace `mockAuthor` and `mockStories` with API calls:

```typescript
// In dashboard/page.tsx
const authorId = session?.user?.id;
const authorData = await fetch(`/api/authors/${authorId}`);
const stories = await fetch(`/api/authors/${authorId}/stories`);
```

### Monetization Integration
Replace mock earnings with real data:

```typescript
// In monetization/page.tsx
const earnings = await fetch(`/api/authors/${authorId}/earnings`);
const earnings = await fetch(`/api/authors/${authorId}/withdrawals`);
```

### Withdrawal Form
Connect form to backend:

```typescript
// In withdrawal-form.tsx
const submitWithdrawal = async (data) => {
  const response = await fetch('/api/withdrawals', {
    method: 'POST',
    body: JSON.stringify({
      authorId,
      amount: data.amount,
      accountNumber: data.accountNumber,
    }),
  });
  // Handle response...
}
```

## Notes for Merging
- Frontend-only branch (no backend code)
- Uses mock data for demonstration
- All internal links work (Dashboard ↔ Monetization)
- No external links to other features
- Styling is complete and production-ready
- Can be deployed independently
- Ready to integrate with backend APIs
