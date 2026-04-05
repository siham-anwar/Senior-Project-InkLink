'use client';

import { PremiumNav } from '@/components/shared/premium-nav';

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PremiumNav />
      <main>{children}</main>
    </div>
  );
}
