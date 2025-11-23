import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'weight-tracker',
    loadComponent: () => import('./features/weight-tracker/pages/home/home.component').then(m => m.HomeComponent)
  }
];
