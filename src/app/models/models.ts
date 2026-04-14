// src/app/models/models.ts

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  goal?: string;
  createdAt: string;
}

export interface ClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: string | null;
  goal?: string | null;
}

export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  bio?: string;
  email: string;
  createdAt: string;
}

export type AppointmentStatus = 'BOOKED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface FitnessAppointment {
  id: number;
  clientId: number;
  clientFullName: string;
  trainerId: number;
  trainerFullName: string;
  trainerRole: string;
  scheduledAt: string;
  serviceType: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface FitnessAppointmentRequest {
  clientId: number;
  trainerId: number;
  scheduledAt: string;
  serviceType: string;
  notes?: string | null;
}

export interface DietPlan {
  id: number;
  clientId: number;
  clientFullName: string;
  trainerId: number;
  trainerFullName: string;
  title: string;
  description?: string;
  calories?: number;
  durationWeeks?: number;
  active: boolean;
  createdAt: string;
}

export interface DietPlanRequest {
  clientId: number;
  trainerId: number;
  title: string;
  description?: string | null;
  calories?: number | null;
  durationWeeks?: number | null;
  active: boolean;
}

export interface TrainingPlan {
  id: number;
  clientId: number;
  clientFullName: string;
  trainerId: number;
  trainerFullName: string;
  title: string;
  description?: string;
  weeks?: number;
  sessionsPerWeek?: number;
  active: boolean;
  createdAt: string;
}

export interface TrainingPlanRequest {
  clientId: number;
  trainerId: number;
  title: string;
  description?: string | null;
  weeks?: number | null;
  sessionsPerWeek?: number | null;
  active: boolean;
}

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  calories?: number;
  category?: string;
  createdAt: string;
}

export interface RecipeRequest {
  title: string;
  description?: string | null;
  ingredients?: string | null;
  instructions?: string | null;
  calories?: number | null;
  category?: string | null;
}

export interface DashboardStats {
  totalClients: number;
  totalAppointments: number;
  bookedAppointments: number;
  completedAppointments: number;
  activeDietPlans: number;
  activeTrainingPlans: number;
  totalRecipes: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors?: Record<string, string>;
}


// ─── GlycemiaMeasurement ──────────────────────────────────────────────────────

export type GlycemiaContext = 'FASTING' | 'POST_MEAL_1H' | 'POST_MEAL_2H' | 'RANDOM';
export type GlycemiaClassification = 'NORMALE' | 'ATTENZIONE' | 'ELEVATA';

export interface GlycemiaMeasurement {
  id: number;
  clientId: number;
  clientFullName: string;
  trainerId: number;
  trainerFullName: string;
  measuredAt: string;
  valueMgDl: number;
  context: GlycemiaContext;
  classification: GlycemiaClassification;
  notes?: string;
  createdAt: string;
}

export interface GlycemiaMeasurementRequest {
  clientId: number;
  trainerId: number;
  measuredAt: string;
  valueMgDl: number;
  context: GlycemiaContext;
  notes?: string | null;
}

