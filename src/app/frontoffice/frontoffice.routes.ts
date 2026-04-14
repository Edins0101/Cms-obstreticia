import { Routes } from '@angular/router';
import { PageLayoutComponent } from './shared/layouts/page-layout.component';

export const FRONTOFFICE_ROUTES: Routes = [
  {
    path: '',
    component: PageLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'articulo/:id',
        loadComponent: () =>
          import('./pages/article-detail/article-detail.component').then(
            (m) => m.ArticleDetailComponent,
          ),
      },
      {
        path: 'categoria/:slug',
        loadComponent: () =>
          import('./pages/category/category.component').then((m) => m.CategoryComponent),
      },
    ],
  },
];
