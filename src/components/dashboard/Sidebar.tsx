"use client";

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  name: string;
  href: string;
  permission: string;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    permission: 'dashboard.view' 
  },
  { 
    name: 'Orders', 
    href: '/dashboard/orders', 
    permission: 'orders.view',
    badge: '5',
    children: [
      { name: 'Active Orders', href: '/dashboard/orders', permission: 'orders.view' },
      { name: 'POS System', href: '/dashboard/pos', permission: 'orders.manage' },
      { name: 'Order History', href: '/dashboard/orders/history', permission: 'orders.view' },
    ]
  },
  { 
    name: 'Tables', 
    href: '/dashboard/tables', 
    permission: 'tables.view',
    children: [
      { name: 'Floor Plan', href: '/dashboard/tables', permission: 'tables.view' },
      { name: 'Reservations', href: '/dashboard/reservations', permission: 'reservations.view' },
    ]
  },
  { 
    name: 'Menu', 
    href: '/dashboard/menu', 
    permission: 'menu.view',
    children: [
      { name: 'Menu Items', href: '/dashboard/menu/items', permission: 'menu.view' },
      { name: 'Categories', href: '/dashboard/menu/categories', permission: 'menu.manage' },
      { name: 'Pricing', href: '/dashboard/menu/pricing', permission: 'menu.manage' },
    ]
  },
  { 
    name: 'Staff', 
    href: '/dashboard/staff', 
    permission: 'staff.view',
    children: [
      { name: 'Employees', href: '/dashboard/staff', permission: 'staff.view' },
      { name: 'Schedules', href: '/dashboard/schedules', permission: 'staff.manage' },
      { name: 'Performance', href: '/dashboard/staff/performance', permission: 'staff.view' },
    ]
  },
  { 
    name: 'Inventory', 
    href: '/dashboard/inventory', 
    permission: 'inventory.view',
    badge: '3',
    children: [
      { name: 'Stock Levels', href: '/dashboard/inventory', permission: 'inventory.view' },
      { name: 'Suppliers', href: '/dashboard/inventory/suppliers', permission: 'inventory.manage' },
      { name: 'Cost Analysis', href: '/dashboard/inventory/costs', permission: 'inventory.view' },
    ]
  },
  { 
    name: 'Analytics', 
    href: '/dashboard/analytics', 
    permission: 'analytics.view',
    children: [
      { name: 'Overview', href: '/dashboard/analytics', permission: 'analytics.view' },
      { name: 'Sales Reports', href: '/dashboard/reports', permission: 'reports.view' },
      { name: 'Performance', href: '/dashboard/analytics/performance', permission: 'analytics.view' },
    ]
  },
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    permission: 'settings.manage' 
  },
];

export function Sidebar() {
  const { user, hasPermission, logout } = useAuth();
  const pathname = usePathname();

  const filteredNavigation = navigation.filter(item => 
    hasPermission(item.permission)
  );

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-gray-900">RestaurantOS</h1>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? 'bg-gray-50 text-primary'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium items-center'
                      )}
                    >
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                    
                    {item.children && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.children
                          .filter(child => hasPermission(child.permission))
                          .map((child) => (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className={cn(
                                  pathname === child.href
                                    ? 'bg-gray-50 text-primary'
                                    : 'text-gray-500 hover:text-primary hover:bg-gray-50',
                                  'group flex gap-x-3 rounded-md p-2 pl-6 text-xs leading-5 font-medium'
                                )}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </li>
            
            <li className="mt-auto">
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-medium text-gray-900">
                  <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-gray-900">{user?.name}</p>
                    <p className="truncate text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="group flex w-full items-center gap-x-3 rounded-md px-2 py-2 text-sm leading-6 font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  Sign out
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}