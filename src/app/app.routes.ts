import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'weight-tracker',
    loadComponent: () => import('./features/weight-tracker/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'streaks',
    loadComponent: () => loadRemoteModule({
      remoteName: 'fitlog-streaks',
      exposedModule: './Component'
    }).then(m => m.StreaksComponent)
  },
  {
    path: 'trends',
    loadComponent: () => import('./features/weight-tracker/pages/charts/charts.component').then(m => m.ChartsComponent)
  }
];
