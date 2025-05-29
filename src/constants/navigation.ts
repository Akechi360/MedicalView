
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, CalendarDays, Brain, FileText, UserCircle, Settings } from 'lucide-react';
import type { UserRole } from '@/types';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string;
  roles?: UserRole[]; // Which roles can see this item. If undefined, all roles.
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
    label: 'Appointments', // For doctors, it's all appointments. For patients, it would be filtered.
    icon: CalendarDays,
  },
  // Patient specific navigation items (can be shown/hidden based on role)
  {
    href: '/my-appointments', // Example: could be same as /appointments but filtered
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
  // {
  //   href: '/profile',
  //   label: 'Profile',
  //   icon: UserCircle,
  // },
  // {
  //   href: '/settings',
  //   label: 'Settings',
  //   icon: Settings,
  // },
];


// Function to get navigation items based on user role
// In a real app, userRole would come from auth context
export const getNavItems = (userRole?: UserRole): NavItem[] => {
  if (!userRole) { // If no role (e.g. not logged in, or role not determined), show minimal/public items
    return allNavItems.filter(item => !item.roles || item.roles.length === 0);
  }
  return allNavItems.filter(item => {
    if (!item.roles) return true; // No specific role restriction
    return item.roles.includes(userRole);
  });
};

// Default export for general use, or for when role isn't critical yet (e.g. initial load)
// You'd typically call getNavItems(currentUser.role) in your AppSidebar
export const navItems: NavItem[] = allNavItems;
