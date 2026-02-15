'use client';

import { useOrderStatsByStatus } from '@/hooks';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import type { ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { CHART_COLORS } from './chart-config';
import './chart-config';

const STATUS_COLORS: Record<string, string> = {
  pending: CHART_COLORS.warning,
  preparing: CHART_COLORS.info,
  ready: CHART_COLORS.secondary,
  served: CHART_COLORS.purple,
  completed: CHART_COLORS.primary,
  cancelled: CHART_COLORS.danger,
};

const STATUS_COLORS_LIGHT: Record<string, string> = {
  pending: CHART_COLORS.warningLight,
  preparing: CHART_COLORS.infoLight,
  ready: CHART_COLORS.secondaryLight,
  served: CHART_COLORS.purpleLight,
  completed: CHART_COLORS.primaryLight,
  cancelled: CHART_COLORS.dangerLight,
};

export function OrderStatusChart() {
  const { data, isLoading } = useOrderStatsByStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-75 w-full' />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels:
      data?.map((d) => d.status.charAt(0).toUpperCase() + d.status.slice(1)) ??
      [],
    datasets: [
      {
        data: data?.map((d) => d.count) ?? [],
        backgroundColor:
          data?.map(
            (d) => STATUS_COLORS_LIGHT[d.status] ?? CHART_COLORS.infoLight
          ) ?? [],
        borderColor:
          data?.map((d) => STATUS_COLORS[d.status] ?? CHART_COLORS.info) ?? [],
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
            const dataArr = context.dataset.data as number[];
            const total = dataArr.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} orders (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by Status</CardTitle>
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
