
export type UserRole = 'DOCTOR' | 'PATIENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName?: string | null; 
  password?: string; // Hash in DB, not sent to client
  role: UserRole;
  specialty?: string | null; 
  createdAt: Date;
  updatedAt: Date;
  // patientProfileId is removed as the relation is now owned by Patient model
}

export interface Patient {
  id: string;
  userId?: string | null; // Foreign key to User model
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
  // patientUserId for relation to User model (if patient is a registered user)
  patientUserId?: string | null; 


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
  attachments?: AttachmentsJson; 
  createdAt: Date;
  updatedAt: Date;

  // Added for back-relations
  labResults?: LabResult[];
  dicomStudies?: DicomStudy[];
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
  attachments?: AttachmentsJson; 
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

// For Firebase user data from client to server action
export interface FirebaseClientUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
