export interface DietPlan {
  id: number;
  patientId: number;
  patientFirstName: string;
  patientLastName: string;
  specialistId: number;
  specialistFirstName: string;
  specialistLastName: string;
  title: string;
  description?: string;
  calories?: number;
  durationWeeks?: number;
  active: boolean;
  createdAt: string;
}

export interface DietPlanRequest {
  patientId: number;
  specialistId: number;
  title: string;
  description?: string | null;
  calories?: number | null;
  durationWeeks?: number | null;
  active: boolean;
}
