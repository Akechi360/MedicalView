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

  // Placeholder functions for adding new entries
  const handleAddMedicalEntry = () => toast({ title: "Add Medical Entry (Placeholder)"});
  const handleAddLabResult = () => toast({ title: "Add Lab Result (Placeholder)"});
  const handleUploadDicom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({ title: "DICOM Uploaded (Placeholder)", description: `File: ${file.name}`});
      // Simulate adding to list - removed as per request to eliminate mocks
      // const newStudy: DicomStudy = {
      //   id: Math.random().toString(36).substring(7),
      //   patientId: patient.id,
      //   studyDate: new Date(),
      //   description: file.name,
      //   storageUrl: `placeholder/path/to/${file.name}`,
      //   previewImageUrl: `https://placehold.co/200x200.png?text=${file.name.substring(0,3)}`,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // };
      // setDicomStudies(prev => [newStudy, ...prev]); // Mock behavior removed
    }
  };


  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="history">Medical History</TabsTrigger>
        <TabsTrigger value="labs">Lab Results</TabsTrigger>
        <TabsTrigger value="dicom">DICOM Studies</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <PatientOverview patient={patient} />
      </TabsContent>

      <TabsContent value="history">
        <SectionShell
          title="Medical History"
          icon={<FileText className="h-5 w-5 text-primary" />}
          onAdd={handleAddMedicalEntry}
          addLabel="New Medical Entry"
        >
          {medicalHistory.length > 0 ? (
            medicalHistory.map(entry => <MedicalEntryCard key={entry.id} entry={entry} />)
          ) : (
            <EmptyState icon={<FileText />} message="No medical history recorded for this patient." />
          )}
        </SectionShell>
      </TabsContent>

      <TabsContent value="labs">
        <SectionShell
          title="Lab Results"
          icon={<Microscope className="h-5 w-5 text-primary" />}
          onAdd={handleAddLabResult}
          addLabel="Add Lab Result"
        >
          {labResults.length > 0 ? (
             labResults.map(result => <LabResultCard key={result.id} result={result} />)
          ) : (
            <EmptyState icon={<Microscope />} message="No lab results available for this patient." />
          )}
        </SectionShell>
      </TabsContent>

      <TabsContent value="dicom">
         <SectionShell
          title="DICOM Studies"
          icon={<FileScan className="h-5 w-5 text-primary" />}
          customAddAction={
            <Button asChild>
              <label htmlFor="dicom-upload">
                <Upload className="mr-2 h-4 w-4" /> Upload DICOM Study
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
            <EmptyState icon={<FileScan />} message="No DICOM studies uploaded for this patient." />
          )}
        </SectionShell>
      </TabsContent>
    </Tabs>
  );
}


function PatientOverview({ patient }: { patient: Patient }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoRow label="Full Name" value={patient.fullName} />
        <InfoRow label="Date of Birth" value={format(new Date(patient.dateOfBirth), 'PPP')} />
        <InfoRow label="Gender" value={patient.gender} />
        <InfoRow label="National ID" value={patient.nationalId || 'N/A'} />
        <InfoRow label="Contact Phone" value={patient.contactPhone || 'N/A'} />
        <InfoRow label="Contact Email" value={patient.contactEmail || 'N/A'} />
        <InfoRow label="Address" value={patient.address || 'N/A'} />
        <InfoRow label="Allergies" value={patient.allergies || 'None reported'} />
        <InfoRow label="Current Medications" value={patient.currentMedications || 'None reported'} />
        <InfoRow label="Profile Created" value={format(new Date(patient.createdAt), 'PPpp')} />
        <InfoRow label="Last Updated" value={format(new Date(patient.updatedAt), 'PPpp')} />
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

// Placeholder Card components for History, Labs, DICOM entries
function MedicalEntryCard({ entry }: { entry: MedicalRecordEntry }) {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-lg">Visit on {format(new Date(entry.visitDate), 'PPP')}</CardTitle>
        <CardDescription>Reason: {entry.reasonForConsultation}</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Diagnosis:</strong> {entry.diagnosis || 'N/A'}</p>
        <p><strong>Treatment:</strong> {entry.treatment || 'N/A'}</p>
        {entry.notes && <p className="mt-2 text-sm bg-background p-2 rounded"><strong>Notes:</strong> {entry.notes}</p>}
        {entry.attachments && entry.attachments.length > 0 && (
          <div className="mt-2">
            <strong>Attachments:</strong>
            <ul className="list-disc pl-5">
              {entry.attachments.map(att => <li key={att.name}><a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{att.name}</a></li>)}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="sm"><FileText className="mr-1 h-4 w-4"/> View Full Note</Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90"><Trash2 className="mr-1 h-4 w-4"/> Delete</Button>
      </CardFooter>
    </Card>
  );
}

function LabResultCard({ result }: { result: LabResult }) {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-lg">{result.testName}</CardTitle>
        <CardDescription>Date: {format(new Date(result.date), 'PPP')}</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Result:</strong> {result.values || 'N/A'} {result.units}</p>
        <p><strong>Interpretation:</strong> {result.interpretation || 'N/A'}</p>
        {result.attachments && result.attachments.length > 0 && (
          <div className="mt-2">
            <strong>Attachments:</strong>
            <ul className="list-disc pl-5">
              {result.attachments.map(att => <li key={att.name}><a href={att.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{att.name}</a></li>)}
            </ul>
          </div>
        )}
      </CardContent>
       <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="sm"><EyeIcon className="mr-1 h-4 w-4"/> View Details</Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90"><Trash2 className="mr-1 h-4 w-4"/> Delete</Button>
      </CardFooter>
    </Card>
  );
}

function DicomStudyCard({ study }: { study: DicomStudy }) {
  const { toast } = useToast();
  const handleViewDicom = () => {
     toast({
      title: "View DICOM (Placeholder)",
      description: "This would open the DICOM viewer for " + study.description,
    });
  }
  return (
    <Card className="overflow-hidden">
      {study.previewImageUrl && (
         <Image src={study.previewImageUrl} alt={study.description || 'DICOM Study'} width={200} height={200} className="w-full h-40 object-cover" data-ai-hint="medical scan" />
      )}
      {!study.previewImageUrl && (
        <div className="w-full h-40 bg-muted flex items-center justify-center">
          <FileScan className="w-12 h-12 text-muted-foreground" />
        </div>
      )}
      <CardHeader className="p-3">
        <CardTitle className="text-base truncate" title={study.description || 'DICOM Study'}>{study.description || 'DICOM Study'}</CardTitle>
        <CardDescription className="text-xs">Date: {format(new Date(study.studyDate), 'PP')}</CardDescription>
      </CardHeader>
      <CardFooter className="p-3 flex justify-between items-center">
        <Button variant="default" size="sm" onClick={handleViewDicom} className="w-full">
          <EyeIcon className="mr-1 h-4 w-4"/> View
        </Button>
        {/* <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90"><Trash2 className="h-4 w-4"/></Button> */}
      </CardFooter>
    </Card>
  );
}
