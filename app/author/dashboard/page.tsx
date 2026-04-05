'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { EarningsChart } from '@/components/shared/earnings-chart';
import { RevenueTable } from '@/components/shared/revenue-table';
import {
  BookOpen,
  DollarSign,
  Eye,
  TrendingUp,
  Users,
} from 'lucide-react';
import { mockAuthor, mockStories, mockEarningHistory } from '@/lib/mock-data';

export default function AuthorDashboard() {
  // Top performing stories
  const topStories = mockStories
    .filter((s) => s.status === 'published')
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  // Recent stories
  const recentStories = mockStories.sort((a, b) => {
    const dateA = a.publishedAt || a.createdAt;
    const dateB = b.publishedAt || b.createdAt;
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-background via-background to-secondary/10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Welcome back, {mockAuthor.name}!</h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Here&apos;s an overview of your writing journey on InkLink
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Stories"
          value={mockAuthor.totalStories}
          icon={BookOpen}
          trend={{ value: 1, isPositive: true }}
          description="2 drafts, 6 published"
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
        />
        <StatCard
          label="Total Views"
          value={mockAuthor.totalViews.toLocaleString()}
          icon={Eye}
          trend={{ value: 12, isPositive: true }}
          variant="success"
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
        />
        <StatCard
          label="Total Earnings"
          value={`₦${mockAuthor.totalEarnings.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 18, isPositive: true }}
          variant="success"
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
        />
        <StatCard
          label="Active Followers"
          value={mockAuthor.totalFollowers}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          description="Growing monthly"
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Earnings Chart */}
        <div className="lg:col-span-2">
          <EarningsChart
            data={mockEarningHistory}
            title="Monthly Earnings"
            description="Your revenue over the last 12 months"
            type="bar"
            height={300}
          />
        </div>
        

      </div>

      {/* All Stories Table */}
      <div className="mt-8">
        <RevenueTable
          items={recentStories.map((story) => ({
            id: story.id,
            title: story.title,
            views: story.views,
            premiumReaders: story.premiumReaders,
            revenue: story.revenue,
            status: story.status,
          }))}
          title="Your Stories"
          description="All your published and draft stories"
        />
      </div>

      {/* Top Performing Stories */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top Performing Stories
          </CardTitle>
          <CardDescription>Your best performing stories this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topStories.map((story, index) => (
              <div
                key={story.id}
                className="flex items-start justify-between border-b border-border pb-4 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{story.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {story.views.toLocaleString()} views • {story.likes.toLocaleString()} likes
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₦{story.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
