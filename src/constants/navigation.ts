
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, CalendarDays, Brain, FileText, UserCircle, Settings, ShieldCheck, LogOut } from 'lucide-react';
import type { UserRole } from '@/types';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group?: string;
  roles?: UserRole[]; 
  isFooter?: boolean; 
}

const allNavItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Panel Principal',
    icon: LayoutDashboard,
  },
  {
    href: '/patients',
    label: 'Pacientes',
    icon: Users,
    roles: ['DOCTOR', 'ADMIN'],
  },
  {
    href: '/appointments',
    label: 'Citas',
    icon: CalendarDays,
    roles: ['DOCTOR', 'PATIENT', 'ADMIN'], 
  },
  {
    href: '/my-appointments', 
    label: 'Mis Citas',
    icon: CalendarDays,
    roles: ['PATIENT'],
  },
  {
    href: '/my-medical-records',
    label: 'Mi Historial Médico',
    icon: FileText,
    roles: ['PATIENT'],
  },
  {
    href: '/ai-diagnosis',
    label: 'Diagnóstico IA',
    icon: Brain,
    roles: ['DOCTOR', 'ADMIN'],
  },
  {
    href: '/admin/users',
    label: 'Gestión de Usuarios',
    icon: Users,
    roles: ['DOCTOR','ADMIN'], // DOCTOR also has this privilege now
  },
  {
    href: '/admin/settings',
    label: 'Configuración Sistema',
    icon: Settings, 
    roles: ['DOCTOR','ADMIN'], // DOCTOR also has this privilege now
  },
  {
    href: '/admin/logs',
    label: 'Registros de Auditoría',
    icon: FileText, 
    roles: ['DOCTOR','ADMIN'], // DOCTOR also has this privilege now
  },
];


export const getNavItems = (userRole?: UserRole): NavItem[] => {
  if (!userRole) { 
    return allNavItems.filter(item => (!item.roles || item.roles.length === 0) && !item.isFooter);
  }
  return allNavItems.filter(item => {
    if (item.isFooter) return false; 
    if (!item.roles) return true; 
    return item.roles.includes(userRole);
  });
};

export const navItems: NavItem[] = allNavItems;
