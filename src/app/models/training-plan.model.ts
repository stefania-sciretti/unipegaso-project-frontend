export interface TrainingPlan {
  id: number;
  patientId: number;
  patientFullName: string;
  specialistId: number;
  specialistFullName: string;
  title: string;
  description?: string;
  weeks?: number;
  sessionsPerWeek?: number;
  active: boolean;
  createdAt: string;
}

export interface TrainingPlanRequest {
  patientId: number;
  specialistId: number;
  title: string;
  description?: string | null;
  weeks?: number | null;
  sessionsPerWeek?: number | null;
  active: boolean;
}
