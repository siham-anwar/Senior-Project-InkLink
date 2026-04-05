'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface RevenueItem {
  id: string;
  title: string;
  views: number;
  premiumReaders: number;
  revenue: number;
  status: 'published' | 'draft';
}

interface RevenueTableProps {
  items: RevenueItem[];
  title?: string;
  description?: string;
}

type SortKey = 'views' | 'premiumReaders' | 'revenue' | 'title';
type SortDirection = 'asc' | 'desc';

export function RevenueTable({
  items,
  title = 'Story Revenue Breakdown',
  description = 'Earnings breakdown by story',
}: RevenueTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    const numA = Number(aValue);
    const numB = Number(bValue);
    return sortDirection === 'asc' ? numA - numB : numB - numA;
  });

  const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => {
    if (!active) return <div className="h-4 w-4" />;
    return direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary" />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-2">
                    Story Title
                    <SortIcon active={sortKey === 'title'} direction={sortDirection} />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort('views')}>
                  <div className="flex items-center justify-end gap-2">
                    Views
                    <SortIcon active={sortKey === 'views'} direction={sortDirection} />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort('premiumReaders')}>
                  <div className="flex items-center justify-end gap-2">
                    Premium Readers
                    <SortIcon active={sortKey === 'premiumReaders'} direction={sortDirection} />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort('revenue')}>
                  <div className="flex items-center justify-end gap-2">
                    Revenue
                    <SortIcon active={sortKey === 'revenue'} direction={sortDirection} />
                  </div>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-foreground">{item.title}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.premiumReaders.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    ₦{item.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {sortedItems.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            <p>No stories found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
