'use client';

import { Users, BookOpen, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Users',
      value: '12,543',
      description: 'Active users on platform',
      icon: Users,
      color: 'from-pink-500 to-red-500',
      href: '/admin/users',
    },
    {
      title: 'Authors',
      value: '3,291',
      description: 'Registered authors',
      icon: BookOpen,
      color: 'from-red-500 to-pink-600',
      href: '/admin/authors',
    },
    {
      title: 'Content',
      value: '45,672',
      description: 'Published pieces',
      icon: Zap,
      color: 'from-pink-600 to-red-600',
      href: '/admin/content',
    },
    {
      title: 'Premium Subscription',
      value: '2,847',
      description: 'Active premium members',
      icon: Crown,
      color: 'from-red-600 to-pink-500',
      href: '/admin/premium',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">i</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground">InkLink</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Admin Dashboard
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, Admin</h2>
          <p className="text-muted-foreground text-base">
            Here&apos;s an overview of your InkLink platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="block rounded-2xl border border-border bg-card p-6 hover:border-accent/70 hover:bg-secondary transition-colors cursor-pointer"
              >
                {/* Content */}
                <div>
                  {/* Icon */}
                  <div className="mb-4 flex items-center">
                    <div
                      className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 text-white`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {stat.title}
                  </h3>

                  {/* Value */}
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-muted-foreground text-sm mb-1">Platform Health</p>
              <p className="text-2xl font-bold text-foreground">98.5%</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-muted-foreground text-sm mb-1">Last Updated</p>
              <p className="text-2xl font-bold text-foreground">Live</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <p className="text-muted-foreground text-sm mb-1">Server Status</p>
              <p className="text-2xl font-bold text-accent">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
