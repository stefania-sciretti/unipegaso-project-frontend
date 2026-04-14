import {Routes} from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'clients',
    loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent)
  },
  {
    path: 'appointments',
    loadComponent: () => import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent)
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
    path: 'patients',
    loadComponent: () => import('./pages/patients/patients.component').then(m => m.PatientsComponent)
  },
  {
    path: 'doctors',
    loadComponent: () => import('./pages/doctors/doctors.component').then(m => m.DoctorsComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'glycemia',
    loadComponent: () => import('./pages/glycemia/glycemia.component').then(m => m.GlycemiaComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
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
    path: 'staff/marco',
    loadComponent: () => import('./pages/staff/marco/marco.component').then(m => m.MarcoComponent)
  },
  {
    path: 'staff/michele',
    loadComponent: () => import('./pages/staff/michele/michele.component').then(m => m.MicheleComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
