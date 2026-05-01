export interface ClinicalAppointment {
  id: number;
  patientId: number;
  patientFullName: string;
  doctorId: number;
  doctorFullName: string;
  doctorSpecialization: string;
  scheduledAt: string;
  visitType: string;
  status: string;
  notes?: string;
  hasReport: boolean;
  createdAt: string;
}
