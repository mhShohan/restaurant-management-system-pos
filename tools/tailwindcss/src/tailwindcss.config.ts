import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import { fontFamily } from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

function withOpacityValue(variable: string) {
  return ({ opacityValue }: { opacityValue?: number }) => {
    if (opacityValue === undefined) {
      return `hsl(var(${variable}))`;
    }
    return `hsl(var(${variable}) / ${opacityValue})`;
  };
}
const config: Config = {
  content: [
    'app/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'providers/**/*.{js,jsx,ts,tsx}',
    'layout/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    {
      pattern: /^ql-/, // Matches all classes that start with 'ql-'
    },
  ],
  darkMode: ['class', 'class'],
  theme: {
    screens: {
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '992px',
      xl: '1201px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      colors: {
        'primary-bg': withOpacityValue('--primary-bg') as any,
        'secondary-bg': withOpacityValue('--secondary-bg') as any,
        'secondary-100': '#CAF4F8',
        'secondary-200': '#80E5ED',
        'secondary-300': '#4FDAE7',
        'secondary-400': '#19C5D5',
        'secondary-500': '#18A1AD',
        'secondary-600': '#127780',
        'secondary-700': '#096169',
        'secondary-800': '#0C4D53',
        'secondary-900': '#0E454A',
        'primary-100': '#E0FFEE',
        'primary-200': '#B5FFE1',
        'primary-300': '#79F7C3',
        'primary-400': '#15EDA3',
        'primary-500': '#27D09B',
        'primary-600': '#0FC083',
        'primary-700': '#1EA178',
        'primary-800': '#157255',
        'primary-900': '#0C4231',
        'warning-100': '#FEF9E8',
        'warning-200': '#FEE28A',
        'warning-300': '#FDD147',
        'warning-400': '#fac215',
        'warning-500': '#eab308',
        'warning-600': '#ca9a04',
        'warning-700': '#a17c07',
        'warning-800': '#85680e',
        'warning-900': '#423306',
        'danger-100': '#fef2f2',
        'danger-200': '#fecaca',
        'danger-300': '#fca5a5',
        'danger-400': '#f87171',
        'danger-500': '#ef4444',
        'danger-600': '#dc2626',
        'danger-700': '#b91c1c',
        'danger-800': '#7f1d1d',
        'danger-900': '#450a0a',
        'gray-100': '#f1f5f9',
        'gray-200': '#e2e8f0',
        'gray-300': '#cbd5e1',
        'gray-400': '#94a3b8',
        'success-100': '#f0fdf5',
        'success-500': '#22C55E',
        'success-900': '#052E14',
        'black-2': 'var(--black-2)',
        'black-3': 'var(--black-3)',
        'white-2': 'var(--white-2)',
        'white-3': 'var(--white-3)',
        'base-bg': withOpacityValue('--base-bg') as any,
        '--primary-bg': '0, 0% 100%',
        'primary-focus': '#27D09B',
        'primary-content': '#FFFFFF',
        '--secondary-bg': '225, 40% 96%',
        'secondary-focus': '#0FC083',
        'secondary-content': '#000000',
        'accent-focus': '#0E454A',
        'accent-content': '#ffffff',
        neutral: '#0FC083',
        'neutral-focus': '#0FC083',
        'neutral-content': '#000000',
        'base-100': '#e7f9f3',
        '--base-bg': '#F8F9FC',
        'base-200': '#e7f9f3',
        'base-300': '#e7f9f3',
        'base-content': '#000000',
        '--black-2': '#3A3A3A',
        '--black-3': '#707070',
        '--white-2': 'hsla(0, 100%, 100%, 0.75)',
        '--white-3': 'hsla(0, 100%, 100%, 0.6)',
        info: '#3ABFF8',
        success: '#2ECC71',
        warning: '#FFB800',
        error: '#E74C3C',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': {
            opacity: '1',
          },
          '20%,50%': {
            opacity: '0',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.wrap-anywhere': {
          overflowWrap: 'anywhere',
        },
      });
    }),
  ],
} satisfies Config;

export default config;
