import { Routes } from '@angular/router';

export const frontofficeRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  }
];
