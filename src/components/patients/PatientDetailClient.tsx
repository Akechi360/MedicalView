'use client';

import type { Patient, MedicalRecordEntry, LabResult, DicomStudy, Attachment } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Microscope, FileScan, PlusCircle, Upload, Download, Trash2, EyeIcon } from 'lucide-react';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface PatientDetailClientProps {
  patient: Patient;
  initialMedicalHistory: MedicalRecordEntry[];
  initialLabResults: LabResult[];
  initialDicomStudies: DicomStudy[];
}

export function PatientDetailClient({ 
  patient, 
  initialMedicalHistory, 
  initialLabResults, 
  initialDicomStudies 
}: PatientDetailClientProps) {
  
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecordEntry[]>(initialMedicalHistory);
  const [labResults, setLabResults] = useState<LabResult[]>(initialLabResults);
  const [dicomStudies, setDicomStudies] = useState<DicomStudy[]>(initialDicomStudies);
  const { toast } = useToast();

  const handleAddMedicalEntry = () => toast({ title: "Añadir Entrada Médica (Simulado)"});
  const handleAddLabResult = () => toast({ title: "Añadir Resultado de Laboratorio (Simulado)"});
  const handleUploadDicom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: "DICOM Subido (Simulado)", description: `Archivo: ${file.name}`});
    }
  };


  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="history">Historial Médico</TabsTrigger>
        <TabsTrigger value="labs">Resultados Lab.</TabsTrigger>
        <TabsTrigger value="dicom">Estudios DICOM</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <PatientOverview patient={patient} />
      </TabsContent>

      <TabsContent value="history">
        <SectionShell
          title="Historial Médico"
          icon={<FileText className="h-5 w-5 text-primary" />}
          onAdd={handleAddMedicalEntry}
          addLabel="Nueva Entrada Médica"
        >
          {medicalHistory.length > 0 ? (
            medicalHistory.map(entry => <MedicalEntryCard key={entry.id} entry={entry} />)
          ) : (
            <EmptyState icon={<FileText />} message="No hay historial médico registrado para este paciente." />
          )}
        </SectionShell>
      </TabsContent>

      <TabsContent value="labs">
        <SectionShell
          title="Resultados de Laboratorio"
          icon={<Microscope className="h-5 w-5 text-primary" />}
          onAdd={handleAddLabResult}
          addLabel="Añadir Resultado"
        >
          {labResults.length > 0 ? (
             labResults.map(result => <LabResultCard key={result.id} result={result} />)
          ) : (
            <EmptyState icon={<Microscope />} message="No hay resultados de laboratorio disponibles para este paciente." />
          )}
        </SectionShell>
      </TabsContent>

      <TabsContent value="dicom">
         <SectionShell
          title="Estudios DICOM"
          icon={<FileScan className="h-5 w-5 text-primary" />}
          customAddAction={
            <Button asChild>
              <label htmlFor="dicom-upload">
                <Upload className="mr-2 h-4 w-4" /> Subir Estudio DICOM
                <input id="dicom-upload" type="file" accept=".dcm,image/dicom-rle" className="hidden" onChange={handleUploadDicom} />
              </label>
            </Button>
          }
        >
          {dicomStudies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {dicomStudies.map(study => <DicomStudyCard key={study.id} study={study} />)}
            </div>
          ) : (
            <EmptyState icon={<FileScan />} message="No hay estudios DICOM subidos para este paciente." />
          )}
        </SectionShell>
      </TabsContent>
    </Tabs>
  );
}


function PatientOverview({ patient }: { patient: Patient }) {
  const genderSpanish = (gender: Patient['gender']) => {
    switch(gender) {
      case 'MALE': return 'Masculino';
      case 'FEMALE': return 'Femenino';
      case 'OTHER': return 'Otro';
      case 'PREFER_NOT_TO_SAY': return 'Prefiero no decirlo';
      default: return gender;
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Información del Paciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow label="Nombre Completo" value={patient.fullName} />
        <InfoRow label="Fecha de Nacimiento" value={format(new Date(patient.dateOfBirth), 'PPP')} />
        <InfoRow label="Género" value={genderSpanish(patient.gender)} />
        <InfoRow label="ID Nacional" value={patient.nationalId || 'N/A'} />
        <InfoRow label="Teléfono de Contacto" value={patient.contactPhone || 'N/A'} />
        <InfoRow label="Correo Electrónico" value={patient.contactEmail || 'N/A'} />
        <InfoRow label="Dirección" value={patient.address || 'N/A'} />
        <InfoRow label="Alergias" value={patient.allergies || 'Ninguna reportada'} />
        <InfoRow label="Medicamentos Actuales" value={patient.currentMedications || 'Ninguno reportado'} />
        <InfoRow label="Perfil Creado" value={format(new Date(patient.createdAt), 'PPpp')} />
        <InfoRow label="Última Actualización" value={format(new Date(patient.updatedAt), 'PPpp')} />
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center">
      <p className="w-full sm:w-1/3 font-medium text-muted-foreground">{label}:</p>
      <p className="w-full sm:w-2/3 text-foreground">{value}</p>
    </div>
  );
}

interface SectionShellProps {
  title: string;
  icon: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  customAddAction?: React.ReactNode;
  children: React.ReactNode;
}

function SectionShell({ title, icon, onAdd, addLabel, customAddAction, children }: SectionShellProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        {customAddAction ? customAddAction : (
          onAdd && addLabel && (
            <Button onClick={onAdd} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> {addLabel}
            </Button>
          )
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-lg">
      {React.cloneElement(icon as React.ReactElement, { className: "h-12 w-12 text-muted-foreground mb-3" })}
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

function MedicalEntryCard({ entry }: { entry: MedicalRecordEntry }) {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-lg">Visita el {format(new Date(entry.visitDate), 'PPP')}</CardTitle>
        <CardDescription>Motivo: {entry.reasonForConsultation}</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Diagnóstico:</strong> {entry.diagnosis || 'N/A'}</p>
        <p><strong>Tratamiento:</strong> {entry.treatment || 'N/A'}</p>
        {entry.notes && <p className="mt-2 text-sm bg-background p-2 rounded"><strong>Notas:</strong> {entry.notes}</p>}
        {entry.attachments && entry.attachments.length > 0 && (
          <div className="mt-2">
            <strong>Adjuntos:</strong>
            <ul className="list-disc pl-5">
              {entry.attachments.map(att => <li key={att.name}><a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{att.name}</a></li>)}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="sm"><FileText className="mr-1 h-4 w-4"/> Ver Nota Completa</Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90"><Trash2 className="mr-1 h-4 w-4"/> Eliminar</Button>
      </CardFooter>
    </Card>
  );
}

function LabResultCard({ result }: { result: LabResult }) {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-lg">{result.testName}</CardTitle>
        <CardDescription>Fecha: {format(new Date(result.date), 'PPP')}</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Resultado:</strong> {result.values || 'N/A'} {result.units}</p>
        <p><strong>Interpretación:</strong> {result.interpretation || 'N/A'}</p>
        {result.attachments && result.attachments.length > 0 && (
          <div className="mt-2">
            <strong>Adjuntos:</strong>
            <ul className="list-disc pl-5">
              {result.attachments.map(att => <li key={att.name}><a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{att.name}</a></li>)}
            </ul>
          </div>
        )}
      </CardContent>
       <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="sm"><EyeIcon className="mr-1 h-4 w-4"/> Ver Detalles</Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90"><Trash2 className="mr-1 h-4 w-4"/> Eliminar</Button>
      </CardFooter>
    </Card>
  );
}

function DicomStudyCard({ study }: { study: DicomStudy }) {
  const { toast } = useToast();
  const handleViewDicom = () => {
     toast({
      title: "Ver DICOM (Simulado)",
      description: "Esto abriría el visor DICOM para " + study.description,
    });
  }
  return (
    <Card className="overflow-hidden">
      {study.previewImageUrl && (
         <Image src={study.previewImageUrl} alt={study.description || 'Estudio DICOM'} width={200} height={200} className="w-full h-40 object-cover" data-ai-hint="medical scan" />
      )}
      {!study.previewImageUrl && (
        <div className="w-full h-40 bg-muted flex items-center justify-center">
          <FileScan className="w-12 h-12 text-muted-foreground" />
        </div>
      )}
      <CardHeader className="p-3">
        <CardTitle className="text-base truncate" title={study.description || 'Estudio DICOM'}>{study.description || 'Estudio DICOM'}</CardTitle>
        <CardDescription className="text-xs">Fecha: {format(new Date(study.studyDate), 'PP')}</CardDescription>
      </CardHeader>
      <CardFooter className="p-3 flex justify-between items-center">
        <Button variant="default" size="sm" onClick={handleViewDicom} className="w-full">
          <EyeIcon className="mr-1 h-4 w-4"/> Ver
        </Button>
      </CardFooter>
    </Card>
  );
}
