import { PatientFormClient } from '@/components/patients/PatientFormClient';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewPatientPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Add New Patient</h1>
            <p className="text-muted-foreground">Fill in the details to create a new patient profile.</p>
        </div>
      </div>
      <PatientFormClient />
    </div>
  );
}
