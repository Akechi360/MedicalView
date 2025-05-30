import { PatientFormClient } from '@/components/patients/PatientFormClient';
import type { Patient } from '@/types';
import { ChevronLeft, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Placeholder fetch function
async function getPatientDetails(patientId: string): Promise<Patient | null> {
  console.log(`Obteniendo detalles del paciente para editar ID: ${patientId}`);
  // Mock data removed, returning null to simulate not found or real fetch pending
  return Promise.resolve(null);
}

export default async function EditPatientPage({ params }: { params: { patientId: string } }) {
  const patient = await getPatientDetails(params.patientId);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <User className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Paciente No Encontrado</h1>
        <p className="text-muted-foreground">El paciente con ID "{params.patientId}" no pudo ser encontrado para editar.</p>
        <Link href="/patients" className="mt-6">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Volver a la Lista de Pacientes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/patients/${params.patientId}`}>
          <Button variant="outline" size="icon" aria-label="Volver al detalle del paciente">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Editar Paciente: {patient.fullName}</h1>
            <p className="text-muted-foreground">Actualice la información del perfil del paciente.</p>
        </div>
      </div>
      <PatientFormClient initialData={patient} />
    </div>
  );
}
