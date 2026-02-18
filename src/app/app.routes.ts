import { Routes } from '@angular/router';
import { SearchViewComponent } from './features/search-view/components/organisms/search-view/search-view.component';
import { HomeComponent } from './features/home/components/organisms/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: SearchViewComponent,
    children: [
      {
        path: 'search',
        loadChildren: () => import('./core/routes/search.routes').then((m) => m.SEARCH_ROUTES),
      },
    ],
  },
];
