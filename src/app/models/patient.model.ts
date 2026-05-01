export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  fiscalCode: string;
  birthDate: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface PatientRequest {
  firstName: string;
  lastName: string;
  fiscalCode: string;
  birthDate: string;
  email: string;
  phone?: string | null;
}
