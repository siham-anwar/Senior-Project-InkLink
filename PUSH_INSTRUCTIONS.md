# How to Push Both Features Separately to GitHub

## Quick Overview
You have **2 independent features** that need to be pushed as separate branches:
1. **Author Branch** - Dashboard + Monetization pages
2. **Premium Branch** - Premium subscription page

---

## Step 1: Initial Setup (One Time Only)

If you haven't set up Git yet:

```bash
# Initialize git in your project
git init

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Configure git (replace with your info)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

---

## Step 2: Push Author Features (Dashboard + Monetization)

### 2.1 Create Author Branch
```bash
git checkout -b author-features
```

### 2.2 Add All Files
```bash
git add .
```

### 2.3 Create Commit
```bash
git commit -m "Add author dashboard and monetization features

- Author dashboard with stats, earnings chart, and stories table
- Author monetization page with withdrawal forms and earnings breakdown
- Author navigation between dashboard and earnings pages
- Mock data for author, stories, and earnings
- Beautiful green & gold color scheme"
```

### 2.4 Push to GitHub
```bash
git push -u origin author-features
```

**Result:** Your author features will be on the `author-features` branch

---

## Step 3: Push Premium Features (Separate Branch)

### 3.1 Create Premium Branch (from main/master)
```bash
# First, switch to main branch (or master)
git checkout main

# Or if main doesn't exist, use master
git checkout master
```

**Note:** If you get an error, the branch doesn't exist. Skip to 3.2.

### 3.2 Create Premium Branch
```bash
git checkout -b premium-features
```

### 3.3 Remove Author Files (Only Keep Premium)

You need to delete author-specific files so they're not in the premium branch:

```bash
# Remove author folder
rm -rf app/author

# Remove author navigation
rm components/shared/author-nav.tsx

# Remove earnings chart and revenue table (author-specific)
rm components/shared/earnings-chart.tsx
rm components/shared/revenue-table.tsx
rm components/shared/withdrawal-form.tsx

# Remove author-specific from root page
git checkout HEAD -- app/page.tsx
# Then update app/page.tsx to redirect to /premium instead of /author/dashboard
```

### 3.4 Update Root Page (app/page.tsx)

Edit `app/page.tsx` to redirect to premium instead of author:

```typescript
import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/premium');
}
```

### 3.5 Add and Commit
```bash
git add .
git commit -m "Add premium subscription feature

- Premium page with 3 pricing tiers (Free, Creator, Premium Plus)
- Monthly/Yearly billing toggle
- Feature comparison matrix
- FAQ section
- Chapa payment integration ready
- Completely standalone, no author dependencies
- Beautiful green & gold color scheme"
```

### 3.6 Push to GitHub
```bash
git push -u origin premium-features
```

**Result:** Your premium features will be on the `premium-features` branch

---

## Step 4: Verify Both Branches on GitHub

Go to your GitHub repository and check the branches:

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO`
2. Click the "Branches" button (usually shows number of branches)
3. You should see:
   - `author-features` - Contains author dashboard & monetization
   - `premium-features` - Contains premium subscription page

---

## What Files Are in Each Branch?

### Author Features Branch (`author-features`)
```
✓ app/author/
  - dashboard/page.tsx
  - monetization/page.tsx
  - layout.tsx
✓ app/layout.tsx
✓ app/page.tsx (redirects to /author/dashboard)
✓ components/shared/
  - author-nav.tsx
  - stat-card.tsx
  - earnings-chart.tsx
  - revenue-table.tsx
  - withdrawal-form.tsx
✓ lib/mock-data.ts
✓ All global styles (globals.css)
```

### Premium Features Branch (`premium-features`)
```
✓ app/premium/
  - page.tsx
  - layout.tsx
✓ app/layout.tsx
✓ app/page.tsx (redirects to /premium)
✓ components/shared/
  - premium-nav.tsx
  - pricing-card.tsx
  - stat-card.tsx
✓ lib/mock-data.ts
✓ All global styles (globals.css)
```

---

## Switching Between Branches Locally

```bash
# Switch to author branch
git checkout author-features

# Switch to premium branch
git checkout premium-features

# See which branch you're on
git branch

# Switch to main/master
git checkout main
```

---

## Merging Branches Later

When you're ready to merge both features together:

```bash
# Switch to main
git checkout main

# Merge author features
git merge author-features

# Merge premium features
git merge premium-features

# Push to main
git push origin main
```

---

## Troubleshooting

### "fatal: your current branch and origin/master have diverged"
```bash
git pull origin author-features
```

### "Permission denied (publickey)"
You need to set up SSH keys. Run:
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

### "error: pathspec 'main' did not match any files"
Use `master` instead of `main`:
```bash
git checkout master
```

### Want to Delete a Branch?
```bash
# Delete locally
git branch -d branch-name

# Delete on GitHub
git push origin --delete branch-name
```

---

## Summary

```
AUTHOR FEATURES PUSH:
git checkout -b author-features
git add .
git commit -m "Add author dashboard and monetization features"
git push -u origin author-features

PREMIUM FEATURES PUSH:
git checkout main/master
git checkout -b premium-features
rm -rf app/author && rm components/shared/author-nav.tsx
[Update app/page.tsx to redirect to /premium]
git add .
git commit -m "Add premium subscription feature"
git push -u origin premium-features
```

Done! Both features are now pushed separately to GitHub.
