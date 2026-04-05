'use client';

import { AuthorNav } from '@/components/shared/author-nav';

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AuthorNav />
      <main className="overflow-auto">
        {children}
      </main>
    </div>
  );
}
