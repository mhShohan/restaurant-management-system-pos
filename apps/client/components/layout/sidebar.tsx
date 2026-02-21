'use client';

import { clearAccessToken } from '@/app/actions';
import { UserRole } from '@/lib/types';
import { useAuthStore, useUIStore } from '@/stores';

import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';
import {
  ChartNoAxesCombinedIcon,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  Table,
  Users,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems: {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    roles: [
      UserRole.ADMIN,
      UserRole.CASHIER,
      UserRole.WAITER,
      UserRole.KITCHEN,
    ],
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: ChartNoAxesCombinedIcon,
    roles: [
      UserRole.ADMIN,
      UserRole.CASHIER,
      UserRole.WAITER,
      UserRole.KITCHEN,
    ],
  },
  {
    label: 'Orders',
    path: '/orders',
    icon: ClipboardList,
    roles: [
      UserRole.ADMIN,
      UserRole.CASHIER,
      UserRole.WAITER,
      UserRole.KITCHEN,
    ],
  },
  {
    label: 'Menu',
    path: '/menu',
    icon: Utensils,
    roles: [UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER],
  },
  {
    label: 'Tables',
    path: '/tables',
    icon: Table,
    roles: [UserRole.ADMIN, UserRole.WAITER],
  },
  {
    label: 'Payments',
    path: '/payments',
    icon: Receipt,
    roles: [UserRole.ADMIN, UserRole.CASHIER],
  },
  { label: 'Users', path: '/users', icon: Users, roles: [UserRole.ADMIN] },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    roles: [UserRole.ADMIN],
  },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await clearAccessToken();
    logout();
    router.push('/login');
  };

  const filtered = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <aside
      className={cn(
        'bg-sidebar border-sidebar-border fixed left-0 top-0 z-40 h-screen border-r shadow-sm transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className='flex h-full flex-col'>
        <div className='border-sidebar-border flex h-16 items-center justify-between border-b px-3'>
          {sidebarOpen && (
            <span className='text-sidebar-foreground text-base font-semibold tracking-tight'>
              Restaurant POS
            </span>
          )}
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleSidebar}
            className='text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ml-auto h-8 w-8'
          >
            {sidebarOpen ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </Button>
        </div>
        <ScrollArea className='flex-1 py-3'>
          <nav className='space-y-0.5 px-2'>
            {filtered.map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path !== '/' && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    !sidebarOpen && 'justify-center px-0'
                  )}
                >
                  <item.icon size={20} className='shrink-0' />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <div className='border-sidebar-border border-t p-3'>
          {sidebarOpen && user && (
            <div className='mb-3 px-2'>
              <p className='text-sidebar-foreground text-sm font-medium'>
                {user.name}
              </p>
              <p className='text-sidebar-foreground/60 text-xs capitalize'>
                {user.role}
              </p>
            </div>
          )}
          <Button
            variant='ghost'
            size='sm'
            className={cn(
              'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-destructive w-full justify-start',
              !sidebarOpen && 'justify-center px-0'
            )}
            onClick={handleLogout}
          >
            <LogOut size={18} className={cn(sidebarOpen && 'mr-2')} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
