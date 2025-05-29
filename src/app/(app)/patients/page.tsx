import { PatientListClient } from '@/components/patients/PatientListClient';
import type { Patient } from '@/types'; // Assuming Patient type is defined
import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// This function would typically fetch data from your backend/Firebase
async function getPatients(): Promise<Patient[]> {
  // Placeholder: In a real app, fetch patients from Firestore
  // For now, return an empty array to demonstrate empty state handling
  return [];
}

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Patient Management</h1>
          <p className="text-muted-foreground">
            View, search, and manage all patient records.
          </p>
        </div>
        <Link href="/patients/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Patient
          </Button>
        </Link>
      </div>
      
      <PatientListClient initialPatients={patients} />
    </div>
  );
}
