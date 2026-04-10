import { Routes } from '@angular/router';

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
  { path: '**', redirectTo: 'dashboard' }
];
