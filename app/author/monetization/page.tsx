'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { EarningsChart } from '@/components/shared/earnings-chart';
import { RevenueTable } from '@/components/shared/revenue-table';
import { WithdrawalForm } from '@/components/shared/withdrawal-form';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Wallet,
  AlertCircle,
  Settings2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockAuthor, mockStories, mockEarningHistory, mockTransactions } from '@/lib/mock-data';

export default function MonetizationPage() {
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);

  // Filter published premium stories for revenue breakdown
  const publishedStories = mockStories
    .filter((s) => s.status === 'published' && s.isPremium)
    .map((s) => ({
      id: s.id,
      title: s.title,
      views: s.views,
      premiumReaders: s.premiumReaders,
      revenue: s.revenue,
      status: s.status,
    }));

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-background via-background to-secondary/10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Monetization & Earnings</h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Track your revenue and manage your earnings
        </p>
      </div>

      {/* Earnings Overview Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Lifetime Earnings"
          value={`₦${mockAuthor.totalEarnings.toLocaleString()}`}
          icon={DollarSign}
          description="All-time earnings"
          variant="success"
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
        />
        <StatCard
          label="Current Month"
          value={`₦${mockAuthor.currentMonthEarnings.toLocaleString()}`}
          icon={TrendingUp}
          description="April 2024"
          variant="success"
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
        />
        <StatCard
          label="Pending Balance"
          value={`₦${mockAuthor.pendingBalance.toLocaleString()}`}
          icon={AlertCircle}
          description="Processing..."
          variant="warning"
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
        />
        <StatCard
          label="Available for Withdrawal"
          value={`₦${mockAuthor.availableForWithdrawal.toLocaleString()}`}
          icon={Wallet}
          description="Ready to withdraw"
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Earnings Chart */}
        <div className="lg:col-span-2">
          <EarningsChart
            data={mockEarningHistory}
            title="Earnings Trend (12 Months)"
            description="Your monthly revenue progression"
            type="bar"
            height={350}
          />
        </div>

        {/* Payment Method Card */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-card to-card/50">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
            <CardDescription>Connected account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Chapa Payment</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Secure payment processing
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Account: ***8392
                  </p>
                </div>
              </div>
            </div>

            <Alert className="border-primary/30 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs text-foreground">
                Withdrawals are processed within 3-5 business days
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => setIsWithdrawalOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 shadow-sm"
              size="lg"
              disabled={mockAuthor.availableForWithdrawal === 0}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Request Withdrawal
            </Button>

            <Button variant="outline" className="w-full hover:bg-primary/5 hover:text-primary transition-colors">
              <Settings2 className="mr-2 h-4 w-4" />
              Change Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown by Story */}
      <div className="mt-8">
        <RevenueTable
          items={publishedStories}
          title="Revenue Breakdown by Story"
          description="Detailed earnings for each published premium story"
        />
      </div>

      {/* Payment History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Your recent payouts and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      ₦{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.method}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === 'completed'
                            ? 'default'
                            : transaction.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {mockTransactions.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <p>No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Form Modal */}
      <WithdrawalForm
        isOpen={isWithdrawalOpen}
        onClose={() => setIsWithdrawalOpen(false)}
        availableBalance={mockAuthor.availableForWithdrawal}
        pendingBalance={mockAuthor.pendingBalance}
      />

      {/* Info Section */}
      <Card className="mt-8 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">How Monetization Works</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-900 dark:text-blue-100 space-y-3">
          <p className="text-sm">
            <strong>Premium Stories:</strong> When you publish a story as premium, readers can purchase access for ₦99/month or ₦990/year.
          </p>
          <p className="text-sm">
            <strong>Revenue Share:</strong> InkLink takes 30% commission, you receive 70% of premium subscription revenue.
          </p>
          <p className="text-sm">
            <strong>Minimum Withdrawal:</strong> You can request a withdrawal once your balance reaches ₦1,000.
          </p>
          <p className="text-sm">
            <strong>Processing Time:</strong> Withdrawals are processed within 3-5 business days via Chapa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
