import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'search',
        loadChildren: () => import('./features/search/search.routes').then((m) => m.SEARCH_ROUTES)
      },
      { path: '', redirectTo: 'search/list', pathMatch: 'full' }
    ]
  }
];
