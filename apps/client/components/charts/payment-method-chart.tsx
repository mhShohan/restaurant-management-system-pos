'use client';

import { useRevenueByPaymentMethod } from '@/hooks';
import { formatCurrency } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import type { ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import { CHART_COLORS } from './chart-config';
import './chart-config';

const METHOD_COLORS: Record<string, string> = {
  cash: CHART_COLORS.secondary,
  card: CHART_COLORS.primary,
  upi: CHART_COLORS.purple,
};

const METHOD_COLORS_LIGHT: Record<string, string> = {
  cash: CHART_COLORS.secondaryLight,
  card: CHART_COLORS.primaryLight,
  upi: CHART_COLORS.purpleLight,
};

export function PaymentMethodChart() {
  const { data, isLoading } = useRevenueByPaymentMethod();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-75 w-full' />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data?.map((d) => d.method.toUpperCase()) ?? [],
    datasets: [
      {
        data: data?.map((d) => d.revenue) ?? [],
        backgroundColor:
          data?.map(
            (d) => METHOD_COLORS_LIGHT[d.method] ?? CHART_COLORS.infoLight
          ) ?? [],
        borderColor:
          data?.map((d) => METHOD_COLORS[d.method] ?? CHART_COLORS.info) ?? [],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
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
            const dataArr = context.dataset.data as number[];
            const total = dataArr.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-75 flex items-center justify-center'>
          {data && data.length > 0 ? (
            <Pie data={chartData} options={options} />
          ) : (
            <p className='text-muted-foreground'>No data available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
