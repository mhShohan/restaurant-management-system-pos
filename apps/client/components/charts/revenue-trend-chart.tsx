'use client';

import { useRevenueTrend } from '@/hooks';
import { formatCurrency } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { CHART_COLORS } from './chart-config';
import './chart-config';

// Register Chart.js

interface RevenueTrendChartProps {
  days?: number;
  title?: string;
}

export function RevenueTrendChart({
  days = 7,
  title = 'Revenue Trend',
}: RevenueTrendChartProps) {
  const { data, isLoading } = useRevenueTrend(days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className='h-75 w-full' />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels:
      data?.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }) ?? [],
    datasets: [
      {
        label: 'Revenue',
        data: data?.map((d) => d.revenue) ?? [],
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.primaryLight,
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: data?.map((d) => d.orders) ?? [],
        borderColor: CHART_COLORS.secondary,
        backgroundColor: CHART_COLORS.secondaryLight,
        fill: false,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue',
        },
        ticks: {
          callback: function (value) {
            return formatCurrency(Number(value));
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Orders',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label ?? '';
            const value = context.parsed.y ?? 0;
            if (label === 'Revenue') {
              return `${label}: ${formatCurrency(value)}`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-75'>
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
