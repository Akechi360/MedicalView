
'use client'; 

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, Activity, Brain, FileText, HardDriveUpload, Eye, UserCheck, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import type { UserRole } from '@/types';
import { useRouter } from 'next/navigation';


const USER_ROLE_KEY = 'currentUserRole';
const USER_DATA_KEY = 'currentUserData';


export default function DashboardPage() {
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | undefined>(undefined);
  const [userName, setUserName] = useState<string>("User");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem(USER_ROLE_KEY) as UserRole | null;
      const storedUserData = localStorage.getItem(USER_DATA_KEY);
      
      let resolvedUserName = "User";
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          resolvedUserName = userData.name || userData.email || "User";
        } catch (e) {
          console.error("Failed to parse user data for dashboard:", e);
        }
      }

      if (storedRole && ['DOCTOR', 'PATIENT', 'ADMIN'].includes(storedRole)) {
        setCurrentUserRole(storedRole);
        if (storedRole === 'ADMIN') {
          setUserName(resolvedUserName === "User" ? "GodMode (Admin)" : resolvedUserName);
        } else {
          setUserName(resolvedUserName);
        }
      } else {
        // If no role, or invalid role, redirect to login.
        // This is a simple client-side redirect. Proper auth would use middleware.
        toast({
            title: 'Access Denied',
            description: 'Please log in to access the dashboard.',
            variant: 'destructive',
        });
        router.push('/login');
        return; // Stop further execution in this effect
      }
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-theme(space.32))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Welcome, {userName}!
        </h1>
        <p className="text-muted-foreground">
          {currentUserRole === 'DOCTOR' 
            ? "Here's an overview of your MediView Hub."
            : currentUserRole === 'ADMIN'
            ? "System administration panel."
            : "Manage your appointments and view your medical information."}
        </p>
      </header>

      {currentUserRole === 'ADMIN' && (
         <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="User Management"
              description="Manage all users (Doctors, Patients)."
              icon={<Users className="h-6 w-6 text-primary" />}
              value="0 Users" // Placeholder, ideally fetched data
              footerText="View All Users"
              link="/admin/users" 
            />
            <DashboardCard
              title="System Settings"
              description="Configure application settings."
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
              value="Config"
              footerText="Go to Settings"
              link="/admin/settings" 
            />
             <DashboardCard
              title="Audit Logs"
              description="View system activity logs."
              icon={<FileText className="h-6 w-6 text-primary" />}
              value="View Logs"
              footerText="Go to Logs"
              link="/admin/logs" 
            />
          </section>
      )}

      {currentUserRole === 'DOCTOR' && (
        <>
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Patients"
              description="Manage patient records and medical histories."
              icon={<Users className="h-6 w-6 text-primary" />}
              value="0" // Placeholder, ideally fetched data
              footerText="View All Patients"
              link="/patients"
            />
            <DashboardCard
              title="Appointments"
              description="View and schedule upcoming appointments."
              icon={<CalendarDays className="h-6 w-6 text-primary" />}
              value="0 Today" // Placeholder, ideally fetched data
              footerText="Go to Calendar"
              link="/appointments"
            />
            <DashboardCard
              title="AI Diagnosis"
              description="Utilize AI for diagnostic assistance."
              icon={<Brain className="h-6 w-6 text-primary" />}
              value="Ready"
              footerText="Start AI Diagnosis"
              link="/ai-diagnosis"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground/90">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <QuickActionCard
                title="New Patient"
                icon={<Users className="h-5 w-5" />}
                href="/patients/new"
              />
              <QuickActionCard
                title="New Appointment"
                icon={<CalendarDays className="h-5 w-5" />}
                href="/appointments#new" // Assuming your appointment page handles this hash
              />
              <QuickActionCard
                title="Upload DICOM"
                icon={<HardDriveUpload className="h-5 w-5" />}
                href="/patients" // Link to patients, then user can select patient to upload for
              />
              <QuickActionCard
                title="View Reports"
                icon={<FileText className="h-5 w-5" />}
                href="/patients" // Link to patients, then user can select patient
              />
            </div>
          </section>
        </>
      )}

      {currentUserRole === 'PATIENT' && (
         <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="My Appointments"
              description="View and manage your upcoming appointments."
              icon={<CalendarDays className="h-6 w-6 text-primary" />}
              value="0 Upcoming" // Placeholder, ideally fetched data
              footerText="Go to My Appointments"
              link="/my-appointments" // Ensure this route exists
            />
            <DashboardCard
              title="My Medical Record"
              description="Access your medical history and lab results."
              icon={<FileText className="h-6 w-6 text-primary" />}
              value="View"
              footerText="Access My Records"
              link="/my-medical-records" // Ensure this route exists
            />
            <DashboardCard
              title="Schedule New Appointment"
              description="Find a doctor and book a new consultation."
              icon={<UserCheck className="h-6 w-6 text-primary" />}
              value="Book Now"
              footerText="Schedule Appointment"
              link="/appointments#new" // Ensure this route exists and handles new appointment scheduling
            />
          </section>
      )}
      
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground/90">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No recent activity to display.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: string;
  footerText: string;
  link: string;
}

function DashboardCard({ title, description, icon, value, footerText, link }: DashboardCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
      </CardContent>
      <CardFooter>
        <Link href={link} className="w-full">
          <Button variant="outline" className="w-full">
            {footerText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

interface QuickActionCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
}

function QuickActionCard({ title, icon, href }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardContent className="p-4 flex flex-col items-center justify-center gap-2 aspect-square">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-1">
            {icon}
          </div>
          <p className="text-sm font-medium text-center text-foreground">{title}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

// Simple toast function to avoid importing full useToast if not already used
// In a real app, you'd likely have a global toast context or utility
const toast = (options: { title: string, description: string, variant?: 'destructive' | 'default' }) => {
    // This is a placeholder. In a real app, integrate with your toast system.
    console.log(`Toast: ${options.title} - ${options.description} (${options.variant})`);
    if (typeof window !== 'undefined' && options.variant === 'destructive') {
        alert(`Error: ${options.title}\n${options.description}`);
    } else if (typeof window !== 'undefined') {
        alert(`Info: ${options.title}\n${options.description}`);
    }
};
