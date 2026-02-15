'use client';

import { useWeeklyComparison } from '@/hooks';
import { formatCurrency } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';

export function WeeklyComparisonCard() {
  const { data, isLoading } = useWeeklyComparison();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-30 w-full' />
        </CardContent>
      </Card>
    );
  }

  const isPositiveGrowth = (data?.growth ?? 0) >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Weekly Comparison
          {isPositiveGrowth ? (
            <TrendingUp className='h-5 w-5 text-green-500' />
          ) : (
            <TrendingDown className='h-5 w-5 text-red-500' />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-3 gap-4 text-center'>
          <div>
            <p className='text-muted-foreground text-sm'>Last Week</p>
            <p className='text-2xl font-bold'>
              {formatCurrency(data?.lastWeek.revenue ?? 0)}
            </p>
            <p className='text-muted-foreground text-sm'>
              {data?.lastWeek.orders ?? 0} orders
            </p>
          </div>
          <div className='flex items-center justify-center'>
            <ArrowRight className='text-muted-foreground h-8 w-8' />
          </div>
          <div>
            <p className='text-muted-foreground text-sm'>This Week</p>
            <p className='text-2xl font-bold'>
              {formatCurrency(data?.thisWeek.revenue ?? 0)}
            </p>
            <p className='text-muted-foreground text-sm'>
              {data?.thisWeek.orders ?? 0} orders
            </p>
          </div>
        </div>
        <div className='mt-4 border-t pt-4 text-center'>
          <p
            className={`text-2xl font-bold ${
              isPositiveGrowth ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isPositiveGrowth ? '+' : ''}
            {data?.growth ?? 0}%
          </p>
          <p className='text-muted-foreground text-sm'>
            Revenue {isPositiveGrowth ? 'increase' : 'decrease'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
