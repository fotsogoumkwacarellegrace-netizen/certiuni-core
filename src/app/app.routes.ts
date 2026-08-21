import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'verify', pathMatch: 'full' },

  {
    path: 'verify',
    loadComponent: () => import('./components/verify.component/verify.component')
      .then(m => m.VerifyComponent)
  },

  { path: '**', redirectTo: 'verify' }
];