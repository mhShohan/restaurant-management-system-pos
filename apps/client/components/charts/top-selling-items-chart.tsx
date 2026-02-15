'use client';

import { useTopSellingItems } from '@/hooks';
import { formatCurrency } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import type { ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { CHART_COLORS } from './chart-config';
import './chart-config';

interface TopSellingItemsChartProps {
  limit?: number;
}

export function TopSellingItemsChart({
  limit = 10,
}: TopSellingItemsChartProps) {
  const { data, isLoading } = useTopSellingItems(limit);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-75 w-full' />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data?.map((d) => d.itemName) ?? [],
    datasets: [
      {
        label: 'Quantity Sold',
        data: data?.map((d) => d.quantitySold) ?? [],
        backgroundColor: CHART_COLORS.primaryLight,
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          afterLabel: function (context) {
            const item = data?.[context.dataIndex];
            if (item) {
              return `Revenue: ${formatCurrency(item.revenue)}\nCategory: ${item.category}`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity Sold',
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-100'>
          {data && data.length > 0 ? (
            <Bar data={chartData} options={options} />
          ) : (
            <div className='flex h-full items-center justify-center'>
              <p className='text-muted-foreground'>No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
