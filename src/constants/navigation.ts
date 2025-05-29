import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, CalendarDays, Brain, FileScan } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string; // Optional grouping for sidebar sections
}

export const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/patients',
    label: 'Patients',
    icon: Users,
  },
  {
    href: '/appointments',
    label: 'Appointments',
    icon: CalendarDays,
  },
  {
    href: '/ai-diagnosis',
    label: 'AI Diagnosis',
    icon: Brain,
  },
  // Example of how DICOM studies could be a top-level item if needed,
  // but it's more likely accessed via patient records.
  // {
  //   href: '/dicom-studies',
  //   label: 'DICOM Studies',
  //   icon: FileScan,
  // },
];
