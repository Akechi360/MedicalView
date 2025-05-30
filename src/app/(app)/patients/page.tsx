import { PatientListClient } from '@/components/patients/PatientListClient';
import type { Patient } from '@/types'; 
import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

async function getPatients(): Promise<Patient[]> {
  return [];
}

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Gestión de Pacientes</h1>
          <p className="text-muted-foreground">
            Ver, buscar y gestionar todos los registros de pacientes.
          </p>
        </div>
        <Link href="/patients/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nuevo Paciente
          </Button>
        </Link>
      </div>
      
      <PatientListClient initialPatients={patients} />
    </div>
  );
}
