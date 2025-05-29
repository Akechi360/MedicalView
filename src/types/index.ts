
export type UserRole = 'DOCTOR' | 'PATIENT' | 'ADMIN'; // ADMIN can be kept for future use

export interface User {
  id: string;
  email: string;
  name?: string;
  password?: string; // Added for auth purposes, though hashing is not handled here
  role: UserRole;
  specialty?: string; // Applicable if role is DOCTOR
  createdAt: Date;
  updatedAt: Date;
  patientProfileId?: string; // Link to Patient profile if role is PATIENT
}

export interface Patient {
  id: string;
  userId?: string; // Link to the User account if the patient is also a user
  fullName: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  nationalId?: string; // DNI/Identification
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  allergies?: string; 
  currentMedications?: string; 
  createdAt: Date;
  updatedAt: Date;
  createdById?: string; // Doctor User ID who created the patient (if not self-registered)
}

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'RESCHEDULED';

export interface Appointment {
  id: string;
  dateTime: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  patientId: string; // FK to Patient table
  patientFullName?: string; // For display, denormalized
  doctorId: string; // FK to User table (where role is DOCTOR)
  doctorName?: string; // For display, denormalized
  reason?: string; 
  notes?: string; 
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  name: string;
  url: string;
  type?: string; 
  size?: number; 
}

export interface MedicalRecordEntry {
  id: string;
  visitDate: Date;
  reasonForConsultation: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  patientId: string; // FK to Patient table
  doctorId: string; // FK to User table (where role is DOCTOR)
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LabResult {
  id: string;
  testName: string;
  date: Date;
  values?: string; 
  units?: string;
  referenceRange?: string;
  interpretation?: string;
  patientId: string; // FK to Patient table
  medicalRecordEntryId?: string; 
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DicomStudy {
  id: string;
  studyDate: Date;
  description?: string;
  patientId: string; // FK to Patient table
  medicalRecordEntryId?: string; 
  storageUrl: string; 
  previewImageUrl?: string; 
  seriesCount?: number;
  instanceCount?: number;
  modality?: string;
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
