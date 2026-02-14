'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { useAuthStore, useUIStore } from '@/stores';

import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { cn } from '@workspace/ui/lib/utils';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/orders': 'Orders',
  '/menu': 'Menu Management',
  '/tables': 'Table Management',
  '/payments': 'Payments',
  '/users': 'User Management',
  '/settings': 'Settings',
  '/login': 'Login',
};

export function Header() {
  const { sidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Restaurant POS';

  return (
    <header
      className={cn(
        'bg-background/95 supports-[backdrop-filter]:bg-background/80 border-border fixed right-0 top-0 z-30 h-16 border-b backdrop-blur transition-all duration-300',
        sidebarOpen ? 'left-64' : 'left-16'
      )}
    >
      <div className='flex h-full items-center justify-between px-6'>
        <h1 className='text-foreground text-xl font-semibold tracking-tight md:text-2xl'>
          {title}
        </h1>
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          {user && (
            <div className='border-border flex items-center gap-2 border-l pl-2'>
              <Avatar className='h-8 w-8'>
                <AvatarFallback className='bg-primary/10 text-primary text-xs font-medium'>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className='text-foreground hidden text-sm font-medium sm:inline-block'>
                {user.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
