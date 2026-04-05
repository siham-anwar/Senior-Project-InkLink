'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function PremiumNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">InkLink Premium</h1>
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
