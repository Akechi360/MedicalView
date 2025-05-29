
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNavItems, type NavItem } from '@/constants/navigation'; // Updated import
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


// This is a placeholder. In a real app, you'd get this from your auth context.
// Try changing it to 'PATIENT' to see the difference in navigation.
const currentUserRole: UserRole = 'DOCTOR'; 

export function AppSidebar() {
  const pathname = usePathname();
  const itemsToDisplay = getNavItems(currentUserRole); // Get items based on role

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
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-sidebar-foreground/70 text-center">
          &copy; {new Date().getFullYear()} MediView Hub
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
