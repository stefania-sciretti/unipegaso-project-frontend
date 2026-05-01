export type AppointmentStatus = 'BOOKED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface FitnessAppointment {
  id: number;
  patientId: number;
  patientFullName: string;
  specialistId: number;
  specialistFullName: string;
  specialistRole: string;
  scheduledAt: string;
  serviceType: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface FitnessAppointmentRequest {
  patientId: number;
  specialistId: number;
  scheduledAt: string;
  serviceType: string;
  notes?: string | null;
}
