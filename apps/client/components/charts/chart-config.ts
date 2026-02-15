'use client';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const CHART_COLORS = {
  primary: 'rgb(99, 102, 241)',
  primaryLight: 'rgba(99, 102, 241, 0.5)',
  secondary: 'rgb(34, 197, 94)',
  secondaryLight: 'rgba(34, 197, 94, 0.5)',
  warning: 'rgb(234, 179, 8)',
  warningLight: 'rgba(234, 179, 8, 0.5)',
  danger: 'rgb(239, 68, 68)',
  dangerLight: 'rgba(239, 68, 68, 0.5)',
  info: 'rgb(59, 130, 246)',
  infoLight: 'rgba(59, 130, 246, 0.5)',
  purple: 'rgb(168, 85, 247)',
  purpleLight: 'rgba(168, 85, 247, 0.5)',
  pink: 'rgb(236, 72, 153)',
  pinkLight: 'rgba(236, 72, 153, 0.5)',
  teal: 'rgb(20, 184, 166)',
  tealLight: 'rgba(20, 184, 166, 0.5)',
  orange: 'rgb(249, 115, 22)',
  orangeLight: 'rgba(249, 115, 22, 0.5)',
};

export const CATEGORY_COLORS = [
  'rgb(99, 102, 241)',
  'rgb(34, 197, 94)',
  'rgb(234, 179, 8)',
  'rgb(239, 68, 68)',
  'rgb(59, 130, 246)',
  'rgb(168, 85, 247)',
  'rgb(236, 72, 153)',
  'rgb(20, 184, 166)',
  'rgb(249, 115, 22)',
  'rgb(156, 163, 175)',
];

export const CATEGORY_COLORS_LIGHT = CATEGORY_COLORS.map((c) =>
  c.replace('rgb', 'rgba').replace(')', ', 0.6)')
);

export const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};
