# InkLink - Frontend Features

This repository contains two independent frontend feature sets for the InkLink digital publishing platform.

## Features Included

### 1. Author Dashboard & Monetization (Protected Routes)
**Location:** `/author/dashboard` and `/author/monetization`

Connected via internal navigation. Authors can:
- View statistics (stories, views, earnings, followers)
- See monthly earnings chart
- Track individual story performance
- Request withdrawals via Chapa payment

### 2. Premium Subscription Page (Public Route)
**Location:** `/premium`

Independent page. Readers can:
- View 3 pricing tiers
- Switch between monthly/yearly billing
- See feature comparison
- Review FAQ

---

## Quick Start

### Installation
```bash
npm install
npm run dev
```

### Access Pages
- Author Dashboard: `http://localhost:3000/author/dashboard`
- Author Monetization: `http://localhost:3000/author/monetization`
- Premium Page: `http://localhost:3000/premium`

---

## Project Structure

```
app/
├── author/
│   ├── layout.tsx (Author-specific layout)
│   ├── dashboard/page.tsx
│   └── monetization/page.tsx
├── premium/
│   └── page.tsx
└── globals.css (Beautiful color scheme)

components/shared/
├── author-nav.tsx (Dashboard ↔ Monetization navigation)
├── stat-card.tsx
├── earnings-chart.tsx
├── revenue-table.tsx
├── withdrawal-form.tsx
└── pricing-card.tsx
```

---

## Branch Structure

This codebase is organized for separate branch deployment:

### Branch 1: author-features
Contains author dashboard and monetization pages
```bash
git checkout -b author-features
```

### Branch 2: premium-features
Contains premium subscription page
```bash
git checkout -b premium-features
```

See `BRANCH_SETUP.md` for detailed instructions.

---

## Technology Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **Zod** - Schema validation

---

## Features

### Author Dashboard
- ✅ 4 metric cards (stories, views, earnings, followers)
- ✅ Monthly earnings trend chart
- ✅ Stories table with sorting
- ✅ Top performing stories widget
- ✅ Internal navigation to monetization

### Author Monetization
- ✅ 4 earnings metric cards
- ✅ 12-month revenue chart
- ✅ Per-story earnings table
- ✅ Payment method display
- ✅ Withdrawal form with validation
- ✅ Withdrawal history
- ✅ Internal navigation to dashboard

### Premium Page
- ✅ 3 pricing tiers
- ✅ Monthly/yearly toggle
- ✅ Feature comparison
- ✅ FAQ section
- ✅ Responsive design
- ✅ Beautiful gradient styling

---

## Color Scheme

Beautiful green and gold palette:
- **Primary (Deep Green)**: All main actions and highlights
- **Secondary (Warm Gold)**: Alternative accent color
- **Gradient styling**: Titles and backgrounds
- **Full dark mode support**

---

## Components Used

### Pages
- Author Dashboard (153 lines)
- Author Monetization (229 lines)
- Premium Page (195 lines)

### Reusable Components
- PricingCard - Pricing tier display
- StatCard - Statistics display
- EarningsChart - Revenue visualization
- RevenueTable - Earnings breakdown
- WithdrawalForm - Withdrawal management
- AuthorNav - Navigation between author pages

---

## Mock Data

All pages use mock data for development. See `lib/mock-data.ts` for:
- Author profile and statistics
- Story information and earnings
- Earnings history
- Transaction data
- Pricing tiers
- FAQ items

Replace with real API calls when connecting to backend.

---

## Setup for GitHub

### Option 1: Separate Branches (Recommended)
```bash
# Branch 1: Author features
git checkout -b author-features
git push origin author-features

# Branch 2: Premium features
git checkout main
git checkout -b premium-features
git push origin premium-features
```

### Option 2: Single Repository
Keep both features in one repository and deploy as needed.

---

## Environment Variables

No external API keys needed for development. When ready to deploy:

```env
# Add your backend API URLs
NEXT_PUBLIC_API_URL=your_api_url

# Payment gateway (when ready)
NEXT_PUBLIC_CHAPA_KEY=your_chapa_key
```

---

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -t inklink .
docker run -p 3000:3000 inklink
```

### Other Platforms
Works with any Node.js hosting (AWS, DigitalOcean, Railway, etc.)

---

## Documentation

- **`BRANCH_SETUP.md`** - How to set up separate branches
- **`CLEANUP_SUMMARY.md`** - What was cleaned up and why
- **`FILE_MANIFEST.md`** - Complete file structure

---

## Next Steps

1. **Replace mock data** with real API calls
2. **Connect to your backend** (user authentication, database, etc.)
3. **Implement Chapa payment** integration
4. **Add loading states** and error handling
5. **Deploy to production**

---

## Code Quality

- ✅ TypeScript throughout
- ✅ Proper component structure
- ✅ Reusable components
- ✅ Clean imports and dependencies
- ✅ Tailwind CSS best practices
- ✅ Accessible UI components (shadcn/ui)
- ✅ Form validation with React Hook Form + Zod
- ✅ Responsive design

---

## Git Workflow

```bash
# Clone repository
git clone <repo-url>
cd inklink

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: your feature"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request on GitHub
```

---

## Testing

```bash
# Run development server
npm run dev

# Visit pages and test:
# - Author Dashboard: http://localhost:3000/author/dashboard
# - Author Monetization: http://localhost:3000/author/monetization
# - Premium Page: http://localhost:3000/premium

# Test navigation
# Test form submissions
# Test responsive design (mobile, tablet, desktop)
```

---

## Performance

- Optimized images with Next.js Image
- Code splitting per page
- CSS minification with Tailwind
- Fast chart rendering (Recharts)
- Efficient form handling

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## License

Private repository for InkLink team.

---

## Questions?

Refer to:
1. `BRANCH_SETUP.md` - for branch instructions
2. `FILE_MANIFEST.md` - for file structure
3. `CLEANUP_SUMMARY.md` - for what was removed

---

**Built with ❤️ for African writers**
