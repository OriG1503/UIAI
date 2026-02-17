import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { HomeComponent } from './features/home/components/organisms/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'search',
        loadChildren: () => import('./core/routes/search.routes').then((m) => m.SEARCH_ROUTES)
      }
    ]
  }
];
