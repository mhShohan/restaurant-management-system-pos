'use client';

import { useSalesByCategory } from '@/hooks';
import { formatCurrency } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import type { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { CATEGORY_COLORS, CATEGORY_COLORS_LIGHT } from './chart-config';
import './chart-config';

export function SalesByCategoryChart() {
  const { data, isLoading } = useSalesByCategory();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-75 w-full' />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data?.map((d) => d.category) ?? [],
    datasets: [
      {
        data: data?.map((d) => d.totalSales) ?? [],
        backgroundColor: CATEGORY_COLORS_LIGHT.slice(0, data?.length ?? 0),
        borderColor: CATEGORY_COLORS.slice(0, data?.length ?? 0),
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label ?? '';
            const value = context.parsed;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-75 flex items-center justify-center'>
          {data && data.length > 0 ? (
            <Doughnut data={chartData} options={options} />
          ) : (
            <p className='text-muted-foreground'>No data available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
