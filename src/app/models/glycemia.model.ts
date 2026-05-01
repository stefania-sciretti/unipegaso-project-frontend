export type GlycemiaContext = 'FASTING' | 'POST_MEAL_1H' | 'POST_MEAL_2H' | 'RANDOM';
export type GlycemiaClassification = 'NORMALE' | 'ATTENZIONE' | 'ELEVATA';

export interface GlycemiaMeasurement {
  id: number;
  patientId: number;
  patientFullName: string;
  specialistId: number;
  specialistFullName: string;
  measuredAt: string;
  valueMgDl: number;
  context: GlycemiaContext;
  classification: GlycemiaClassification;
  notes?: string;
  createdAt: string;
}

export interface GlycemiaMeasurementRequest {
  patientId: number;
  specialistId: number;
  measuredAt: string;
  valueMgDl: number;
  context: GlycemiaContext;
  notes?: string | null;
}
