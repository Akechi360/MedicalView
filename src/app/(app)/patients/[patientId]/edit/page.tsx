import { PatientFormClient } from '@/components/patients/PatientFormClient';
import type { Patient } from '@/types';
import { ChevronLeft, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Placeholder fetch function
async function getPatientDetails(patientId: string): Promise<Patient | null> {
  console.log(`Fetching patient details for editing ID: ${patientId}`);
  if (patientId === "error") return null;
  return {
    id: patientId,
    fullName: patientId === "1" ? 'Alice Wonderland' : `Patient ${patientId} To Edit`,
    dateOfBirth: new Date('1990-05-15'),
    gender: 'FEMALE',
    nationalId: `ID-${patientId}XYZ-EDIT`,
    contactPhone: '555-0000',
    contactEmail: `edit.patient${patientId}@example.com`,
    address: '456 Edit Lane, Storybook City',
    allergies: 'Dust',
    currentMedications: 'Ibuprofen as needed',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: 'doc456',
  };
}

export default async function EditPatientPage({ params }: { params: { patientId: string } }) {
  const patient = await getPatientDetails(params.patientId);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <User className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Patient Not Found</h1>
        <p className="text-muted-foreground">The patient with ID "{params.patientId}" could not be found for editing.</p>
        <Link href="/patients" className="mt-6">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Patient List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/patients/${params.patientId}`}>
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Edit Patient: {patient.fullName}</h1>
            <p className="text-muted-foreground">Update the patient's profile information.</p>
        </div>
      </div>
      <PatientFormClient initialData={patient} />
    </div>
  );
}
