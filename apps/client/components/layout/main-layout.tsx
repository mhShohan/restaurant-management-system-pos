'use client';

import { useUIStore } from '@/stores';

import { cn } from '@workspace/ui/lib/utils';

import { Header } from './header';
import { Sidebar } from './sidebar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className='bg-background min-h-screen'>
      <Sidebar />
      <Header />
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          sidebarOpen ? 'pl-64' : 'pl-16'
        )}
      >
        <div className='p-6 lg:p-8'>{children}</div>
      </main>
    </div>
  );
}
