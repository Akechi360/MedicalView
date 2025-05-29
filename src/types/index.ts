
export type UserRole = 'DOCTOR' | 'PATIENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName?: string | null; // Prisma schema uses String? which can be null
  password?: string; // Optional on the type, but required in DB (hash)
  role: UserRole;
  specialty?: string | null; // For doctors, Prisma String?
  createdAt: Date;
  updatedAt: Date;
  patientProfileId?: string | null; // Link to Patient profile if role is PATIENT
}

export interface Patient {
  id: string;
  userId?: string | null; 
  fullName: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  nationalId?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  address?: string | null;
  allergies?: string | null; 
  currentMedications?: string | null; 
  createdAt: Date;
  updatedAt: Date;
  createdById?: string | null; 
}

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'RESCHEDULED';

export interface Appointment {
  id: string;
  dateTime: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  patientId: string; 
  patientFullName?: string | null; 
  doctorId: string; 
  doctorName?: string | null; 
  reason?: string | null; 
  notes?: string | null; 
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  name: string;
  url: string;
  type?: string; 
  size?: number; 
}

// Prisma's Json? type can be represented as `any` or a more specific type if known
// For simplicity, we can use `Attachment[] | null` if attachments is a JSON field storing an array.
// However, Prisma's Json type is more flexible. Let's assume it can be null.
export type AttachmentsJson = Attachment[] | null;


export interface MedicalRecordEntry {
  id: string;
  visitDate: Date;
  reasonForConsultation: string;
  diagnosis?: string | null;
  treatment?: string | null;
  notes?: string | null;
  patientId: string; 
  doctorId: string; 
  attachments?: AttachmentsJson; // Prisma's Json?
  createdAt: Date;
  updatedAt: Date;
}

export interface LabResult {
  id: string;
  testName: string;
  date: Date;
  values?: string | null; 
  units?: string | null;
  referenceRange?: string | null;
  interpretation?: string | null;
  patientId: string; 
  medicalRecordEntryId?: string | null; 
  attachments?: AttachmentsJson; // Prisma's Json?
  createdAt: Date;
  updatedAt: Date;
}

export interface DicomStudy {
  id: string;
  studyDate: Date;
  description?: string | null;
  patientId: string; 
  medicalRecordEntryId?: string | null; 
  storageUrl: string; 
  previewImageUrl?: string | null; 
  seriesCount?: number | null;
  instanceCount?: number | null;
  modality?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
