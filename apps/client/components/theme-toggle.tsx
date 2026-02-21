'use client';

import { Button } from '@workspace/ui/components/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        variant={'ghost'}
        className='cursor-pointer'
      >
        {resolvedTheme === 'dark' ? (
          <SunIcon className='h-4 w-4' />
        ) : (
          <MoonIcon className='h-4 w-4' />
        )}
        {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      variant={'ghost'}
      className='cursor-pointer'
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon className='h-4 w-4' />
      ) : (
        <MoonIcon className='h-4 w-4' />
      )}
      {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
    </Button>
  );
}
