import { Routes } from '@angular/router';
import { loginGuard, adminGuard } from './guards/auth.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // ── Pubbliche (visibili a tutti senza login) ──────────────────────────
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'doctors',
    loadComponent: () => import('./pages/doctors/doctors.component').then(m => m.DoctorsComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'nutrition',
    loadComponent: () => import('./pages/nutrition/nutrition.component').then(m => m.NutritionComponent)
  },
  {
    path: 'recipes',
    loadComponent: () => import('./pages/recipes/recipes.component').then(m => m.RecipesComponent)
  },
  {
    path: 'training',
    loadComponent: () => import('./pages/training/training.component').then(m => m.TrainingComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent)
  },
  {
    path: 'staff/simona',
    loadComponent: () => import('./pages/staff/simona/simona.component').then(m => m.SimonaComponent)
  },
  {
    path: 'staff/luca',
    loadComponent: () => import('./pages/staff/luca/luca.component').then(m => m.LucaComponent)
  },
  {
    path: 'staff/sandro',
    loadComponent: () => import('./pages/staff/sandro/sandro.component').then(m => m.SandroComponent)
  },
  {
    path: 'staff/mihai',
    loadComponent: () => import('./pages/staff/mihai/mihai.component').then(m => m.MihaiComponent)
  },
  {
    path: 'staff/cristiana',
    loadComponent: () => import('./pages/staff/cristiana/cristiana.component').then(m => m.CristianaComponent)
  },

  // ── Richiede login (admin o user) ─────────────────────────────────────
  {
    path: 'appointments',
    loadComponent: () => import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent),
    canActivate: [loginGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [loginGuard]
  },

  // ── Solo admin ────────────────────────────────────────────────────────
  {
    path: 'patients',
    loadComponent: () => import('./pages/patients/patients.component').then(m => m.PatientsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'clients',
    loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'glycemia',
    loadComponent: () => import('./pages/glycemia/glycemia.component').then(m => m.GlycemiaComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'booking-calendar',
    loadComponent: () => import('./pages/booking-calendar/booking-calendar.component').then(m => m.BookingCalendarComponent),
    canActivate: [adminGuard]
  },

  { path: '**', redirectTo: 'dashboard' }
];
