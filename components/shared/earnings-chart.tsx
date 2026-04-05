'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EarningsChartProps {
  data: Array<{
    date: Date;
    amount: number;
  }>;
  title?: string;
  description?: string;
  type?: 'bar' | 'line';
  height?: number;
}

export function EarningsChart({
  data,
  title = 'Monthly Earnings',
  description = 'Your earnings over the last 12 months',
  type = 'bar',
  height = 300,
}: EarningsChartProps) {
  // Format data for Recharts
  const chartData = data.map((item) => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    earnings: item.amount,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {type === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value) => `₦${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="earnings" fill="hsl(var(--primary))" name="Earnings" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value) => `₦${value.toLocaleString()}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="hsl(var(--primary))"
                name="Earnings"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
