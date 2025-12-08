import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { HeightSetupGuard } from './core/guards/height-setup.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'weight-tracker',
    loadComponent: () => import('./features/weight-tracker/pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [HeightSetupGuard]
  },
  {
    path: 'streaks',
    loadComponent: () => loadRemoteModule({
      remoteName: 'fitlog-streaks',
      exposedModule: './Component'
    }).then(m => m.StreaksComponent),
    canActivate: [HeightSetupGuard]
  },
  {
    path: 'trends',
    loadComponent: () => import('./features/weight-tracker/pages/charts/charts.component').then(m => m.ChartsComponent),
    canActivate: [HeightSetupGuard]
  },
  {
    path: 'setup',
    loadComponent: () => import('./features/weight-tracker/pages/setup/setup.component').then(m => m.SetupComponent)
  },
  {
    path: 'ai-insights',
    loadComponent: () => loadRemoteModule({
      remoteName: 'fitlog-ai-insights',
      exposedModule: './InsightsComponent'
    }).then(m => m.InsightsComponent)
  }
];
