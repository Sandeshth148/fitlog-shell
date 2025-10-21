import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'demo',
    loadComponent: () => import('./pages/demo/demo.component').then(m => m.DemoComponent)
  }
];
