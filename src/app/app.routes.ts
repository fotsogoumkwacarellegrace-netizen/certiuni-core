import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'bulk', pathMatch: 'full' },
  
  { 
    path: 'bulk', 
    loadComponent: () => import('./components/bulk-dashboard/bulk-dashboard').then(m => m.BulkDashboardComponent) 
  },
  { path: '**', redirectTo: 'bulk' }
];