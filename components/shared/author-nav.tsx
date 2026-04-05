'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BarChart3, DollarSign, FileText, Settings } from 'lucide-react';

export function AuthorNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/author/dashboard',
      icon: BarChart3,
    },
    {
      label: 'Earnings',
      href: '/author/monetization',
      icon: DollarSign,
    },
    {
      label: 'Editor',
      href: '/author/editor',
      icon: FileText,
    },
    {
      label: 'Settings',
      href: '/author/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="border-b border-border/50 bg-card sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/author/dashboard" className="font-bold text-lg text-foreground">
            InkLink Author
          </Link>
          
          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`gap-2 ${isActive ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
