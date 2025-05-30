
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
  const [userName, setUserName] = useState<string>("Usuario");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem(USER_ROLE_KEY) as UserRole | null;
      const storedUserData = localStorage.getItem(USER_DATA_KEY);
      
      let resolvedUserName = "Usuario";
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          resolvedUserName = userData.name || userData.email || "Usuario";
        } catch (e) {
          console.error("Error al parsear datos de usuario para el panel:", e);
        }
      }

      if (storedRole && ['DOCTOR', 'PATIENT', 'ADMIN'].includes(storedRole)) {
        setCurrentUserRole(storedRole);
        if (storedRole === 'ADMIN') {
          setUserName(resolvedUserName === "Usuario" ? "GodMode (Admin)" : resolvedUserName);
        } else {
          setUserName(resolvedUserName);
        }
      } else {
        toast({
            title: 'Acceso Denegado',
            description: 'Por favor, inicia sesión para acceder al panel.',
            variant: 'destructive',
        });
        router.push('/login');
        return; 
      }
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-theme(space.32))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando panel...</p>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          ¡Bienvenido, {userName}!
        </h1>
        <p className="text-muted-foreground">
          {currentUserRole === 'DOCTOR' 
            ? "Aquí tienes un resumen de tu MediView Hub."
            : currentUserRole === 'ADMIN'
            ? "Panel de administración del sistema."
            : "Gestiona tus citas y consulta tu información médica."}
        </p>
      </header>

      {(currentUserRole === 'ADMIN' || currentUserRole === 'DOCTOR') && ( // Combined condition
         <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Gestión de Usuarios"
              description="Administra todos los usuarios (Médicos, Pacientes)."
              icon={<Users className="h-6 w-6 text-primary" />}
              value="0 Usuarios" 
              footerText="Ver Todos los Usuarios"
              link="/admin/users" 
            />
            <DashboardCard
              title="Configuración del Sistema"
              description="Configura los ajustes de la aplicación."
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
              value="Config."
              footerText="Ir a Ajustes"
              link="/admin/settings" 
            />
             <DashboardCard
              title="Registros de Auditoría"
              description="Consulta los registros de actividad del sistema."
              icon={<FileText className="h-6 w-6 text-primary" />}
              value="Ver Registros"
              footerText="Ir a Registros"
              link="/admin/logs" 
            />
          </section>
      )}

      {currentUserRole === 'DOCTOR' && ( // Doctor specific section can remain or be merged above
        <>
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Pacientes"
              description="Gestiona historiales médicos y de pacientes."
              icon={<Users className="h-6 w-6 text-primary" />}
              value="0" 
              footerText="Ver Todos los Pacientes"
              link="/patients"
            />
            <DashboardCard
              title="Citas"
              description="Consulta y programa próximas citas."
              icon={<CalendarDays className="h-6 w-6 text-primary" />}
              value="0 Hoy" 
              footerText="Ir al Calendario"
              link="/appointments"
            />
            <DashboardCard
              title="Diagnóstico IA"
              description="Utiliza IA para asistencia en diagnósticos."
              icon={<Brain className="h-6 w-6 text-primary" />}
              value="Listo"
              footerText="Iniciar Diagnóstico IA"
              link="/ai-diagnosis"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground/90">Acciones Rápidas</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <QuickActionCard
                title="Nuevo Paciente"
                icon={<Users className="h-5 w-5" />}
                href="/patients/new"
              />
              <QuickActionCard
                title="Nueva Cita"
                icon={<CalendarDays className="h-5 w-5" />}
                href="/appointments#new" 
              />
              <QuickActionCard
                title="Subir DICOM"
                icon={<HardDriveUpload className="h-5 w-5" />}
                href="/patients" 
              />
              <QuickActionCard
                title="Ver Informes"
                icon={<FileText className="h-5 w-5" />}
                href="/patients" 
              />
            </div>
          </section>
        </>
      )}

      {currentUserRole === 'PATIENT' && (
         <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DashboardCard
              title="Mis Citas"
              description="Consulta y gestiona tus próximas citas."
              icon={<CalendarDays className="h-6 w-6 text-primary" />}
              value="0 Próximas" 
              footerText="Ir a Mis Citas"
              link="/my-appointments" 
            />
            <DashboardCard
              title="Mi Historial Médico"
              description="Accede a tu historial médico y resultados de laboratorio."
              icon={<FileText className="h-6 w-6 text-primary" />}
              value="Ver"
              footerText="Acceder a Mis Registros"
              link="/my-medical-records" 
            />
            <DashboardCard
              title="Programar Nueva Cita"
              description="Encuentra un médico y reserva una nueva consulta."
              icon={<UserCheck className="h-6 w-6 text-primary" />}
              value="Reservar Ahora"
              footerText="Programar Cita"
              link="/appointments#new" 
            />
          </section>
      )}
      
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 text-foreground/90">Actividad Reciente</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No hay actividad reciente para mostrar.</p>
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

const toast = (options: { title: string, description: string, variant?: 'destructive' | 'default' }) => {
    console.log(`Toast: ${options.title} - ${options.description} (${options.variant})`);
    if (typeof window !== 'undefined' && options.variant === 'destructive') {
        alert(`Error: ${options.title}\n${options.description}`);
    } else if (typeof window !== 'undefined') {
        alert(`Info: ${options.title}\n${options.description}`);
    }
};
