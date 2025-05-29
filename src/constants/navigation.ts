
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, CalendarDays, Brain, FileText, UserCircle, Settings, ShieldCheck, LogOut } from 'lucide-react';
import type { UserRole } from '@/types';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string;
  roles?: UserRole[]; 
  isFooter?: boolean; // To distinguish footer items like logout
}

const allNavItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/patients',
    label: 'Patients',
    icon: Users,
    roles: ['DOCTOR', 'ADMIN'],
  },
  {
    href: '/appointments',
    label: 'Appointments',
    icon: CalendarDays,
    roles: ['DOCTOR', 'PATIENT', 'ADMIN'], // Allow Admin to see all appointments too
  },
  {
    href: '/my-appointments', 
    label: 'My Appointments',
    icon: CalendarDays,
    roles: ['PATIENT'],
  },
  {
    href: '/my-medical-records',
    label: 'My Medical Records',
    icon: FileText,
    roles: ['PATIENT'],
  },
  {
    href: '/ai-diagnosis',
    label: 'AI Diagnosis',
    icon: Brain,
    roles: ['DOCTOR', 'ADMIN'],
  },
  // Admin specific routes
  {
    href: '/admin/users',
    label: 'User Management',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    href: '/admin/settings',
    label: 'System Settings',
    icon: Settings, // Using generic settings icon for now
    roles: ['ADMIN'],
  },
  {
    href: '/admin/logs',
    label: 'Audit Logs',
    icon: FileText, // Using generic file text icon for now
    roles: ['ADMIN'],
  },
  // Example for a Profile link, could be visible to all logged-in users
  // {
  //   href: '/profile',
  //   label: 'Profile',
  //   icon: UserCircle,
  //   roles: ['DOCTOR', 'PATIENT', 'ADMIN'], 
  // },
  // {
  //   href: '/login', // Changed from /logout to /login as per sidebar implementation
  //   label: 'Cerrar Sesión',
  //   icon: LogOut,
  //   isFooter: true, // Mark as a footer item
  //   // Visible to all authenticated roles
  //   roles: ['DOCTOR', 'PATIENT', 'ADMIN'],
  // },
];


export const getNavItems = (userRole?: UserRole): NavItem[] => {
  if (!userRole) { 
    return allNavItems.filter(item => (!item.roles || item.roles.length === 0) && !item.isFooter);
  }
  return allNavItems.filter(item => {
    if (item.isFooter) return false; // Footer items handled separately
    if (!item.roles) return true; 
    return item.roles.includes(userRole);
  });
};

export const navItems: NavItem[] = allNavItems;
