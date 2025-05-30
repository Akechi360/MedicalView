'use client';

import type { Patient } from '@/types';
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Trash2, Search, Users } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PatientListClientProps {
  initialPatients: Patient[];
}

export function PatientListClient({ initialPatients }: PatientListClientProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter(patient =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.nationalId && patient.nationalId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient.contactEmail && patient.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [patients, searchTerm]);

  const handleDeletePatient = (patientId: string) => {
    console.log('Eliminando paciente (simulado):', patientId);
    setPatients(prev => prev.filter(p => p.id !== patientId));
    toast({
      title: "Paciente Eliminado (Simulado)",
      description: `El paciente con ID ${patientId} ha sido eliminado de la lista.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar pacientes por nombre, ID o correo electrónico..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 w-full md:w-1/3"
        />
      </div>

      {filteredPatients.length > 0 ? (
        <div className="rounded-lg border shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Fecha de Nacimiento</TableHead>
                <TableHead>Género</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.fullName}</TableCell>
                  <TableCell>{format(new Date(patient.dateOfBirth), 'PP')}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.contactEmail || patient.contactPhone || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/patients/${patient.id}`}>
                        <Button variant="ghost" size="icon" title="Ver Detalles">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/patients/${patient.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Editar Paciente">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Eliminar Paciente" className="text-destructive hover:text-destructive/90">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del paciente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePatient(patient.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg bg-card">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground">No se Encontraron Pacientes</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Intenta ajustar tus criterios de búsqueda." : "Comienza añadiendo un nuevo paciente."}
          </p>
        </div>
      )}
    </div>
  );
}
