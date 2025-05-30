import { PatientDetailClient } from '@/components/patients/PatientDetailClient';
import type { Patient, MedicalRecordEntry, LabResult, DicomStudy } from '@/types';
import { ChevronLeft, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

// Placeholder fetch functions - replace with actual data fetching logic
async function getPatientDetails(patientId: string): Promise<Patient | null> {
  console.log(`Obteniendo detalles del paciente ID: ${patientId}`);
  return Promise.resolve(null);
}

async function getMedicalHistory(patientId: string): Promise<MedicalRecordEntry[]> {
  console.log(`Obteniendo historial médico para paciente ID: ${patientId}`);
  return Promise.resolve([]);
}

async function getLabResults(patientId: string): Promise<LabResult[]> {
  console.log(`Obteniendo resultados de laboratorio para paciente ID: ${patientId}`);
  return Promise.resolve([]);
}

async function getDicomStudies(patientId: string): Promise<DicomStudy[]> {
  console.log(`Obteniendo estudios DICOM para paciente ID: ${patientId}`);
  return Promise.resolve([]);
}


export default async function PatientDetailPage({ params }: { params: { patientId: string } }) {
  const patient = await getPatientDetails(params.patientId);
  
  const medicalHistory: MedicalRecordEntry[] = await getMedicalHistory(params.patientId);
  const labResults: LabResult[] = await getLabResults(params.patientId);
  const dicomStudies: DicomStudy[] = await getDicomStudies(params.patientId);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <User className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Paciente No Encontrado</h1>
        <p className="text-muted-foreground">El paciente con ID "{params.patientId}" no pudo ser encontrado.</p>
        <Link href="/patients" className="mt-6">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Volver a la Lista de Pacientes
          </Button>
        </Link>
      </div>
    );
  }
  
  const age = format(new Date(), 'yyyy') - format(new Date(patient.dateOfBirth), 'yyyy');


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b">
        <Link href="/patients">
          <Button variant="outline" size="icon" aria-label="Volver a pacientes">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Avatar className="h-16 w-16">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${patient.fullName.charAt(0)}`} alt={patient.fullName} data-ai-hint="person portrait" />
            <AvatarFallback>{patient.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{patient.fullName}</h1>
          <p className="text-muted-foreground">
            {patient.gender === 'MALE' ? 'Masculino' : patient.gender === 'FEMALE' ? 'Femenino' : patient.gender}  ·  {age} años  ·  ID: {patient.nationalId || 'N/A'}
          </p>
        </div>
        <Link href={`/patients/${patient.id}/edit`} className="ml-auto">
            <Button variant="outline">Editar Perfil</Button>
        </Link>
      </div>

      <PatientDetailClient 
        patient={patient}
        initialMedicalHistory={medicalHistory}
        initialLabResults={labResults}
        initialDicomStudies={dicomStudies}
      />
    </div>
  );
}
