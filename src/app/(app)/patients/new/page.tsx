import { PatientFormClient } from '@/components/patients/PatientFormClient';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewPatientPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="outline" size="icon" aria-label="Volver a pacientes">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Añadir Nuevo Paciente</h1>
            <p className="text-muted-foreground">Complete los detalles para crear un nuevo perfil de paciente.</p>
        </div>
      </div>
      <PatientFormClient />
    </div>
  );
}
