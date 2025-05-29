export interface User {
  id: string;
  email: string;
  name?: string;
  specialty?: string;
  contactInfo?: string;
  role: 'ADMIN' | 'DOCTOR';
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  nationalId?: string; // DNI/Identification
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  allergies?: string; // Could be a list or structured data
  currentMedications?: string; // Could be a list or structured data
  createdAt: Date;
  updatedAt: Date;
  createdById?: string; // Doctor ID who created the patient
}

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'RESCHEDULED';

export interface Appointment {
  id: string;
  dateTime: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  patientId: string;
  patientFullName?: string; // For display
  doctorId: string;
  doctorName?: string; // For display
  reason?: string; // Optional reason for appointment
  notes?: string; // Optional notes
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  name: string;
  url: string;
  type?: string; // e.g., 'pdf', 'image/jpeg'
  size?: number; // in bytes
}

export interface MedicalRecordEntry {
  id: string;
  visitDate: Date;
  reasonForConsultation: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  patientId: string;
  doctorId: string;
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LabResult {
  id: string;
  testName: string;
  date: Date;
  values?: string; // Could be JSON for structured results
  units?: string;
  referenceRange?: string;
  interpretation?: string;
  patientId: string;
  medicalRecordEntryId?: string; // Optional link to a specific visit
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DicomStudy {
  id: string;
  studyDate: Date;
  description?: string;
  patientId: string;
  medicalRecordEntryId?: string; // Optional link to a specific visit
  storageUrl: string; // URL in Cloud Storage
  previewImageUrl?: string; // Optional URL for web-friendly preview
  seriesCount?: number;
  instanceCount?: number;
  modality?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Generic type for paginated data, can be used for lists
export interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
