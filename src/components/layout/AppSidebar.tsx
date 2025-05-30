
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNavItems, type NavItem } from '@/constants/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import type { UserRole } from '@/types';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation'; 

const USER_ROLE_KEY = 'currentUserRole';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter(); 
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem(USER_ROLE_KEY) as UserRole | null;
      if (storedRole && ['DOCTOR', 'PATIENT', 'ADMIN'].includes(storedRole)) {
        setCurrentUserRole(storedRole);
      } else {
        setCurrentUserRole('PATIENT'); 
      }
    }
  }, []);


  const itemsToDisplay = getNavItems(currentUserRole);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_ROLE_KEY);
      localStorage.removeItem('currentUserData'); // Also remove user data
    }
    setCurrentUserRole(undefined); 
    router.push('/login');
  };

  if (currentUserRole === undefined && typeof window !== 'undefined') {
    if (pathname !== '/login' && pathname !== '/register') {
       // router.push('/login'); 
    }
  }


  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="p-2 bg-primary rounded-lg group-data-[collapsible=icon]:p-1.5">
            <Stethoscope className="h-6 w-6 text-primary-foreground group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
          </div>
          <span className="font-semibold text-lg text-primary group-data-[collapsible=icon]:hidden">
            MediView Hub
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto p-2">
        <SidebarMenu>
          {itemsToDisplay.map((item) => (
            !item.isFooter && ( 
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                    tooltip={item.label}
                    className="justify-start"
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Cerrar Sesión"
                className="justify-start w-full"
                >
                <LogOut className="h-5 w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        <p className="text-xs text-sidebar-foreground/70 text-center mt-2 group-data-[collapsible=icon]:hidden">
          &copy; {new Date().getFullYear()} MediView Hub
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
